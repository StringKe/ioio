/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { i18n } from '@lingui/core';
import { detect, fromHtmlTag } from '@lingui/detect-locale';
import { I18nProvider } from '@lingui/react';
import { RemixBrowser, useLocation, useMatches } from '@remix-run/react';
import { browserTracingIntegration, init, replayIntegration } from '@sentry/remix';
import { startTransition, StrictMode, useEffect } from 'react';
import { hydrateRoot } from 'react-dom/client';

import { loadCatalog } from './modules/lingui/lingui';

init({
  dsn: 'https://4150d9fbbaa10aabb4b09a05b27f8a47@o4508471056924672.ingest.us.sentry.io/4508471057186816',
  tracesSampleRate: 1,

  integrations: [
    browserTracingIntegration({
      useEffect,
      useLocation,
      useMatches,
    }),
    replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
});

async function main() {
  const locale = detect(fromHtmlTag('lang')) || 'en';

  await loadCatalog(locale);

  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <I18nProvider i18n={i18n}>
          <RemixBrowser />
        </I18nProvider>
      </StrictMode>,
    );
  });
}

main();
