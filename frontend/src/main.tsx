import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import App from './App';
import './index.css';

// Fallback to production Convex cloud URL if VITE_CONVEX_URL env var is missing during Vercel build
const convexUrl = import.meta.env.VITE_CONVEX_URL || 'https://elated-mastiff-563.convex.cloud';
const convex = new ConvexReactClient(convexUrl);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>
);
