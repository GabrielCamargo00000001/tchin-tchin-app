import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// The Tchin Tchin app shell (phone frame + stack navigation + all ~100 screens),
// ported from the Claude Design prototype into ESM modules under src/legacy.
import { TchinApp } from './legacy/prototype.jsx';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

createRoot(container).render(
  <StrictMode>
    <TchinApp initialScreen="onboarding" />
  </StrictMode>
);
