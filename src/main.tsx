import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import { siteConfig } from './data/siteConfig';

import './styles/tokens.css';
import './styles/base.css';
import './styles/animations.css';
import './styles/screens.css';

// 'history' gives clean shareable URLs; 'hash' works on any static host that
// cannot rewrite. Switch it in siteConfig — nothing else changes.
const Router = siteConfig.routerMode === 'hash' ? HashRouter : BrowserRouter;

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

createRoot(container).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
