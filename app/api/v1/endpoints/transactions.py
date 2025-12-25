from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.api.v1.endpoints import transactions
from app.db.session import get_db
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.services.fraud_detector import FraudDetector
import app.models.transaction
import uuid

# We need to recreate the router to overwrite the placeholder
router = APIRouter()

@router.post("/", response_model=TransactionResponse)
def ingest_transaction(
    transaction: TransactionCreate, 
    db: Session = Depends(get_db)
):
    # Ensure ID
    if not transaction.id:
        transaction.id = str(uuid.uuid4())
    
    detector = FraudDetector(db)
    # Synchronous processing for now
    db_transaction, alert = detector.process_transaction(transaction)
    
    return db_transaction

@router.get("/", response_model=list[TransactionResponse])
def get_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transactions = db.query(app.models.transaction.Transaction).order_by(app.models.transaction.Transaction.timestamp.desc()).offset(skip).limit(limit).all()
    return transactions
