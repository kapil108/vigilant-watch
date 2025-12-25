from pydantic import BaseModel
from datetime import datetime
from typing import List

class TimeSeriesPoint(BaseModel):
    timestamp: str  # Format: "HH:00" or similar for frontend
    count: int

class AnomalyStats(BaseModel):
    total_anomalies: int
    recent_anomalies_24h: int
    series: List[TimeSeriesPoint]

class CategoryStat(BaseModel):
    category: str
    fraud_count: int

class TimePattern(BaseModel):
    hour: str
    fraud_count: int

class TimeAnalysis(BaseModel):
    series: List[TimePattern]
    peak_hour: str
    safest_hour: str

class RuleStat(BaseModel):
    rule: str
    count: int
    percentage: float
    avg_score: float = 0.0

class GeoStat(BaseModel):
    country: str
    count: int
    risk_level: str

class AnalyticsResponse(BaseModel):
    categories: List[CategoryStat]
    time_patterns: List[TimePattern]
    rule_contributions: List[RuleStat]
    geographic_distribution: List[GeoStat]
