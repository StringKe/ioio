import { Box, Group, Stack } from '@mantine/core';
import { useState } from 'react';
import { useMount } from 'react-use';

import { ColorSchemaToggleButton } from '../../components/ColorSchemaToggleButton';
import { LanguageToggleButton } from '../../components/LanguageToggleButton';
import { defaultTab, useTabs } from './atoms/tabs';
import { DocumentSidebar } from './components/DocumentSidebar';
import { DocumentTabs } from './components/DocumentTabs';
import styles from './styles.module.css';
import { ViewDispatch } from './views/ViewDispatch';

export function JsonTool() {
  const { tabs, setActiveTab, setTabs } = useTabs();
  const [isMounted, setIsMounted] = useState(false);

  useMount(() => {
    if (tabs.length === 0) {
      const tab = defaultTab();
      setTabs([tab]);
      setActiveTab(tab.id);
    }
    setIsMounted(true);
  });

  if (!isMounted) {
    return null;
  }

  return (
    <Stack gap={0} className={styles.root}>
      <Group gap={0} className={styles.header}>
        <div className={styles.logo}>
          <img src='/logo/icon-192.png' alt='logo' />
        </div>
        <DocumentTabs />
      </Group>
      <Box className={styles.content}>
        <DocumentSidebar className={styles.sidebar} />
        <ViewDispatch className={styles.view} />
      </Box>
      <Group className={styles.footer} p='xs' gap='xs'>
        <Group gap='xs' ml='auto'>
          <ColorSchemaToggleButton />
          <LanguageToggleButton />
        </Group>
      </Group>
    </Stack>
  );
}
