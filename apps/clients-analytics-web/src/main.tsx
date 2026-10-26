import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@app/ui/tokens.css';
import './global.scss';
import { App } from './app/App.tsx';
import { AppProviders } from './app/AppProviders.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
