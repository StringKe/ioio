import { useLingui } from '@lingui/react';
import { Group, Select, Stack } from '@mantine/core';
import { DiffEditor } from '@monaco-editor/react';
import clsx from 'clsx';
import _ from 'lodash';
import { useEffect, useState } from 'react';

import { useTabs } from '../../atoms/tabs';
import styles from './styles.module.css';

export function DiffView({ className }: { className?: string }) {
  const { currentTab, tabs } = useTabs();

  const [original, setPriginal] = useState<string | undefined>();
  const [modified, setModified] = useState<string | undefined>();
  const [selectedTab, setSelectedTab] = useState<string | undefined>();

  const { i18n } = useLingui();

  useEffect(() => {
    if (currentTab?.content) {
      try {
        setPriginal(JSON.stringify(currentTab.content, null, 2));
      } catch (error) {
        setPriginal(undefined);
      }
    }
  }, [currentTab?.content]);

  useEffect(() => {
    if (selectedTab) {
      try {
        setModified(JSON.stringify(tabs.find((tab) => tab.id === selectedTab)?.content, null, 2));
      } catch (error) {
        setModified(undefined);
      }
    }
  }, [selectedTab, tabs]);

  return (
    <Stack gap={0} className={clsx(styles.root, className)}>
      <Group gap={0} justify='end' className={styles.function}>
        {tabs.length > 1 && (
          <Select
            value={selectedTab}
            onChange={(value) => {
              setSelectedTab(value ?? undefined);
            }}
            data={tabs.map((tab) => ({
              value: tab.id,
              label: _.isString(tab.name) ? tab.name : i18n._(tab.name),
            }))}
          />
        )}
      </Group>
      <div className={styles.content}>
        <DiffEditor
          original={original ?? ''}
          modified={modified ?? ''}
          language='json'
          options={{
            minimap: {
              enabled: false,
            },
          }}
        />
      </div>
    </Stack>
  );
}
