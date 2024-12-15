import _ from 'lodash';
import { useMemo } from 'react';

import { useTabs } from '../atoms/tabs';
import { useView } from '../atoms/view';
import { Empty } from '../components/Empty';
import { DiffView } from './diff';
import { JSONView } from './json';
import { TransformerView } from './transformer';
import { TreeView } from './tree';

export function ViewDispatch({ className }: { className?: string }) {
  const { view } = useView();
  const { currentTab } = useTabs();

  const hasContent = useMemo(() => {
    return !(_.isNil(currentTab?.content) || _.isEmpty(currentTab?.content));
  }, [currentTab]);

  if (!hasContent) {
    return <Empty className={className} />;
  }

  if (view === 'tree') {
    return <TreeView className={className} />;
  }

  if (view === 'diff') {
    return <DiffView className={className} />;
  }

  if (view === 'transformer') {
    return <TransformerView className={className} />;
  }

  return <JSONView className={className} />;
}
