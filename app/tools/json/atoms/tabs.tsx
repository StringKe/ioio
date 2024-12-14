import type { SetStateAction } from 'react';

import { type MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import _ from 'lodash';
import { useCallback } from 'react';

import { transformSource } from '../utils/sources';

export const defaultTabName = msg`Default Tab Name`;

export type JsonContent = { [key: string]: any } | any[];

export interface Tab {
  name: string | MessageDescriptor;
  content?: JsonContent;
  source: string;
  detectSourceType: string;
}
export const activeTabAtom = atomWithStorage<number>('json.activeTab', 0);
export const tabsAtom = atomWithStorage<Tab[]>('json.tabs', [
  {
    name: defaultTabName,
    content: {},
    source: '',
    detectSourceType: '',
  },
]);

export const currentTabAtom = atom(
  (get) => {
    const tabs = get(tabsAtom);
    const activeTab = get(activeTabAtom);
    return tabs[activeTab];
  },
  (get, set, value: SetStateAction<Tab>) => {
    const tabs = get(tabsAtom);
    const activeTab = get(activeTabAtom);
    if (_.isFunction(value)) {
      value = value(tabs[activeTab]);
    }
    tabs[activeTab] = value;
    set(tabsAtom, tabs);
  },
);

export function useTabs() {
  const { i18n } = useLingui();
  const [tabs, setTabs] = useAtom(tabsAtom);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const [currentTab, setCurrentTab] = useAtom(currentTabAtom);

  const addTab = useCallback(
    async (source: string, replaceFirst: boolean = false) => {
      const sources = await transformSource(source);
      const tab: Tab = {
        name: sources.detectSourceType,
        content: sources.content,
        source: source,
        detectSourceType: sources.detectSourceType,
      };
      setTabs((prev) => {
        if (prev.length === 0) {
          tab.name = defaultTabName;
        }
        if (replaceFirst) {
          const lastTab = prev[prev.length - 1];
          tab.name = lastTab.name;
          return [tab, ...prev.slice(1)];
        }
        tab.name = i18n.t('Default Tab Name') + ' ' + (prev.length + 1);
        return [...prev, tab];
      });
      if (replaceFirst) {
        setCurrentTab(tab);
      }
    },
    [i18n, setTabs, setCurrentTab],
  );

  const removeTab = useCallback(
    (index: number) => {
      setTabs((prev) => {
        const newTabs = prev.filter((_, i) => i !== index);
        if (newTabs.length === 0) {
          newTabs.push({
            name: defaultTabName,
            content: undefined,
            source: '',
            detectSourceType: '',
          });
        }
        return newTabs;
      });
    },
    [setTabs],
  );

  const loadTab = useCallback(
    (index: number) => {
      const tab = tabs[index];
      if (tab) {
        addTab(tab.source, true);
      }
    },
    [addTab, tabs],
  );

  const cleanCurrentTab = useCallback(() => {
    const emptyTab = {
      name: defaultTabName,
      content: {},
      source: '',
      detectSourceType: '',
    };

    setTabs((prev) => {
      const newTabs = [...prev];
      newTabs[activeTab] = emptyTab;
      return newTabs;
    });

    setCurrentTab(emptyTab);
  }, [setCurrentTab, setTabs, activeTab]);

  const addEmptyTab = useCallback(() => {
    setTabs((prev) => {
      const newTabs = [...prev];
      newTabs.push({
        name: defaultTabName,
        content: {},
        source: '',
        detectSourceType: '',
      });
      return newTabs;
    });
    setTimeout(() => {
      setCurrentTab(tabs[tabs.length - 1]);
    }, 10);
  }, [setCurrentTab, setTabs, tabs]);

  return {
    activeTab,
    setActiveTab,
    currentTab,
    setCurrentTab,
    tabs,
    setTabs,
    addTab,
    removeTab,
    loadTab,
    cleanCurrentTab,
    addEmptyTab,
  };
}
