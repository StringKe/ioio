import { useLingui } from '@lingui/react';
import { ActionIcon } from '@mantine/core';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';

import IconPlus from '~icons/tabler/plus';
import IconX from '~icons/tabler/x';

import type { Tab } from '../../atoms/tabs';

import { useTabs } from '../../atoms/tabs';
import styles from './styles.module.css';

export function TabItem({ tab, index, isLast }: { tab: Tab; index: number; isLast: boolean }) {
  const { activeTab, setTabs, removeTab, addEmptyTab, setActiveTab } = useTabs();

  const { i18n } = useLingui();
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const onChangeName = useCallback(
    (name: string) => {
      if (name === '') {
        return;
      }

      setName(name);
      setTabs((prev) => {
        const newTabs = [...prev];
        newTabs[index].name = name;
        return newTabs;
      });
    },
    [setName, setTabs, index],
  );

  useEffect(() => {
    if (typeof tab.name === 'string') {
      setName(tab.name);
    } else {
      setName(i18n.t(tab.name));
    }
  }, [tab.name, i18n]);

  return (
    <div className={styles.tabRoot}>
      <div className={clsx(styles.tab, { [styles.active]: activeTab === tab.id })}>
        <div
          className={styles.inputWrapper}
          onClick={() => {
            setActiveTab(tab.id);
          }}
          onDoubleClick={() => {
            setEditing(true);
            setTimeout(() => {
              ref.current?.focus();
            }, 10);
          }}
        >
          <input
            ref={ref}
            className={clsx(styles.input, { [styles.editing]: editing })}
            disabled={!editing}
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setEditing(false);
              }
            }}
            onFocus={(e) => {
              e.target.setSelectionRange(0, e.target.value.length);
            }}
          />
        </div>
        <ActionIcon size='xs' variant='subtle' aria-label='Close current tab' color='gray' onClick={() => removeTab(tab.id)}>
          <IconX />
        </ActionIcon>
      </div>
      {isLast && (
        <div className={styles.addTab}>
          <ActionIcon ml={4} size='xs' variant='subtle' aria-label='Add new tab' color='gray' onClick={() => addEmptyTab()}>
            <IconPlus />
          </ActionIcon>
        </div>
      )}
    </div>
  );
}
