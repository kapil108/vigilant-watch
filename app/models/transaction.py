from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.sql import func
from app.db.base import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True) # UUID or provided ID
    account_id = Column(String, index=True)
    amount = Column(Float)
    currency = Column(String, default="USD")
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    merchant_category = Column(String)
    location_lat = Column(Float, nullable=True)
    location_lon = Column(Float, nullable=True)
    channel = Column(String) # UPI, Card, etc.
    is_flagged = Column(Boolean, default=False, index=True)
    risk_score = Column(Integer, default=0, nullable=False)
