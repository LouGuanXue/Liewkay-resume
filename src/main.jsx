import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { enableMotion } from './motion/motion';
import './styles/tailwind.css';
import './styles/app.css';

enableMotion();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
