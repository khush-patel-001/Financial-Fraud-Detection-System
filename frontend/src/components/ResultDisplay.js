/**
 * RESULT DISPLAY COMPONENT
 * =========================
 * 
 * This component displays the prediction results from the backend.
 * It shows whether the transaction is fraud or legitimate with visual indicators.
 * 
 * PROPS RECEIVED:
 * - result: Object containing prediction, probabilities, and confidence
 */

import React from 'react';
import './ResultDisplay.css';

function ResultDisplay({ result }) {
  // Determine if transaction is fraud based on prediction
  const isFraud = result.is_fraud;
  
  return (
    <div className={`result-container ${isFraud ? 'fraud' : 'legitimate'}`}>
      <div className="result-header">
        <div className={`result-icon ${isFraud ? 'fraud-icon' : 'safe-icon'}`}>
          {isFraud ? '⚠️' : '✅'}
        </div>
        <h2 className="result-title">{result.prediction}</h2>
      </div>

      <div className="result-details">
        {/* CONFIDENCE METER */}
        <div className="confidence-section">
          <div className="confidence-label">
            <span>Confidence Level</span>
            <span className="confidence-value">{result.confidence}%</span>
          </div>
          <div className="confidence-bar">
            <div 
              className="confidence-fill"
              style={{ width: `${result.confidence}%` }}
            ></div>
          </div>
        </div>

        {/* PROBABILITY BREAKDOWN */}
        <div className="probability-grid">
          <div className="probability-card fraud-card">
            <div className="probability-label">Fraud Probability</div>
            <div className="probability-value">{result.fraud_probability}%</div>
            <div className="probability-bar">
              <div 
                className="probability-fill fraud-fill"
                style={{ width: `${result.fraud_probability}%` }}
              ></div>
            </div>
          </div>

          <div className="probability-card legitimate-card">
            <div className="probability-label">Legitimate Probability</div>
            <div className="probability-value">{result.legitimate_probability}%</div>
            <div className="probability-bar">
              <div 
                className="probability-fill legitimate-fill"
                style={{ width: `${result.legitimate_probability}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* RECOMMENDATION */}
        <div className={`recommendation ${isFraud ? 'fraud-rec' : 'safe-rec'}`}>
          <h3>Recommendation</h3>
          <p>
            {isFraud ? (
              <>
                ⚠️ This transaction shows high risk indicators. 
                We recommend additional verification steps before processing.
                Consider reviewing customer history, contacting the customer, 
                or flagging for manual review.
              </>
            ) : (
              <>
                ✅ This transaction appears legitimate based on our analysis. 
                The risk indicators are within normal ranges. However, always 
                maintain standard security protocols for all transactions.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResultDisplay;
