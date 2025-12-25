from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.alert import Alert
from app.schemas.alert import AlertResponse

router = APIRouter()

@router.get("/", response_model=list[AlertResponse])
def get_alerts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    alerts = db.query(Alert).order_by(Alert.id.desc()).offset(skip).limit(limit).all()
    return alerts

@router.post("/mark-read")
def mark_alerts_read(db: Session = Depends(get_db)):
    db.query(Alert).filter(Alert.status == 'new').update({Alert.status: 'read'}, synchronize_session=False)
    db.commit()
    return {"status": "success", "message": "All alerts marked as read"}
