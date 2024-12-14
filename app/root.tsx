import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';

import { i18n } from '@lingui/core';
import { t } from '@lingui/core/macro';
import { ColorSchemeScript } from '@mantine/core';
import { json } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { useEffect } from 'react';

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

export const meta: MetaFunction = ({ data: { locale } }) => {
  return [
    { title: t`Site title` },
    { name: 'description', content: t`Site description` },
    { name: 'keywords', content: 'JSON,viewer,editor,tools,在线工具,JSON编辑器,JSON查看器' },

    // Open Graph tags
    { property: 'og:title', content: t`Site title` },
    { property: 'og:description', content: t`Site description` },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/logo/og-image.png' },

    // Twitter Card tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: t`Site title` },
    { name: 'twitter:description', content: t`Site description` },
    { name: 'twitter:image', content: '/logo/og-image.png' },

    // PWA related tags
    { name: 'application-name', content: t`Site title` },
    { name: 'apple-mobile-web-app-title', content: t`Site title` },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'mobile-web-app-capable', content: 'yes' },

    // 其他重要的 meta 标签
    { name: 'robots', content: 'index,follow' },
    { name: 'googlebot', content: 'index,follow' },
    { name: 'format-detection', content: 'telephone=no' },
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no' },
  ];
};

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
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no' />
        <link rel='icon' href='/favicon.ico' sizes='any' />
        <link rel='icon' type='image/svg+xml' href='/logo/icon-512.png' />
        <link rel='apple-touch-icon' href='/logo/apple-touch-icon.png' />
        <meta name='theme-color' content='#339af0' />
        <Meta />
        <Links />
        <ColorSchemeScript nonce='8IBTHwOdqNKAWeKl7plt8g==' defaultColorScheme='dark' />
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
