import * as Sentry from '@sentry/remix';

Sentry.init({
  dsn: 'https://4150d9fbbaa10aabb4b09a05b27f8a47@o4508471056924672.ingest.us.sentry.io/4508471057186816',
  tracesSampleRate: 1,
  autoInstrumentRemix: true,
});
