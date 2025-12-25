import sys
import os
sys.path.append(os.getcwd())
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.session import get_db
from app.db.base import Base
from app.models.transaction import Transaction
from app.models.alert import Alert
import pytest

# Use SQLite for testing to avoid Postgres dependency issues during verification
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

if os.path.exists("./test.db"):
    os.remove("./test.db")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Fraud Detection System API"}

def test_create_transaction_clean():
    response = client.post(
        "/api/v1/transactions/",
        json={
            "id": "trans1",
            "account_id": "acc1",
            "amount": 100.0,
            "merchant_category": "food",
            "channel": "card"
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_flagged"] == False

def test_create_transaction_high_amount():
    response = client.post(
        "/api/v1/transactions/",
        json={
            "id": "trans2",
            "account_id": "acc1",
            "amount": 20000.0,
            "merchant_category": "jewelry",
            "channel": "card"
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_flagged"] == True
    
    # Check alert
    response = client.get("/api/v1/alerts/")
    assert response.status_code == 200
    alerts = response.json()
    assert len(alerts) > 0
    assert alerts[-1]["transaction_id"] == "trans2"

def test_statistical_anomaly():
    # Helper to add history
    db = TestingSessionLocal()
    # Add many small transactions to establish low mean/stddev
    for i in range(10):
        client.post(
            "/api/v1/transactions/",
            json={
                "id": f"hist_{i}",
                "account_id": "acc_stats",
                "amount": 50.0 + i, # 50, 51, ... 59
                "merchant_category": "food",
                "channel": "card"
            },
        )
    
    # Now add a huge outlier
    response = client.post(
        "/api/v1/transactions/",
        json={
            "id": "trans_anomaly",
            "account_id": "acc_stats",
            "amount": 5000.0, # Huge jump
            "merchant_category": "electronics",
            "channel": "card"
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_flagged"] == True
    
    # Verify alert reason
    response = client.get("/api/v1/alerts/")
    alerts = response.json()
    latest_alert = next(a for a in alerts if a["transaction_id"] == "trans_anomaly")
    assert "Z-Score" in latest_alert["rule_triggered"]

if __name__ == "__main__":
    import sys
    # Manually run tests if executed as script
    try:
        test_read_main()
        print("test_read_main PASSED")
        test_create_transaction_clean()
        print("test_create_transaction_clean PASSED")
        test_create_transaction_high_amount()
        print("test_create_transaction_high_amount PASSED")
        test_statistical_anomaly()
        print("test_statistical_anomaly PASSED")
    except AssertionError as e:
        print(f"TEST FAILED: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
