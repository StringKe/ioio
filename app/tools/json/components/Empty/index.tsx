import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { useCallback, useEffect } from 'react';

import { useTabs } from '../../atoms/tabs';
import styles from './styles.module.css';

export function Empty({ className }: { className?: string }) {
  const { reloadCurrentTabContent } = useTabs();

  const onContent = useCallback(
    (content: string) => {
      reloadCurrentTabContent(content);
    },
    [reloadCurrentTabContent],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter') {
        onContent(event.currentTarget.value);
      }
    },
    [onContent],
  );

  const onPaste = useCallback(
    (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      onContent(event.clipboardData.getData('text'));
    },
    [onContent],
  );

  useEffect(() => {
    function handlePaste(event: ClipboardEvent) {
      if (event.clipboardData) {
        onContent(event.clipboardData.getData('text'));
      }
    }

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [onContent]);

  return (
    <div className={clsx(styles.root, className)}>
      <textarea className={styles.textarea} onKeyDown={onKeyDown} onPaste={onPaste} />
      <div className={styles.overlay}>
        <div className={styles.logo}>
          <img src='/logo/icon-512.png' alt='logo' />
        </div>
        <div className={styles.overlayText}>IoIo Tools</div>
        <div className={styles.overlayDescription}>
          <Trans>Paste anything here, or hit enter after typing.</Trans>
        </div>
      </div>
    </div>
  );
}
