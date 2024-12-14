import { Stack } from '@mantine/core';
import { Editor } from '@monaco-editor/react';
import clsx from 'clsx';

import { useTabs } from '../../atoms/tabs';
import styles from './styles.module.css';

export function JSONView({ className }: { className?: string }) {
  const { currentTab, setCurrentTab } = useTabs();
  return (
    <Stack gap={0} className={clsx(styles.root, className)}>
      <Editor
        height='100%'
        defaultLanguage='json'
        value={JSON.stringify(currentTab.content, null, 2)}
        onChange={(value) => {
          setCurrentTab({
            ...currentTab,
            content: JSON.parse(value || '{}'),
          });
        }}
        options={{
          minimap: { enabled: false },
        }}
      />
    </Stack>
  );
}
