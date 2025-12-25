from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.base import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, ForeignKey("transactions.id"), index=True)
    rule_triggered = Column(String)
    severity = Column(String) # High, Medium, Low
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    details = Column(String, nullable=True)
    status = Column(String, default='new') # new, read
