import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import i18n from './i18n';
import { applyDocumentDirection } from './utils/direction';
import App from './App';
import './styles/tokens.css';
import './styles/base.css';

// ✅ Set dir/lang on <html> before the first paint so there's no
// flash of the wrong direction on reload.
applyDocumentDirection(i18n.language?.split('-')[0] || 'en');

i18n.on('languageChanged', (lng) => {
  applyDocumentDirection(lng.split('-')[0]);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
