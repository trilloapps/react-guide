import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Header } from './pages/header.js';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    
      <Header/>
     
    <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
