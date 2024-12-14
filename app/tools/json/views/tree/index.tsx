import { Trans } from '@lingui/react/macro';
import { Button, Group, Menu, Stack, Text, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { useVirtualizer } from '@tanstack/react-virtual';
import IconCopy from '~icons/tabler/copy';
import IconDownload from '~icons/tabler/download';
import IconEdit from '~icons/tabler/edit';
import IconEditOff from '~icons/tabler/edit-off';
import IconKey from '~icons/tabler/key';
import clsx from 'clsx';
import { useCallback, useMemo, useRef, useState } from 'react';

import type { JsonTreeNode } from '../../utils/json-tree';

import { useTabs } from '../../atoms/tabs';
import { JsonTree } from '../../utils/json-tree';
import { getTransformAdapters } from '../../utils/sources';
import styles from './styles.module.css';
import { TreeRow } from './TreeRow';

export function TreeView({ className }: { className?: string }) {
  const { currentTab, cleanCurrentTab } = useTabs();
  const parentRef = useRef<HTMLDivElement>(null);
  const itemHeight = 24;

  const [nodes, setNodes] = useState<JsonTreeNode[]>([]);
  const [currentNode, setCurrentNode] = useState<JsonTreeNode | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const tree = useMemo(
    () =>
      new JsonTree(currentTab.content, {
        setNodes,
      }),
    [currentTab.content],
  );

  const virtualizer = useVirtualizer({
    count: nodes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan: 5,
  });

  const handleToggleExpand = useCallback(
    (node: JsonTreeNode) => {
      tree.toggleExpand(node);
    },
    [tree],
  );

  const handleSelect = useCallback((node: JsonTreeNode) => {
    setCurrentNode(node);
  }, []);

  const handleExpandAll = useCallback(() => {
    tree.expandAll();
  }, [tree]);

  const handleCollapseAll = useCallback(() => {
    tree.collapseAll();
  }, [tree]);

  const clipboard = useClipboard();

  const handleCopyKey = useCallback(() => {
    if (currentNode) {
      clipboard.copy(currentNode.paths.join('.'));
    }
  }, [clipboard, currentNode]);

  const handleCopyValue = useCallback(() => {
    if (currentNode?.isPrimitive) {
      clipboard.copy(String(currentNode.value));
    } else if (currentNode) {
      // 如果不是原始类型，复制整个子树的值
      const value = tree.getValueByPath(tree.data, currentNode.paths);
      clipboard.copy(JSON.stringify(value, null, 2));
    }
  }, [clipboard, currentNode, tree]);

  const handleCopyAll = useCallback(() => {
    clipboard.copy(JSON.stringify(tree.data, null, 2));
  }, [clipboard, tree.data]);

  const handleCopyMinified = useCallback(() => {
    clipboard.copy(JSON.stringify(tree.data));
  }, [clipboard, tree.data]);

  const handleCopyEscaped = useCallback(() => {
    clipboard.copy(JSON.stringify(JSON.stringify(tree.data)));
  }, [clipboard, tree.data]);

  const handleCopyAs = useCallback(
    async (type: string) => {
      try {
        const adapters = await getTransformAdapters();
        const adapter = adapters.find((a) => a.type === type)?.adapter;
        if (!adapter) return;

        const result = await adapter.deserialize(tree.data);
        clipboard.copy(result);
      } catch (error) {
        console.error('Copy failed:', error);
      }
    },
    [clipboard, tree.data],
  );

  const handleUpdateKey = useCallback(
    (node: JsonTreeNode, newKey: string) => {
      const parentNode = tree.findParentNode(node);
      if (!parentNode) return;

      const oldValue = tree.getValueByPath(tree.data, node.paths);
      tree.removeNode(node);
      tree.addNode(parentNode, oldValue, newKey);
    },
    [tree],
  );

  const handleUpdateValue = useCallback(
    (node: JsonTreeNode, newValue: any) => {
      tree.updateNodeValue(node, newValue);
    },
    [tree],
  );

  const handleExport = useCallback(
    async (type: string) => {
      try {
        const adapters = await getTransformAdapters();
        const adapter = adapters.find((a) => a.type === type)?.adapter;
        if (!adapter) return;

        const result = await adapter.deserialize(tree.data);
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export.${type}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Export failed:', error);
      }
    },
    [tree.data],
  );

  return (
    <Stack gap={0} className={clsx(styles.root, className)}>
      <Group className={styles.function} p={4} gap={4}>
        {currentNode && (
          <Group gap={4}>
            <Text size='sm' className={styles.paths}>
              {currentNode.paths.join('.')}
            </Text>
            <Tooltip label={<Trans>Copy Key</Trans>}>
              <Button size='xs' variant='subtle' onClick={handleCopyKey} className={styles.iconButton}>
                <IconKey />
              </Button>
            </Tooltip>
            <Tooltip label={<Trans>Copy Value</Trans>}>
              <Button size='xs' variant='subtle' onClick={handleCopyValue} className={styles.iconButton}>
                <IconCopy />
              </Button>
            </Tooltip>
          </Group>
        )}
        <Group ml='auto' gap={4}>
          <Tooltip label={isReadOnly ? <Trans>Enable Editing</Trans> : <Trans>Disable Editing</Trans>}>
            <Button size='xs' variant='subtle' onClick={() => setIsReadOnly(!isReadOnly)} className={styles.iconButton}>
              {isReadOnly ? <IconEdit /> : <IconEditOff />}
            </Button>
          </Tooltip>
          <Button size='xs' variant='subtle' onClick={cleanCurrentTab}>
            <Trans>Clean</Trans>
          </Button>
          <Menu position='bottom-end' shadow='md'>
            <Menu.Target>
              <Button size='xs' variant='subtle' rightSection={<IconCopy />}>
                <Trans>Copy</Trans>
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>
                <Trans>Basic</Trans>
              </Menu.Label>
              <Menu.Item onClick={handleCopyAll}>
                <Trans>Copy Formatted</Trans>
              </Menu.Item>
              <Menu.Item onClick={handleCopyMinified}>
                <Trans>Copy Minified</Trans>
              </Menu.Item>
              <Menu.Item onClick={handleCopyEscaped}>
                <Trans>Copy Escaped</Trans>
              </Menu.Item>

              <Menu.Divider />
              <Menu.Label>
                <Trans>Other Formats</Trans>
              </Menu.Label>
              <Menu.Item onClick={() => handleCopyAs('jsobj')}>
                <Trans>Copy as JavaScript Object</Trans>
              </Menu.Item>
              <Menu.Item onClick={() => handleCopyAs('yaml')}>
                <Trans>Copy as YAML</Trans>
              </Menu.Item>
              <Menu.Item onClick={() => handleCopyAs('toml')}>
                <Trans>Copy as TOML</Trans>
              </Menu.Item>
              <Menu.Item onClick={() => handleCopyAs('json5')}>
                <Trans>Copy as JSON5</Trans>
              </Menu.Item>
              <Menu.Item onClick={() => handleCopyAs('typescript')}>
                <Trans>Copy as TypeScript</Trans>
              </Menu.Item>
              <Menu.Item onClick={() => handleCopyAs('form')}>
                <Trans>Copy as Form Data</Trans>
              </Menu.Item>
              <Menu.Item onClick={() => handleCopyAs('query')}>
                <Trans>Copy as Query String</Trans>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Menu position='bottom-end' shadow='md'>
            <Menu.Target>
              <Button size='xs' variant='subtle' rightSection={<IconDownload />}>
                <Trans>Export</Trans>
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={() => handleExport('json')}>
                <Trans>Export as JSON</Trans>
              </Menu.Item>
              <Menu.Item onClick={() => handleExport('jsobj')}>
                <Trans>Export as JavaScript Object</Trans>
              </Menu.Item>
              <Menu.Item onClick={() => handleExport('yaml')}>
                <Trans>Export as YAML</Trans>
              </Menu.Item>
              <Menu.Item onClick={() => handleExport('toml')}>
                <Trans>Export as TOML</Trans>
              </Menu.Item>
              <Menu.Item onClick={() => handleExport('json5')}>
                <Trans>Export as JSON5</Trans>
              </Menu.Item>
              <Menu.Item onClick={() => handleExport('typescript')}>
                <Trans>Export as TypeScript</Trans>
              </Menu.Item>
              <Menu.Item onClick={() => handleExport('form')}>
                <Trans>Export as Form Data</Trans>
              </Menu.Item>
              <Menu.Item onClick={() => handleExport('query')}>
                <Trans>Export as Query String</Trans>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Button size='xs' variant='subtle' onClick={handleExpandAll}>
            <Trans>Expand All</Trans>
          </Button>
          <Button size='xs' variant='subtle' onClick={handleCollapseAll}>
            <Trans>Collapse All</Trans>
          </Button>
        </Group>
      </Group>
      <div ref={parentRef} className={styles.virtualList}>
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <TreeRow
                item={nodes[virtualRow.index]}
                height={itemHeight}
                onToggleExpand={handleToggleExpand}
                isSelected={currentNode === nodes[virtualRow.index]}
                onSelect={handleSelect}
                isReadOnly={isReadOnly}
                onUpdateKey={handleUpdateKey}
                onUpdateValue={handleUpdateValue}
              />
            </div>
          ))}
        </div>
      </div>
    </Stack>
  );
}
