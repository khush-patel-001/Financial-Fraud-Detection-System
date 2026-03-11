/**
 * APP.JS - MAIN APPLICATION COMPONENT
 * ====================================
 * 
 * This is the brain of our frontend. It manages:
 * - Routing (which page to show)
 * - Overall layout
 * - Connection to backend API
 * 
 * SIMPLE EXPLANATION FOR BEGINNERS:
 * - Components in React are like LEGO blocks
 * - App.js is the main board where we put all our LEGO blocks together
 * - We have different "pages" (routes) like Home, Predict, About
 * - React Router decides which page to show based on the URL
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import TransactionForm from './components/TransactionForm';

function App() {
  return (
    <Router>
      <div className="App">
        {/* NAVIGATION BAR */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-brand">
              <h1>🛡️ Fraud Detection System</h1>
              <p className="nav-subtitle">ML-Powered Transaction Analysis</p>
            </div>
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/predict" className="nav-link">Predict</Link>
              <Link to="/about" className="nav-link">About</Link>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT AREA */}
        <main className="main-content">
          <Routes>
            {/* Home Page Route */}
            <Route path="/" element={<HomePage />} />
            
            {/* Prediction Page Route */}
            <Route path="/predict" element={<PredictionPage />} />
            
            {/* About Page Route */}
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        {/* FOOTER */}
        <footer className="footer">
          <p>© 2024 Fraud Detection System | Final Year Project | Built with React & Flask</p>
        </footer>
      </div>
    </Router>
  );
}

/**
 * HOME PAGE COMPONENT
 * Displays welcome message and system overview
 */
function HomePage() {
  return (
    <div className="page home-page">
      <div className="hero-section">
        <h1 className="hero-title">Financial Fraud Detection System</h1>
        <p className="hero-description">
          Advanced machine learning system to detect fraudulent transactions in real-time
        </p>
        <Link to="/predict" className="cta-button">
          Start Detection →
        </Link>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>AI-Powered</h3>
          <p>Uses Gradient Boosting Classifier trained on 1M+ transactions</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Real-Time Analysis</h3>
          <p>Get instant predictions with confidence scores</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>81% Accuracy</h3>
          <p>High precision and recall for reliable fraud detection</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Detailed Insights</h3>
          <p>View probability scores and confidence metrics</p>
        </div>
      </div>

      <div className="stats-section">
        <h2>Model Performance</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">81%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">81%</div>
            <div className="stat-label">Precision</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">80%</div>
            <div className="stat-label">Recall</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">0.89</div>
            <div className="stat-label">ROC-AUC</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PREDICTION PAGE COMPONENT
 * Contains the transaction form for fraud detection
 */
function PredictionPage() {
  return (
    <div className="page prediction-page">
      <div className="page-header">
        <h1>Transaction Fraud Detection</h1>
        <p>Enter transaction details below to check for potential fraud</p>
      </div>
      <TransactionForm />
    </div>
  );
}

/**
 * ABOUT PAGE COMPONENT
 * Information about the project and technology
 */
function AboutPage() {
  return (
    <div className="page about-page">
      <div className="about-container">
        <h1>About This Project</h1>
        
        <section className="about-section">
          <h2>🎓 Project Overview</h2>
          <p>
            This is a final year project demonstrating the application of machine learning 
            in financial fraud detection. The system uses a Gradient Boosting Classifier 
            trained on a comprehensive dataset of bank account fraud cases.
          </p>
        </section>

        <section className="about-section">
          <h2>🔬 Technology Stack</h2>
          <div className="tech-stack">
            <div className="tech-item">
              <h3>Backend</h3>
              <ul>
                <li>Python 3.x</li>
                <li>Flask (REST API)</li>
                <li>Scikit-learn (ML)</li>
                <li>Pandas & NumPy</li>
              </ul>
            </div>
            <div className="tech-item">
              <h3>Frontend</h3>
              <ul>
                <li>React 18</li>
                <li>React Router</li>
                <li>Axios (API calls)</li>
                <li>CSS3</li>
              </ul>
            </div>
            <div className="tech-item">
              <h3>Machine Learning</h3>
              <ul>
                <li>Gradient Boosting Classifier</li>
                <li>StandardScaler</li>
                <li>Feature Engineering</li>
                <li>Class Imbalance Handling</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>📊 Model Details</h2>
          <p>
            The fraud detection model was trained on the Bank Account Fraud Dataset 
            from NeurIPS 2022, containing over 1 million transactions with 30+ features.
          </p>
          <ul className="model-features">
            <li><strong>Algorithm:</strong> Gradient Boosting Classifier</li>
            <li><strong>Features:</strong> 26 engineered features</li>
            <li><strong>Training Data:</strong> 1M+ transactions</li>
            <li><strong>Class Balancing:</strong> RandomOverSampler</li>
            <li><strong>Validation:</strong> 80-20 train-test split</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>🎯 How It Works</h2>
          <ol className="workflow-list">
            <li>User enters transaction details in the form</li>
            <li>Frontend sends data to Flask API via HTTP POST</li>
            <li>Backend validates and preprocesses the data</li>
            <li>Model scales features and makes prediction</li>
            <li>API returns prediction with confidence scores</li>
            <li>Frontend displays results with visual indicators</li>
          </ol>
        </section>

        <section className="about-section">
          <h2>📈 Performance Metrics</h2>
          <div className="metrics-table">
            <div className="metric-row">
              <span className="metric-name">Accuracy</span>
              <span className="metric-value">81.06%</span>
            </div>
            <div className="metric-row">
              <span className="metric-name">Precision</span>
              <span className="metric-value">81.43%</span>
            </div>
            <div className="metric-row">
              <span className="metric-name">Recall</span>
              <span className="metric-value">80.48%</span>
            </div>
            <div className="metric-row">
              <span className="metric-name">F1-Score</span>
              <span className="metric-value">80.95%</span>
            </div>
            <div className="metric-row">
              <span className="metric-name">ROC-AUC</span>
              <span className="metric-value">0.8940</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
