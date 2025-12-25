import sys
import os
import joblib
import pandas as pd
from sqlalchemy import create_engine
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder
from app.core.config import settings

# Ensure we can import app modules
sys.path.append(os.getcwd())

def train_model():
    print("🚀 Starting Model Training...")
    
    # 1. Connect to DB
    db_url = settings.DATABASE_URL
    if db_url.startswith("sqlite"):
        engine = create_engine(db_url)
    else:
        # Fallback/Postgres setup if needed
        engine = create_engine(db_url)

    # 2. Fetch Data
    print("📊 Fetching transaction history...")
    query = "SELECT amount, merchant_category FROM transactions"
    df = pd.read_sql(query, engine)
    
    if len(df) < 10:
        print("⚠️ Not enough data to train (need > 10 transactions). using mock data for demo.")
        # Create dummy data for initial training if DB is empty
        df = pd.DataFrame({
            'amount': [10.0, 20.0, 15.0, 100.0, 50.0, 12.0, 25.0, 18.0, 22.0, 90.0, 1500.0, 5000.0],
            'merchant_category': ['retail', 'food', 'retail', 'travel', 'retail', 'food', 'retail', 'food', 'retail', 'electronics', 'luxury', 'luxury']
        })

    # 3. Preprocessing
    print("🔧 Preprocessing features...")
    # Encode Categories: Retail=1, Travel=2, etc.
    le = LabelEncoder()
    df['category_code'] = le.fit_transform(df['merchant_category'])
    
    # Select Features: Amount and Category
    X = df[['amount', 'category_code']]
    
    # 4. Train Model
    # contamination=0.05 means we expect ~5% of data to be anomalies
    print("🧠 Training Isolation Forest...")
    clf = IsolationForest(contamination=0.05, random_state=42)
    clf.fit(X)
    
    # 5. Save Artifacts
    os.makedirs("app/ml_models", exist_ok=True)
    
    # Save the Model
    joblib.dump(clf, "app/ml_models/isolation_forest.pkl")
    
    # Save the Label Encoder (to encode future categories)
    joblib.dump(le, "app/ml_models/label_encoder.pkl")
    
    print("✅ Model saved to app/ml_models/isolation_forest.pkl")
    print("✅ Label Encoder saved to app/ml_models/label_encoder.pkl")
    
    # Quick Test
    test_normal = [[25.0, le.transform(['retail'])[0]]]
    test_anomaly = [[5000.0, le.transform(['luxury'])[0]]] if 'luxury' in le.classes_ else [[99999.0, 0]]
    
    print(f"Test Normal ($25 Retail): {clf.decision_function(test_normal)[0]:.4f} (Pos is safe)")
    print(f"Test Anomaly ($5k): {clf.decision_function(test_anomaly)[0]:.4f} (Neg is anomaly)")

if __name__ == "__main__":
    train_model()
