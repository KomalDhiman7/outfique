import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// try to import your existing AuthProvider; adjust path if different
import { AuthProvider } from './context/AuthProvider'; // <-- confirm this path in your repo

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);