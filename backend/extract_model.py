"""
MODEL EXTRACTION SCRIPT
=======================

This script extracts the trained model from your Jupyter notebook
and prepares it for use in the Flask API.

WHAT THIS SCRIPT DOES:
1. Recreates the model training pipeline from your notebook
2. Saves the model, scaler, and feature names in the 'models' folder
3. These files will be used by the Flask API for predictions

HOW TO USE:
-----------
1. Make sure you have the Base.csv file in a 'data' folder
2. Run: python extract_model.py
3. This will create the models folder with all necessary files

If you already have the .pkl files from your notebook, you can:
1. Create a 'models' folder in the backend directory
2. Copy gb_fraud_detector.pkl, scaler.pkl, and feature_names.pkl to that folder
"""

import pandas as pd
import numpy as np
import joblib
import os
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.feature_selection import VarianceThreshold
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from imblearn.over_sampling import RandomOverSampler
import warnings
warnings.filterwarnings('ignore')

print("="*70)
print("FRAUD DETECTION MODEL EXTRACTION SCRIPT")
print("="*70)

# Check if data file exists
if not os.path.exists('data/Base.csv'):
    print("\n⚠ ERROR: data/Base.csv not found!")
    print("\nPLEASE DO ONE OF THE FOLLOWING:")
    print("1. Create a 'data' folder and add Base.csv to it")
    print("   OR")
    print("2. If you already have the model files (.pkl), create a 'models' folder")
    print("   and copy these files into it:")
    print("   - gb_fraud_detector.pkl")
    print("   - scaler.pkl")
    print("   - feature_names.pkl")
    exit(1)

print("\n📖 Step 1: Loading dataset...")
transactions = pd.read_csv('data/Base.csv')
print(f"✓ Dataset loaded: {transactions.shape[0]} rows, {transactions.shape[1]} columns")

print("\n🔧 Step 2: Encoding categorical variables...")
label_encoder = LabelEncoder()
transactions['payment_type_encoded'] = label_encoder.fit_transform(transactions['payment_type'])
transactions['employment_status_encoded'] = label_encoder.fit_transform(transactions['employment_status'])
transactions['housing_status_encoded'] = label_encoder.fit_transform(transactions['housing_status'])
transactions['device_os_encoded'] = label_encoder.fit_transform(transactions['device_os'])
print("✓ Categorical variables encoded")

print("\n🔧 Step 3: One-hot encoding source variable...")
source_encoded = pd.get_dummies(transactions['source'], prefix='source')
transactions_encoded = pd.concat([transactions, source_encoded], axis=1)
transactions_encoded = transactions_encoded.drop(['source', 'payment_type', 'employment_status', 'housing_status', 'device_os'], axis=1)
print("✓ Source variable encoded")

print("\n🔧 Step 4: Feature engineering...")
transactions_encoded['address_stability'] = transactions_encoded['current_address_months_count'] - transactions_encoded['prev_address_months_count']
transactions_encoded['application_velocity'] = (transactions_encoded['velocity_6h'] + transactions_encoded['velocity_24h'] + transactions_encoded['velocity_4w']) / 3
print("✓ Engineered features created")

print("\n🔍 Step 5: Feature selection using VarianceThreshold...")
threshold = 0.1
variance_selector = VarianceThreshold(threshold=threshold)
variance_selector.fit(transactions_encoded)
selected_features_mask = variance_selector.get_support()
selected_features = transactions_encoded.columns[selected_features_mask]
X_selected = transactions_encoded[selected_features]
print(f"✓ Selected {len(selected_features)} features")

print("\n📊 Step 6: Preparing features and target...")
X = transactions_encoded.drop(['fraud_bool', 'device_fraud_count', 'income', 'name_email_similarity', 
                               'phone_mobile_valid', 'foreign_request', 'device_distinct_emails_8w', 
                               'source_INTERNET', 'source_TELEAPP'], axis=1)
y = transactions_encoded['fraud_bool']
print(f"✓ Features prepared: {X.shape[1]} features")
print(f"✓ Target variable: {y.shape[0]} samples")

print("\n⚖️ Step 7: Handling class imbalance with RandomOverSampler...")
oversampler = RandomOverSampler(random_state=42)
X_resampled, y_resampled = oversampler.fit_resample(X_selected, y)
print(f"✓ Resampled dataset: {X_resampled.shape[0]} samples")

print("\n✂️ Step 8: Splitting data into train and test sets...")
X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)
print(f"✓ Training set: {X_train.shape[0]} samples")
print(f"✓ Test set: {X_test.shape[0]} samples")

print("\n📏 Step 9: Scaling features...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
print("✓ Features scaled using StandardScaler")

print("\n🤖 Step 10: Training Gradient Boosting Classifier...")
print("This may take a few minutes...")
gb_classifier = GradientBoostingClassifier(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=5,
    random_state=42
)
gb_classifier.fit(X_train_scaled, y_train)
print("✓ Model trained successfully!")

print("\n📊 Step 11: Evaluating model performance...")
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
y_pred = gb_classifier.predict(X_test_scaled)

accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print(f"✓ Accuracy:  {accuracy:.2%}")
print(f"✓ Precision: {precision:.2%}")
print(f"✓ Recall:    {recall:.2%}")
print(f"✓ F1 Score:  {f1:.2%}")

print("\n💾 Step 12: Saving model artifacts...")
os.makedirs('models', exist_ok=True)

joblib.dump(gb_classifier, 'models/gb_fraud_detector.pkl')
print("✓ Model saved: models/gb_fraud_detector.pkl")

joblib.dump(scaler, 'models/scaler.pkl')
print("✓ Scaler saved: models/scaler.pkl")

joblib.dump(list(X_train.columns), 'models/feature_names.pkl')
print("✓ Feature names saved: models/feature_names.pkl")

print("\n" + "="*70)
print("✅ SUCCESS! MODEL EXTRACTION COMPLETE")
print("="*70)
print("\nYou can now use these files in your Flask API:")
print("  - models/gb_fraud_detector.pkl  (trained model)")
print("  - models/scaler.pkl              (feature scaler)")
print("  - models/feature_names.pkl       (list of features)")
print("\nNext step: Run the Flask API using 'python app.py'")
print("="*70)
