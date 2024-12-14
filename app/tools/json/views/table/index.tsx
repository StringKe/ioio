import { Trans } from '@lingui/react/macro';
import { Stack } from '@mantine/core';
import clsx from 'clsx';

import styles from './styles.module.css';

export function TableView({ className }: { className?: string }) {
  return (
    <Stack gap={0} className={clsx(styles.root, className)}>
      <Trans>Main Content</Trans>
    </Stack>
  );
}
