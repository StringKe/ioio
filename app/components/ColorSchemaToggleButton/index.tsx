import { t } from '@lingui/core/macro';
import { ActionIcon, ActionIconProps, MantineColorScheme, Tooltip, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import cx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import IconMoon from '~icons/tabler/moon';
import IconSun from '~icons/tabler/sun';
import IconSunMoon from '~icons/tabler/sun-moon';

import classes from './styles.module.css';

const colorSchemas: MantineColorScheme[] = ['light', 'dark', 'auto'];
const colorSchemaIcons = {
  light: IconSun,
  dark: IconMoon,
  auto: IconSunMoon,
};

export function ColorSchemaToggleButton({ absolute, size = 'xs' }: { absolute?: boolean; size?: ActionIconProps['size'] }) {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const Icon = useMemo(() => {
    if (!mounted) {
      return colorSchemaIcons.auto;
    }
    return colorSchemaIcons[colorScheme];
  }, [colorScheme, mounted]);

  const onClick = () => {
    const index = colorSchemas.indexOf(colorScheme);
    setColorScheme(colorSchemas[(index + 1) % colorSchemas.length]);
  };

  return (
    <Tooltip label={t`Toggle color scheme`}>
      <ActionIcon
        className={absolute ? classes.absolute : undefined}
        onClick={onClick}
        variant={'transparent'}
        size={size}
        aria-label={t`Toggle color scheme`}
      >
        <Icon className={cx(classes.icon, computedColorScheme == 'light' ? classes.dark : classes.light)} style={{ strokeWidth: 1.5 }} />
      </ActionIcon>
    </Tooltip>
  );
}
