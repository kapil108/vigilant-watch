from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, text, or_
from app.db.session import get_db
from app.models.alert import Alert
from app.schemas.analytics import AnomalyStats, TimeSeriesPoint
from typing import List
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/anomaly", response_model=AnomalyStats)
def get_anomaly_stats(db: Session = Depends(get_db)):
    # 1. Total Anomalies (All time)
    # We include explicitly flagged Anomalies OR High Amount transactions as they are deviations
    total_query = db.query(Alert).filter(
        or_(
            Alert.rule_triggered.like("%Anomaly%"),
            Alert.rule_triggered.like("%High Amount%"),
            Alert.severity == "High"
        )
    )
    total_anomalies = total_query.count()

    # 2. Recent Anomalies (Last 24h)
    twenty_four_hours_ago = datetime.utcnow() - timedelta(hours=24)
    recent_query = total_query.filter(Alert.timestamp >= twenty_four_hours_ago)
    recent_anomalies = recent_query.count()

    # 3. Time Series (Group by Hour for the last 24h)
    # This is a bit database-specific (SQLite vs Postgres). 
    # For SQLite compatibility in this Docker setup, we'll do python-side aggregation 
    # if the dataset is small, or basic SQL grouping.
    # Given the scale, fetching recent alerts and aggregating in Python is safer/easier for demo.
    
    recent_alerts = recent_query.all()
    
    # Bucket by hour
    buckets = {}
    
    # Initialize buckets for last 24h
    now = datetime.utcnow()
    for i in range(24):
        t = now - timedelta(hours=i)
        key = t.strftime("%H:00")
        buckets[key] = 0

    for alert in recent_alerts:
        # alert.created_at is datetime
        key = alert.timestamp.strftime("%H:00")
        if key in buckets:
            buckets[key] += 1
            
    # Convert to list ensuring chronological order (reversed from the loop above isn't strict, 
    # but we want graph from -24h to Now)
    
    sorted_keys = sorted(buckets.keys()) # This sorts 00:00 to 23:00, which might not be "Last 24h" order if crossing midnight.
    # Better approach: List of last 24 hours in order
    
    series = []
    for i in range(23, -1, -1):
        t = now - timedelta(hours=i)
        key = t.strftime("%H:00")
        count = buckets.get(key, 0)
        series.append(TimeSeriesPoint(timestamp=key, count=count))

    return AnomalyStats(
        total_anomalies=total_anomalies,
        recent_anomalies_24h=recent_anomalies,
        series=series
    )

from app.models.transaction import Transaction
from app.schemas.analytics import CategoryStat, TimePattern, RuleStat, GeoStat, TimeAnalysis

# ... existing imports ...

@router.get("/fraud-by-category", response_model=List[CategoryStat])
def get_fraud_by_category(db: Session = Depends(get_db)):
    # Get count of fraud transactions by category
    results = db.query(
        Transaction.merchant_category, 
        func.count(Transaction.id)
    ).filter(
        (Transaction.is_flagged == True) | (Transaction.risk_score > 80)
    ).group_by(Transaction.merchant_category).all()
    
    return [CategoryStat(category=cat or "Unknown", fraud_count=count) for cat, count in results]

@router.get("/fraud-time-pattern", response_model=List[TimePattern])
def get_fraud_time_pattern(db: Session = Depends(get_db)):
    # Basic aggregation by hour for fraud transactions
    fraud_txs = db.query(Transaction.timestamp).filter(
        (Transaction.is_flagged == True) | (Transaction.risk_score > 80)
    ).all()
    
    buckets = {f"{h:02d}:00": 0 for h in range(24)}
    
    for tx in fraud_txs:
        hour_key = tx.timestamp.strftime("%H:00")
        if hour_key in buckets:
            buckets[hour_key] += 1
            
    # Simple list return
    return [TimePattern(hour=k, fraud_count=v) for k, v in buckets.items()]

@router.get("/rule-contribution", response_model=List[RuleStat])
def get_rule_contribution(db: Session = Depends(get_db)):
    # Aggregate specific deterministic rules (excluding anomalies)
    alerts = db.query(Alert.rule_triggered).all()
    
    rule_counts = {}
    total_rules = 0
    
    for alert in alerts:
        if alert.rule_triggered:
            rules = alert.rule_triggered.split(", ")
            for rule in rules:
                # Exclude anomaly/ML rules
                if "Anomaly" not in rule and "Z-Score" not in rule:
                    rule_counts[rule] = rule_counts.get(rule, 0) + 1
                    total_rules += 1
                
    stats = []
    for rule, count in rule_counts.items():
        percentage = round((count / total_rules * 100), 1) if total_rules > 0 else 0
        stats.append(RuleStat(rule=rule, count=count, percentage=percentage))
        
    return sorted(stats, key=lambda x: x.count, reverse=True)[:5]

@router.get("/anomaly-distribution", response_model=List[RuleStat])
def get_anomaly_distribution(db: Session = Depends(get_db)):
    # Aggregate only anomaly-based rules with risk scores
    # Join Alert and Transaction to access risk_score
    results = db.query(
        Alert.rule_triggered, 
        Transaction.risk_score
    ).join(
        Transaction, Alert.transaction_id == Transaction.id
    ).all()
    
    rule_stats = {} # rule -> {count, total_score}
    total_rules = 0
    
    for rule_triggered, risk_score in results:
        if rule_triggered:
            rules = rule_triggered.split(", ")
            for rule in rules:
                # Include only anomaly/ML rules
                if "Anomaly" in rule or "Z-Score" in rule:
                    clean_rule = rule
                    if "Z-Score" in rule:
                        clean_rule = "Statistical Anomaly (Z-Score)"
                    elif "Isolation Forest" in rule:
                        clean_rule = "ML Anomaly (Isolation Forest)"
                        
                    if clean_rule not in rule_stats:
                        rule_stats[clean_rule] = {"count": 0, "total_score": 0}
                    
                    rule_stats[clean_rule]["count"] += 1
                    rule_stats[clean_rule]["total_score"] += risk_score
                    total_rules += 1
                
    stats = []
    for rule, data in rule_stats.items():
        count = data["count"]
        percentage = round((count / total_rules * 100), 1) if total_rules > 0 else 0
        avg = round(data["total_score"] / count, 1) if count > 0 else 0
        stats.append(RuleStat(rule=rule, count=count, percentage=percentage, avg_score=avg))
        
    return sorted(stats, key=lambda x: x.count, reverse=True)

@router.get("/geographic-distribution", response_model=List[GeoStat])
def get_geographic_distribution(db: Session = Depends(get_db)):
    # Simulate countries based on mock lat/lon or simple random for demo
    # In real app, would use reverse geocoding
    # We'll return some static stats mixed with real counts if possible, 
    # but since we don't have country column, let's just return a static list 
    # influenced by total fraud count to make it feel somewhat dynamic.
    
    fraud_count = db.query(Transaction).filter(Transaction.is_flagged == True).count()
    
    # Deterministic "simulation"
    return [
        GeoStat(country="Nigeria", count=int(fraud_count * 0.3) + 5, risk_level="high"),
        GeoStat(country="Russia", count=int(fraud_count * 0.25) + 3, risk_level="high"),
        GeoStat(country="China", count=int(fraud_count * 0.2) + 2, risk_level="medium"),
        GeoStat(country="Brazil", count=int(fraud_count * 0.15) + 1, risk_level="medium"),
        GeoStat(country="USA", count=int(fraud_count * 0.1), risk_level="low"),
    ]
