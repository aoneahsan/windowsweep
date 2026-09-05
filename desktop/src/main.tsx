import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/app.css';
import './i18n';
import { applyDocumentLanguage } from './i18n';
import { App } from './App';
import { applyAllAxes, readPrefs } from './lib/theme';
import { startAnalytics } from './lib/analytics';
import { readConsent } from './lib/consent';
import { keys, appVersionFallback } from './lib/config';

/* The pre-paint script already wrote every axis to <html>. This second pass is
   the React-side handover: it re-reads the same preferences through the same one
   apply path, so nothing can drift between the two, and it costs nothing because
   the attributes are already correct. */
applyAllAxes(readPrefs());
applyDocumentLanguage();

/* 🔴 Consent-gated, and it never blocks boot. A destination whose key is absent
   is skipped; a destination that fails to start is swallowed. The window opens
   whether or not anything here succeeds. */
void startAnalytics(keys, appVersionFallback, readConsent());

const host = document.getElementById('root');
if (!host) throw new Error('the application root is missing from index.html');

createRoot(host).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
