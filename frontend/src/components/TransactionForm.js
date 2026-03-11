/**
 * TRANSACTION FORM COMPONENT
 * ===========================
 * 
 * This is the heart of our frontend - the form where users input transaction data.
 * 
 * HOW IT WORKS (Simple explanation):
 * 1. User fills out the form with transaction details
 * 2. User clicks "Analyze Transaction"
 * 3. We send the data to our Flask backend using Axios
 * 4. Backend returns prediction (fraud or legitimate)
 * 5. We display the result with nice animations
 * 
 * REACT CONCEPTS USED:
 * - useState: Stores form data and results in memory
 * - useEffect: Runs code when component loads
 * - Axios: Makes HTTP requests to our backend
 * - Event handlers: Respond to user actions (onClick, onChange)
 */

import React, { useState } from 'react';
import axios from 'axios';
import ResultDisplay from './ResultDisplay';
import './TransactionForm.css';

// Backend API URL - Change this if your backend runs on a different port
const API_URL = 'http://localhost:5001';

function TransactionForm() {
  /**
   * STATE MANAGEMENT
   * ----------------
   * useState is React's way of remembering data
   * Think of it like variables that trigger re-rendering when they change
   */
  
  // Form data - stores all input values
  const [formData, setFormData] = useState({
    prev_address_months_count: '',
    current_address_months_count: '',
    customer_age: '',
    days_since_request: '',
    intended_balcon_amount: '',
    zip_count_4w: '',
    velocity_6h: '',
    velocity_24h: '',
    velocity_4w: '',
    bank_branch_count_8w: '',
    date_of_birth_distinct_emails_4w: '',
    credit_risk_score: '',
    email_is_free: '0',
    phone_home_valid: '1',
    bank_months_count: '',
    has_other_cards: '0',
    proposed_credit_limit: '',
    session_length_in_minutes: '',
    keep_alive_session: '1',
    month: '',
    payment_type_encoded: '0',
    employment_status_encoded: '0',
    housing_status_encoded: '0',
    device_os_encoded: '0',
    address_stability: '',
    application_velocity: ''
  });

  // Prediction result from backend
  const [result, setResult] = useState(null);
  
  // Loading state - shows spinner while waiting for backend
  const [loading, setLoading] = useState(false);
  
  // Error message if something goes wrong
  const [error, setError] = useState('');

  /**
   * EVENT HANDLERS
   * --------------
   * These functions run when user interacts with the form
   */

  // Handle input changes
  // This runs every time user types in any field
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prevState => ({
      ...prevState,  // Keep all other fields the same
      [name]: value  // Update only the field that changed
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh (default form behavior)
    
    setLoading(true);   // Show loading spinner
    setError('');       // Clear any previous errors
    setResult(null);    // Clear previous result
    
    try {
      // Convert form data to numbers
      // The backend expects numbers, but form inputs give us strings
      const processedData = {};
      for (let key in formData) {
        processedData[key] = formData[key] === '' ? 0 : parseFloat(formData[key]);
      }
      
      // Auto-calculate engineered features
      processedData.address_stability = 
        processedData.current_address_months_count - processedData.prev_address_months_count;
      
      processedData.application_velocity = 
        (processedData.velocity_6h + processedData.velocity_24h + processedData.velocity_4w) / 3;
      
      console.log('Sending data to backend:', processedData);
      
      // Make HTTP POST request to backend
      const response = await axios.post(
        `${API_URL}/predict`,
        processedData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Response from backend:', response.data);
      
      // Store the result
      setResult(response.data);
      
    } catch (err) {
      // Handle errors
      console.error('Error:', err);
      
      if (err.response) {
        // Backend returned an error
        setError(err.response.data.error || 'An error occurred during prediction');
      } else if (err.request) {
        // Backend didn't respond
        setError('Cannot connect to the backend server. Make sure it\'s running on port 5001.');
      } else {
        // Something else went wrong
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Reset form to initial state
  const handleReset = () => {
    setFormData({
      prev_address_months_count: '',
      current_address_months_count: '',
      customer_age: '',
      days_since_request: '',
      intended_balcon_amount: '',
      zip_count_4w: '',
      velocity_6h: '',
      velocity_24h: '',
      velocity_4w: '',
      bank_branch_count_8w: '',
      date_of_birth_distinct_emails_4w: '',
      credit_risk_score: '',
      email_is_free: '0',
      phone_home_valid: '1',
      bank_months_count: '',
      has_other_cards: '0',
      proposed_credit_limit: '',
      session_length_in_minutes: '',
      keep_alive_session: '1',
      month: '',
      payment_type_encoded: '0',
      employment_status_encoded: '0',
      housing_status_encoded: '0',
      device_os_encoded: '0',
      address_stability: '',
      application_velocity: ''
    });
    setResult(null);
    setError('');
  };

  // Fill with sample data for testing
  const fillSampleData = () => {
    setFormData({
      prev_address_months_count: '12',
      current_address_months_count: '36',
      customer_age: '35',
      days_since_request: '0.5',
      intended_balcon_amount: '1000',
      zip_count_4w: '150',
      velocity_6h: '1',
      velocity_24h: '2',
      velocity_4w: '5',
      bank_branch_count_8w: '3',
      date_of_birth_distinct_emails_4w: '1',
      credit_risk_score: '0.3',
      email_is_free: '0',
      phone_home_valid: '1',
      bank_months_count: '24',
      has_other_cards: '1',
      proposed_credit_limit: '2000',
      session_length_in_minutes: '15',
      keep_alive_session: '1',
      month: '6',
      payment_type_encoded: '1',
      employment_status_encoded: '2',
      housing_status_encoded: '1',
      device_os_encoded: '0',
      address_stability: '24',
      application_velocity: '2.67'
    });
  };

  /**
   * RENDER THE FORM
   * ---------------
   * This is what users see on their screen
   */
  return (
    <div className="transaction-form-container">
      <div className="form-actions">
        <button type="button" onClick={fillSampleData} className="btn-secondary">
          📝 Fill Sample Data
        </button>
        <button type="button" onClick={handleReset} className="btn-secondary">
          🔄 Reset Form
        </button>
      </div>

      <form onSubmit={handleSubmit} className="transaction-form">
        {/* CUSTOMER INFORMATION SECTION */}
        <div className="form-section">
          <h3 className="section-title">👤 Customer Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Customer Age</label>
              <input
                type="number"
                name="customer_age"
                value={formData.customer_age}
                onChange={handleChange}
                placeholder="e.g., 35"
                required
              />
            </div>

            <div className="form-group">
              <label>Previous Address (months)</label>
              <input
                type="number"
                name="prev_address_months_count"
                value={formData.prev_address_months_count}
                onChange={handleChange}
                placeholder="e.g., 12"
              />
            </div>

            <div className="form-group">
              <label>Current Address (months)</label>
              <input
                type="number"
                name="current_address_months_count"
                value={formData.current_address_months_count}
                onChange={handleChange}
                placeholder="e.g., 36"
                required
              />
            </div>

            <div className="form-group">
              <label>Bank Account Age (months)</label>
              <input
                type="number"
                name="bank_months_count"
                value={formData.bank_months_count}
                onChange={handleChange}
                placeholder="e.g., 24"
                required
              />
            </div>
          </div>
        </div>

        {/* TRANSACTION DETAILS SECTION */}
        <div className="form-section">
          <h3 className="section-title">💳 Transaction Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Days Since Request</label>
              <input
                type="number"
                step="0.01"
                name="days_since_request"
                value={formData.days_since_request}
                onChange={handleChange}
                placeholder="e.g., 0.5"
                required
              />
            </div>

            <div className="form-group">
              <label>Intended Balance Amount</label>
              <input
                type="number"
                step="0.01"
                name="intended_balcon_amount"
                value={formData.intended_balcon_amount}
                onChange={handleChange}
                placeholder="e.g., 1000"
                required
              />
            </div>

            <div className="form-group">
              <label>Proposed Credit Limit</label>
              <input
                type="number"
                name="proposed_credit_limit"
                value={formData.proposed_credit_limit}
                onChange={handleChange}
                placeholder="e.g., 2000"
                required
              />
            </div>

            <div className="form-group">
              <label>Month</label>
              <input
                type="number"
                name="month"
                min="1"
                max="12"
                value={formData.month}
                onChange={handleChange}
                placeholder="1-12"
                required
              />
            </div>
          </div>
        </div>

        {/* RISK INDICATORS SECTION */}
        <div className="form-section">
          <h3 className="section-title">⚠️ Risk Indicators</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Credit Risk Score</label>
              <input
                type="number"
                step="0.01"
                name="credit_risk_score"
                value={formData.credit_risk_score}
                onChange={handleChange}
                placeholder="e.g., 0.3"
                required
              />
            </div>

            <div className="form-group">
              <label>ZIP Code Count (4 weeks)</label>
              <input
                type="number"
                name="zip_count_4w"
                value={formData.zip_count_4w}
                onChange={handleChange}
                placeholder="e.g., 150"
                required
              />
            </div>

            <div className="form-group">
              <label>Bank Branch Count (8 weeks)</label>
              <input
                type="number"
                name="bank_branch_count_8w"
                value={formData.bank_branch_count_8w}
                onChange={handleChange}
                placeholder="e.g., 3"
                required
              />
            </div>

            <div className="form-group">
              <label>DOB Distinct Emails (4 weeks)</label>
              <input
                type="number"
                name="date_of_birth_distinct_emails_4w"
                value={formData.date_of_birth_distinct_emails_4w}
                onChange={handleChange}
                placeholder="e.g., 1"
                required
              />
            </div>
          </div>
        </div>

        {/* VELOCITY METRICS SECTION */}
        <div className="form-section">
          <h3 className="section-title">📈 Velocity Metrics</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Velocity (6 hours)</label>
              <input
                type="number"
                name="velocity_6h"
                value={formData.velocity_6h}
                onChange={handleChange}
                placeholder="e.g., 1"
                required
              />
            </div>

            <div className="form-group">
              <label>Velocity (24 hours)</label>
              <input
                type="number"
                name="velocity_24h"
                value={formData.velocity_24h}
                onChange={handleChange}
                placeholder="e.g., 2"
                required
              />
            </div>

            <div className="form-group">
              <label>Velocity (4 weeks)</label>
              <input
                type="number"
                name="velocity_4w"
                value={formData.velocity_4w}
                onChange={handleChange}
                placeholder="e.g., 5"
                required
              />
            </div>
          </div>
        </div>

        {/* SESSION DETAILS SECTION */}
        <div className="form-section">
          <h3 className="section-title">🖥️ Session Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Session Length (minutes)</label>
              <input
                type="number"
                name="session_length_in_minutes"
                value={formData.session_length_in_minutes}
                onChange={handleChange}
                placeholder="e.g., 15"
                required
              />
            </div>

            <div className="form-group">
              <label>Device OS (encoded)</label>
              <select
                name="device_os_encoded"
                value={formData.device_os_encoded}
                onChange={handleChange}
              >
                <option value="0">Windows</option>
                <option value="1">macOS</option>
                <option value="2">Linux</option>
                <option value="3">X11</option>
                <option value="4">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Keep Alive Session</label>
              <select
                name="keep_alive_session"
                value={formData.keep_alive_session}
                onChange={handleChange}
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
          </div>
        </div>

        {/* CATEGORICAL FEATURES SECTION */}
        <div className="form-section">
          <h3 className="section-title">📋 Additional Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Email is Free Provider</label>
              <select
                name="email_is_free"
                value={formData.email_is_free}
                onChange={handleChange}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Phone (Home) Valid</label>
              <select
                name="phone_home_valid"
                value={formData.phone_home_valid}
                onChange={handleChange}
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>

            <div className="form-group">
              <label>Has Other Cards</label>
              <select
                name="has_other_cards"
                value={formData.has_other_cards}
                onChange={handleChange}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Payment Type (encoded)</label>
              <input
                type="number"
                name="payment_type_encoded"
                min="0"
                max="4"
                value={formData.payment_type_encoded}
                onChange={handleChange}
                placeholder="0-4"
              />
            </div>

            <div className="form-group">
              <label>Employment Status (encoded)</label>
              <input
                type="number"
                name="employment_status_encoded"
                min="0"
                max="6"
                value={formData.employment_status_encoded}
                onChange={handleChange}
                placeholder="0-6"
              />
            </div>

            <div className="form-group">
              <label>Housing Status (encoded)</label>
              <input
                type="number"
                name="housing_status_encoded"
                min="0"
                max="6"
                value={formData.housing_status_encoded}
                onChange={handleChange}
                placeholder="0-6"
              />
            </div>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div className="form-submit">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing Transaction...
              </>
            ) : (
              <>
                🔍 Analyze Transaction
              </>
            )}
          </button>
        </div>
      </form>

      {/* DISPLAY RESULTS */}
      {result && <ResultDisplay result={result} />}
    </div>
  );
}

export default TransactionForm;
