import { Trans } from '@lingui/react/macro';
import { Button, Group, Menu, Stack, Text, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { useVirtualizer } from '@tanstack/react-virtual';
import IconCopy from '~icons/tabler/copy';
import IconDots from '~icons/tabler/dots';
import IconKey from '~icons/tabler/key';
import clsx from 'clsx';
import { useCallback, useMemo, useRef, useState } from 'react';

import type { JsonTreeNode } from '../../utils/json-tree';

import { useTabs } from '../../atoms/tabs';
import { JsonTree } from '../../utils/json-tree';
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
          <Button size='xs' variant='subtle' onClick={cleanCurrentTab}>
            <Trans>Clean</Trans>
          </Button>
          <Menu position='bottom-end' shadow='md'>
            <Menu.Target>
              <Button size='xs' variant='subtle' rightSection={<IconDots />}>
                <Trans>Copy</Trans>
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={handleCopyAll}>
                <Trans>Copy Formatted</Trans>
              </Menu.Item>
              <Menu.Item onClick={handleCopyMinified}>
                <Trans>Copy Minified</Trans>
              </Menu.Item>
              <Menu.Item onClick={handleCopyEscaped}>
                <Trans>Copy Escaped</Trans>
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