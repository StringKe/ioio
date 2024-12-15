import type { SetStateAction } from 'jotai';

import { type MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import _ from 'lodash';
import { nanoid } from 'nanoid';
import { useCallback } from 'react';

import { parserSource } from '../utils/sources';

export const defaultTabName = msg`Default Tab Name`;

export type JsonContent = { [key: string]: any } | any[];

export interface Tab {
  id: string;
  name: string | MessageDescriptor;
  content?: JsonContent;
  source: string;
  detectSourceType: string;
}
export const activeTabAtom = atomWithStorage<string>('json.activeTab', 'default');
export const tabsAtom = atomWithStorage<Tab[]>('json.tabs', [
  {
    id: 'default',
    name: defaultTabName,
    content: {},
    source: '',
    detectSourceType: '',
  },
]);

let id = 1;

export function useTabs() {
  const { i18n } = useLingui();
  const [tabs, setTabs] = useAtom(tabsAtom);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);

  const currentTab = tabs.find((tab) => tab.id === activeTab);
  const setCurrentTab = useCallback(
    (tab: SetStateAction<Tab>) => {
      setTabs((prev) => {
        const index = prev.findIndex((t) => t.id === activeTab);
        if (index === -1) return prev;

        const newTabs = [...prev];
        const newTab = _.isFunction(tab) ? tab(newTabs[index]) : tab;
        newTabs[index] = newTab;
        return newTabs;
      });
    },
    [setTabs, activeTab],
  );

  const reloadCurrentTabContent = useCallback(
    async (content: string) => {
      const sources = await parserSource(content);

      setCurrentTab((prev) => {
        return {
          ...prev,
          content: sources.content,
          detectSourceType: sources.detectSourceType,
          source: content,
        };
      });
    },
    [setCurrentTab],
  );

  const addTab = useCallback(
    async (source: string) => {
      const sources = await parserSource(source);
      const tab: Tab = {
        id: nanoid(),
        name: sources.detectSourceType,
        content: sources.content,
        source: source,
        detectSourceType: sources.detectSourceType,
      };

      setTabs((prev) => {
        if (prev.length === 0) {
          tab.name = defaultTabName;
        }
        tab.name = i18n.t('Default Tab Name') + ' ' + (prev.length + 1);
        return [...prev, tab];
      });

      setTimeout(() => {
        setActiveTab(tab.id);
      }, 10);
    },
    [i18n, setTabs, setActiveTab],
  );

  const removeTab = useCallback(
    (tabId: string) => {
      setTabs((prev) => {
        const newTabs = prev.filter((tab) => tab.id !== tabId);
        if (newTabs.length === 0) {
          newTabs.push({
            id: nanoid(),
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
    (tabId: string) => {
      const tab = tabs.find((t) => t.id === tabId);
      if (tab) {
        addTab(tab.source);
      }
    },
    [addTab, tabs],
  );

  const cleanCurrentTab = useCallback(() => {
    const emptyTab = {
      id: nanoid(),
      name: defaultTabName,
      content: {},
      source: '',
      detectSourceType: '',
    };

    setTabs((prev) => {
      const activeTabIndex = prev.findIndex((tab) => tab.id === activeTab);
      if (activeTabIndex === -1) return prev;

      const newTabs = [...prev];
      newTabs[activeTabIndex] = emptyTab;
      return newTabs;
    });

    setActiveTab(emptyTab.id);
  }, [setActiveTab, setTabs, activeTab]);

  const addEmptyTab = useCallback(() => {
    const tab = {
      id: nanoid(),
      name: i18n._(defaultTabName) + ' ' + id++,
      content: {},
      source: '',
      detectSourceType: '',
    };
    setTabs((prev) => {
      return [...prev, tab];
    });

    setTimeout(() => {
      setActiveTab(tab.id);
    }, 10);
  }, [setActiveTab, setTabs, i18n]);

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
    reloadCurrentTabContent,
  };
}
