import urllib.request
import json
import time
import uuid

BASE_URL = "http://localhost:8000/api/v1/transactions/"

def send_transaction(amount, account_id="acc_demo_001"):
    data = {
        "id": str(uuid.uuid4()),
        "account_id": account_id,
        "amount": amount,
        "merchant_category": "retail",
        "channel": "online",
        "currency": "USD"
    }
    
    req = urllib.request.Request(
        BASE_URL,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            result = json.load(response)
            status = "🔴 FRAUD" if result.get('is_flagged') else "🟢 SAFE"
            print(f"Transaction Amount: ${amount:<7} | Status: {status}")
            if result.get('is_flagged'):
                print(f"   Reason: Transaction flagged by system!")
    except Exception as e:
        # Read the error body if possible
        try:
             error_body = e.read().decode()
             print(f"Error: {e} - Body: {error_body}")
        except:
             print(f"Error: {e}")

print("--- 1. Testing Safe Transaction (Rule: <= $10,000) ---")
send_transaction(500.0)
time.sleep(1)

print("\n--- 2. Testing High Amount Fraud (Rule: > $10,000) ---")
send_transaction(15000.0)
time.sleep(1)

print("\n--- 3. Testing Velocity Fraud (Rule: >= 3 tx in 5 mins) ---")
print("Sending 3 rapid transactions...")
send_transaction(100.0, account_id="acc_rapid_001")
send_transaction(100.0, account_id="acc_rapid_001")
send_transaction(100.0, account_id="acc_rapid_001")
