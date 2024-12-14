import { useLingui } from '@lingui/react';
import { ActionIcon } from '@mantine/core';
import IconX from '~icons/tabler/x';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Tab } from '../../atoms/tabs';

import { useTabs } from '../../atoms/tabs';
import styles from './styles.module.css';

export function TabItem({ tab, index }: { tab: Tab; index: number }) {
  const { activeTab, setTabs, removeTab } = useTabs();

  const { i18n } = useLingui();
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const onChangeName = useCallback(
    (name: string) => {
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
    <div className={clsx(styles.tab, { [styles.active]: activeTab === index })}>
      <div
        className={styles.inputWrapper}
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
      <ActionIcon size='xs' variant='subtle' aria-label='Close current tab' color='gray' onClick={() => removeTab(index)}>
        <IconX />
      </ActionIcon>
    </div>
  );
}
