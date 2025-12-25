from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AlertBase(BaseModel):
    transaction_id: str
    rule_triggered: str
    severity: str
    details: Optional[str] = None

class AlertCreate(AlertBase):
    pass

class AlertResponse(AlertBase):
    id: int
    timestamp: datetime
    status: str

    class Config:
        from_attributes = True
