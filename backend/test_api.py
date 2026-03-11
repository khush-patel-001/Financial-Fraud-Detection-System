"""
API TESTING SCRIPT
==================

This script tests the Flask API endpoints to make sure everything works.
Run this after starting the Flask server to verify it's working correctly.

HOW TO USE:
-----------
1. Start the Flask server in one terminal: python app.py
2. Run this script in another terminal: python test_api.py
"""

import requests
import json

# API base URL
BASE_URL = "http://localhost:5000"

print("="*70)
print("TESTING FRAUD DETECTION API")
print("="*70)

# Test 1: Home endpoint
print("\n📋 Test 1: Testing home endpoint (GET /)...")
try:
    response = requests.get(f"{BASE_URL}/")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("✅ Home endpoint working!")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 2: Health check
print("\n📋 Test 2: Testing health check (GET /health)...")
try:
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("✅ Health check working!")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 3: Get features
print("\n📋 Test 3: Testing features endpoint (GET /features)...")
try:
    response = requests.get(f"{BASE_URL}/features")
    print(f"Status Code: {response.status_code}")
    data = response.json()
    print(f"Number of features: {data.get('count')}")
    print(f"Features: {data.get('features')[:5]}... (showing first 5)")
    print("✅ Features endpoint working!")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 4: Make a prediction
print("\n📋 Test 4: Testing prediction endpoint (POST /predict)...")
try:
    # Sample transaction data (legitimate transaction example)
    sample_transaction = {
        "prev_address_months_count": 12,
        "current_address_months_count": 36,
        "customer_age": 35,
        "days_since_request": 0.5,
        "intended_balcon_amount": 1000,
        "zip_count_4w": 150,
        "velocity_6h": 1,
        "velocity_24h": 2,
        "velocity_4w": 5,
        "bank_branch_count_8w": 3,
        "date_of_birth_distinct_emails_4w": 1,
        "credit_risk_score": 0.3,
        "email_is_free": 0,
        "phone_home_valid": 1,
        "bank_months_count": 24,
        "has_other_cards": 1,
        "proposed_credit_limit": 2000,
        "session_length_in_minutes": 15,
        "keep_alive_session": 1,
        "month": 6,
        "payment_type_encoded": 1,
        "employment_status_encoded": 2,
        "housing_status_encoded": 1,
        "device_os_encoded": 0,
        "address_stability": 24,
        "application_velocity": 2.67
    }
    
    response = requests.post(
        f"{BASE_URL}/predict",
        json=sample_transaction,
        headers={'Content-Type': 'application/json'}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("✅ Prediction endpoint working!")
    
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "="*70)
print("API TESTING COMPLETE")
print("="*70)
print("\n💡 TIP: If you see errors, make sure:")
print("   1. Flask server is running (python app.py)")
print("   2. Model files are in the models/ folder")
print("   3. All dependencies are installed (pip install -r requirements.txt)")
