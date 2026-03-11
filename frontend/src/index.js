/**
 * INDEX.JS - REACT APP ENTRY POINT
 * =================================
 * 
 * This is where React starts. Think of it as the "power button" of our app.
 * 
 * SIMPLE EXPLANATION:
 * - This file tells React to render our App component
 * - It "injects" our entire React app into the HTML element with id="root"
 * - The root element is in public/index.html
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Get the root element from HTML
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render our App component inside the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
