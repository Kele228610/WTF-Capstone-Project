
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { bootstrapAuthSession } from './api/client';
import './styles/global.css';

async function startApp() {
  const mount = document.getElementById('root');
  if (!mount) {
    console.error('Root mount node (#root) was not found.');
    return;
  }

  // Attempt to restore session from HttpOnly refresh cookie.
  try {
    await bootstrapAuthSession();
  } catch {
    // Swallow bootstrap errors so the app still mounts.
  }

  ReactDOM.createRoot(mount).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp, { once: true });
} else {
  startApp();
}
