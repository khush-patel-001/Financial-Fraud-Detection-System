"""
FRAUD DETECTION BACKEND - FLASK REST API
=========================================
Backend server for Financial Fraud Detection System
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import traceback
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# =====================================================
# LOAD MODEL FILES
# =====================================================

try:
    MODEL_PATH = 'models/gb_fraud_detector.pkl'
    SCALER_PATH = 'models/scaler.pkl'
    FEATURES_PATH = 'models/feature_names.pkl'

    print("\nLoading model artifacts...")

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model not found: {MODEL_PATH}")

    if not os.path.exists(SCALER_PATH):
        raise FileNotFoundError(f"Scaler not found: {SCALER_PATH}")

    if not os.path.exists(FEATURES_PATH):
        raise FileNotFoundError(f"Feature file not found: {FEATURES_PATH}")

    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    feature_names = joblib.load(FEATURES_PATH)

    print("✓ Model loaded successfully")
    print("✓ Model type:", type(model).__name__)
    print("✓ Number of features:", len(feature_names))

except Exception as e:

    print("ERROR loading model files:")
    print(str(e))

    model = None
    scaler = None
    feature_names = None


# =====================================================
# HOME ROUTE
# =====================================================

@app.route('/', methods=['GET'])
def home():

    return jsonify({
        'message': 'Fraud Detection API is running',
        'status': 'active',
        'endpoints': {
            '/predict': 'POST - Fraud prediction',
            '/health': 'GET - API health',
            '/features': 'GET - Required features'
        }
    })


# =====================================================
# HEALTH CHECK
# =====================================================

@app.route('/health', methods=['GET'])
def health_check():

    if model is not None:

        return jsonify({
            'status': 'healthy',
            'model_loaded': True,
            'features_loaded': feature_names is not None
        }), 200

    return jsonify({
        'status': 'unhealthy',
        'model_loaded': False
    }), 500


# =====================================================
# FEATURE LIST
# =====================================================

@app.route('/features', methods=['GET'])
def get_features():

    if feature_names is None:

        return jsonify({
            'error': 'Feature names not loaded'
        }), 500

    return jsonify({
        'features': feature_names,
        'count': len(feature_names)
    })


# =====================================================
# PREDICTION ENDPOINT
# =====================================================

@app.route('/predict', methods=['POST'])
def predict():

    try:

        if model is None or scaler is None:

            return jsonify({
                'error': 'Model or scaler not loaded'
            }), 500

        data = request.get_json()

        if not data:

            return jsonify({
                'error': 'No JSON data received'
            }), 400

        print("\n" + "="*60)
        print("NEW PREDICTION REQUEST")
        print("="*60)

        feature_values = []
        missing_features = []

        # Ensure correct feature order
        for feature in feature_names:

            if feature in data:

                try:
                    value = float(data[feature])
                except:
                    value = 0

                feature_values.append(value)

            else:
                missing_features.append(feature)
                feature_values.append(0)

        if missing_features:

            print("WARNING: Missing features:", missing_features)

        # Convert to numpy
        features_array = np.array(feature_values).reshape(1, -1)

        print("Input feature shape:", features_array.shape)

        # Scale features
        features_scaled = scaler.transform(features_array)

        print("✓ Features scaled")

        # Predict probabilities
        prediction_proba = model.predict_proba(features_scaled)[0]

        legit_probability = prediction_proba[0]
        fraud_probability = prediction_proba[1]

        # =================================================
        # CUSTOM FRAUD THRESHOLD
        # =================================================

        threshold = 0.35

        prediction = 1 if fraud_probability > threshold else 0

        result = "Fraud Transaction" if prediction == 1 else "Legitimate Transaction"

        confidence = max(legit_probability, fraud_probability) * 100

        print("\nPrediction Results")
        print("-------------------")
        print("Fraud Probability:", fraud_probability)
        print("Legitimate Probability:", legit_probability)
        print("Prediction:", result)
        print("Confidence:", confidence)
        print("="*60 + "\n")

        response = {

            "prediction": result,
            "fraud_probability": round(fraud_probability * 100, 2),
            "legitimate_probability": round(legit_probability * 100, 2),
            "confidence": round(confidence, 2),
            "is_fraud": bool(prediction)

        }

        return jsonify(response), 200


    except Exception as e:

        print("\nERROR DURING PREDICTION")
        print(traceback.format_exc())

        return jsonify({
            "error": "Prediction failed",
            "details": str(e)
        }), 500


# =====================================================
# RUN SERVER
# =====================================================

if __name__ == '__main__':

    print("\n" + "="*60)
    print("🚀 FRAUD DETECTION API STARTING")
    print("="*60)
    print("Server URL: http://localhost:5001")
    print("Available endpoints:")
    print("GET  /")
    print("GET  /health")
    print("GET  /features")
    print("POST /predict")
    print("="*60 + "\n")

    app.run(host='0.0.0.0', port=5001, debug=True)