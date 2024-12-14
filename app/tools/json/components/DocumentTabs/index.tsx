import type { Tab } from '../../atoms/tabs';

import { OverflowList } from '../../../../components/OverflowList';
import { useTabs } from '../../atoms/tabs';
import styles from './styles.module.css';
import { TabItem } from './TabItem';

export function DocumentTabs() {
  const { tabs } = useTabs();
  return (
    <OverflowList<Tab>
      gap={4}
      className={styles.tabs}
      items={tabs}
      itemRenderer={(item, index, isLast) => {
        return <TabItem key={index} tab={item} index={index} isLast={isLast} />;
      }}
      overflowRenderer={(items) => <div key={'items'}>{items.join(', ')}</div>}
    />
  );
}
