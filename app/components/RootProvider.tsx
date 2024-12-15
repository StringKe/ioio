import '@mantine/code-highlight/styles.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/spotlight/styles.css';

import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { type PropsWithChildren } from 'react';

export function RootProvider({ children }: PropsWithChildren) {
  return (
    <I18nProvider i18n={i18n}>
      <MantineProvider defaultColorScheme='auto'>
        <Notifications />
        <ModalsProvider>{children}</ModalsProvider>
      </MantineProvider>
    </I18nProvider>
  );
}
