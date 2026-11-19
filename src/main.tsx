import React from 'react';
import ReactDOM from 'react-dom/client';
import SleekToast from 'sleek-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SleekToast />
    <App />
  </React.StrictMode>
);
