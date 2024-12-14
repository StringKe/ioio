import { i18n } from '@lingui/core';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { useEffect } from 'react';

import { ColorSchemeScript } from '@mantine/core';
import { RootProvider } from './components/RootProvider';
import { loadCatalog, useLocale } from './modules/lingui/lingui';
import { linguiServer, localeCookie } from './modules/lingui/lingui.server';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const locale = formData.get('locale') ?? 'en';

  return json(null, {
    headers: {
      'Set-Cookie': await localeCookie.serialize(locale),
    },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await linguiServer.getLocale(request);

  return json(
    {
      locale,
    },
    {
      headers: {
        'Set-Cookie': await localeCookie.serialize(locale),
      },
    },
  );
}

export type RootLoaderType = typeof loader;

export function Layout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();

  useEffect(() => {
    if (i18n.locale !== locale) {
      loadCatalog(locale);
    }
  }, [locale]);

  return (
    <html lang={locale ?? 'en'}>
      <head>
        <meta charSet='utf-8' />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"/>
        <link rel="icon" href="/favicon.ico" sizes="any"/>
        <link rel="apple-touch-icon" href="/logo/apple-touch-icon.png"/>
        <meta name="theme-color" content="#339af0"/>
        <Meta />
        <Links />
        <ColorSchemeScript
      nonce="8IBTHwOdqNKAWeKl7plt8g=="
      defaultColorScheme="dark"
    />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <RootProvider>
      <Outlet />
    </RootProvider>
  );
}
