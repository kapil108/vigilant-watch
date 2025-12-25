from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TransactionBase(BaseModel):
    account_id: str
    amount: float
    currency: str = "USD"
    merchant_category: str
    location_lat: Optional[float] = None
    location_lon: Optional[float] = None
    channel: str

class TransactionCreate(TransactionBase):
    id: str  # Allow client to provide ID or we generate (usually client provides for idempotency)

class TransactionResponse(TransactionBase):
    id: str
    timestamp: datetime
    is_flagged: bool
    risk_score: int

    class Config:
        from_attributes = True
