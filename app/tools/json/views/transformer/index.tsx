import { Box, Group, LoadingOverlay, Select, Stack, Text, useComputedColorScheme } from '@mantine/core';
import { Editor } from '@monaco-editor/react';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { WithSplitPanel } from '../../../../components/SplitPanel';
import { useTabs } from '../../atoms/tabs';
import { getTransformers, transformsAdapter } from '../../utils/transformers';
import styles from './styles.module.css';

function JSONPanel() {
  const { currentTab, setCurrentTab } = useTabs();
  const theme = useComputedColorScheme();
  return (
    <Stack gap={0} className={clsx(styles.panel, styles.panelLeft)}>
      <Group className={styles.panelHeader}>
        <Text className={styles.panelHeaderTitle}>JSON</Text>
      </Group>
      <Box className={styles.panelContent}>
        <Editor
          height='100%'
          defaultLanguage='json'
          value={JSON.stringify(currentTab?.content ?? '{}', null, 2)}
          onChange={(value) => {
            setCurrentTab((prev) => {
              return {
                ...prev,
                content: JSON.parse(value || '{}'),
              };
            });
          }}
          options={{
            minimap: { enabled: false },
          }}
          theme={theme === 'light' ? 'vs-light' : 'vs-dark'}
        />
      </Box>
    </Stack>
  );
}

function TransformerPanel() {
  const theme = useComputedColorScheme();
  const { currentTab } = useTabs();
  const [currentTransformer, setCurrentTransformer] = useState<string>('big-query');
  const transformers = useMemo(() => getTransformers(), []);
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<string>('');

  const transformer = useMemo(() => transformers.find((t) => t.type === currentTransformer), [currentTransformer, transformers]);

  const handleTransform = useCallback(async () => {
    if (!currentTab?.content) {
      return;
    }
    try {
      const input = JSON.stringify(currentTab?.content ?? {}, null, 2);
      setLoading(true);
      const transformer = await transformsAdapter(currentTransformer);
      const result = await transformer(input);
      setResult(result);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [currentTransformer, currentTab?.content]);

  useEffect(() => {
    handleTransform();
  }, [currentTransformer, currentTab?.content, handleTransform]);

  return (
    <Stack gap={0} className={clsx(styles.panel)}>
      <Group className={styles.panelHeader}>
        <Text className={styles.panelHeaderTitle}>Transformer</Text>
        <Select
          ml='auto'
          size='xs'
          value={currentTransformer}
          onChange={(value) => {
            if (value) {
              setCurrentTransformer(value);
            }
          }}
          data={transformers.map((t) => ({
            value: t.type,
            label: t.name,
          }))}
        />
      </Group>
      <Box className={styles.panelContent}>
        <LoadingOverlay visible={loading} />
        {!loading && (
          <Editor
            height='100%'
            defaultLanguage={transformer?.language}
            value={result}
            options={{
              minimap: { enabled: false },
            }}
            theme={theme === 'light' ? 'vs-light' : 'vs-dark'}
          />
        )}
      </Box>
    </Stack>
  );
}

const SplitView = WithSplitPanel({
  startComponent: JSONPanel,
  endComponent: TransformerPanel,
});

export function TransformerView({ className }: { className?: string }) {
  return (
    <Stack gap={0} className={clsx(styles.root, className)}>
      <SplitView direction='horizontal' />
    </Stack>
  );
}
