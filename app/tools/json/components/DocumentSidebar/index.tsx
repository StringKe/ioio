import { t } from '@lingui/core/macro';
import { ActionIcon, Stack, Tooltip } from '@mantine/core';

import IconDiff from '~icons/tabler/file-diff';
import IconJson from '~icons/tabler/json';
import IconTree from '~icons/tabler/list-tree';
import IconTransform from '~icons/tabler/transform';

import { useView } from '../../atoms/view';

export function DocumentSidebar({ className, ...props }: { className?: string }) {
  const { view, setView } = useView();
  return (
    <Stack className={className} {...props} gap='xs' align='center' py='xs'>
      <Tooltip label={t`Tree View`}>
        <ActionIcon
          variant={view === 'tree' ? 'light' : 'subtle'}
          color={view === 'tree' ? 'blue' : 'gray'}
          size='lg'
          onClick={() => setView('tree')}
        >
          <IconTree />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={t`JSON View`}>
        <ActionIcon
          variant={view === 'json' ? 'light' : 'subtle'}
          color={view === 'json' ? 'blue' : 'gray'}
          size='lg'
          onClick={() => setView('json')}
        >
          <IconJson />
        </ActionIcon>
      </Tooltip>

      <Tooltip label={t`Transformer View`}>
        <ActionIcon
          variant={view === 'transformer' ? 'light' : 'subtle'}
          color={view === 'transformer' ? 'blue' : 'gray'}
          size='lg'
          onClick={() => setView('transformer')}
        >
          <IconTransform />
        </ActionIcon>
      </Tooltip>

      <Tooltip label={t`Diff View`}>
        <ActionIcon
          variant={view === 'diff' ? 'light' : 'subtle'}
          color={view === 'diff' ? 'blue' : 'gray'}
          size='lg'
          onClick={() => setView('diff')}
        >
          <IconDiff />
        </ActionIcon>
      </Tooltip>
    </Stack>
  );
}
