import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import './index.css';
import './locales/i18n';

// In production on GitHub Pages (repo Test_CNPM), base URL is /Test_CNPM/
// React Router v6 basename MUST NOT end with a trailing slash!
const rawBase = import.meta.env.BASE_URL || '/';
const basename =
  rawBase.endsWith('/') && rawBase !== '/'
    ? rawBase.slice(0, -1)
    : rawBase === '/'
    ? undefined
    : rawBase;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
