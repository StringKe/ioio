import { t } from '@lingui/core/macro';
import { ActionIcon, Stack, Tooltip } from '@mantine/core';
import IconJson from '~icons/tabler/json';
import IconTree from '~icons/tabler/list-tree';
import IconTable from '~icons/tabler/table';

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

      <Tooltip label={t`Table View`}>
        <ActionIcon
          variant={view === 'table' ? 'light' : 'subtle'}
          color={view === 'table' ? 'blue' : 'gray'}
          size='lg'
          onClick={() => setView('table')}
        >
          <IconTable />
        </ActionIcon>
      </Tooltip>
    </Stack>
  );
}
