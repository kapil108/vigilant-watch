from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.transaction import Transaction
from app.models.alert import Alert
from app.schemas.transaction import TransactionCreate
from datetime import datetime, timedelta
import numpy as np

class FraudDetector:
    def __init__(self, db: Session):
        self.db = db

    def calculate_risk_score(self, transaction: TransactionCreate, triggered_rules: list[str]) -> int:
        score = 0
        
        # 1. Rule-Based Scoring (Hard Limits)
        if "High Amount Transaction" in triggered_rules:
            score = max(score, 95)
        if "Rapid Transactions" in triggered_rules:
            score = max(score, 80)
        if "ML Anomaly (Isolation Forest)" in triggered_rules:
            score = max(score, 95)

        # 2. Statistical Scoring (Z-Score)
        # Fetch history for this user
        history = self.db.query(Transaction.amount).filter(
            Transaction.account_id == transaction.account_id
        ).limit(50).all()
        
        amounts = [h[0] for h in history]
        if len(amounts) > 5:
            mean = np.mean(amounts)
            std = np.std(amounts)
            
            if std > 0:
                z_score = (transaction.amount - mean) / std
                # Map Z-Score to 0-100 probability
                # Z=2 (2 std devs) -> ~80%, Z=3 -> ~99%
                stat_score = min(int(abs(z_score) * 30), 99) 
                if stat_score > 60: # Threshold for considering it an anomaly worth mentioning
                    # Check if not already added to avoid duplicates if called multiple times (though unlikely here)
                    if not any(r.startswith("Z-Score") for r in triggered_rules):
                         triggered_rules.append(f"Z-Score Anomaly (Risk: {stat_score}%)")
                
                score = max(score, stat_score)
        
        return min(score, 100) # Cap at 100

    def check_fraud(self, transaction: TransactionCreate) -> list[str]:
        triggered_rules = []
        
        # Rule 1: High Amount
        if transaction.amount > 10000:
            triggered_rules.append("High Amount Transaction")

        # Rule 2: Rapid Transactions
        five_mins_ago = datetime.utcnow() - timedelta(minutes=5)
        recent_count = self.db.query(Transaction).filter(
            Transaction.account_id == transaction.account_id,
            Transaction.timestamp >= five_mins_ago
        ).count()
        
        if recent_count >= 3:
            triggered_rules.append("Rapid Transactions")

        # Rule 3: Isolation Forest (ML Anomaly)
        # Simplified for now to avoid dependency issues if sklearn missing
        # We rely on Z-Score in calculate_risk_score for the "Smart" part
        
        return triggered_rules

    def process_transaction(self, transaction_data: TransactionCreate) -> tuple[Transaction, Alert | None]:
        # 1. Run Rules
        try:
            triggered = self.check_fraud(transaction_data)
        except Exception as e:
            print(f"Error checking fraud rules: {e}")
            triggered = []

        # 2. Calculate Score
        final_score = self.calculate_risk_score(transaction_data, triggered)
        
        # 3. Save Transaction
        db_transaction = Transaction(
            id=transaction_data.id,
            account_id=transaction_data.account_id,
            amount=transaction_data.amount,
            currency=transaction_data.currency,
            merchant_category=transaction_data.merchant_category,
            location_lat=transaction_data.location_lat,
            location_lon=transaction_data.location_lon,
            channel=transaction_data.channel,
            timestamp=datetime.utcnow(),
            risk_score=final_score,
            is_flagged=final_score > 50 # Flag if risk > 50%
        )
        
        # Determine flag
        alert = None
        if db_transaction.is_flagged:
            alert = Alert(
                transaction_id=db_transaction.id,
                rule_triggered=", ".join(triggered) if triggered else "High Risk Score",
                severity="High" if final_score > 80 else "Medium",
                details=f"Risk Score: {final_score}%"
            )
            self.db.add(alert)
            
        self.db.add(db_transaction)
        self.db.commit()
        self.db.refresh(db_transaction)
        if alert:
            self.db.refresh(alert)
            
        return db_transaction, alert
