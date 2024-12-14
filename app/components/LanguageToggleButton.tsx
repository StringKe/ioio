import { t } from '@lingui/core/macro';
import { Trans as TransComponent } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { ActionIcon, ActionIconProps, Menu, Tooltip } from '@mantine/core';
import IconLanguage from '~icons/tabler/language';
import { getLanguages, useLocaleSelector } from '../modules/lingui/lingui';

export function LanguageToggleButton({ size = 'xs' }: { size?: ActionIconProps['size'] }) {
  const languages = getLanguages();
  const { locale, setLocale } = useLocaleSelector();

  return (
    <Menu>
      <Menu.Target>
        <Tooltip label={<Trans>Toggle Language</Trans>}>
          <ActionIcon variant={'transparent'} size={size} aria-label={t`Toggle Language`}>
            <IconLanguage style={{ strokeWidth: 1.5 }} />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        {languages.map((language) => (
          <Menu.Item key={language.key} onClick={() => setLocale(language.key)}>
            <TransComponent id={language.label.id} />
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
