import type { SplitviewApi } from 'dockview-core';
import type { SplitviewReadyEvent } from 'dockview-react';
import type { FC } from 'react';

import 'dockview-core/dist/styles/dockview.css';

import { Orientation, SplitviewReact } from 'dockview-react';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface WithSplitPanelProps {
  startComponent: FC;
  endComponent: FC;
}

export interface SplitPanelProps {
  direction?: 'horizontal' | 'vertical';
  startMiniSize?: number;
  endMiniSize?: number;
}

export function WithSplitPanel({ startComponent, endComponent }: WithSplitPanelProps) {
  const components = {
    start: startComponent,
    end: endComponent,
  };

  const SplitPanel = forwardRef<SplitviewApi | undefined, SplitPanelProps>(function SplitPanel(props, ref) {
    const { direction = 'horizontal', startMiniSize = 100, endMiniSize = 100 } = props;

    const apiRef = useRef<SplitviewApi>();

    function onReady(event: SplitviewReadyEvent) {
      apiRef.current = event.api;

      event.api.addPanel({
        id: 'start',
        component: 'start',
        minimumSize: startMiniSize,
      });

      event.api.addPanel({
        id: 'end',
        component: 'end',
        minimumSize: endMiniSize,
      });
    }

    useImperativeHandle(ref, () => apiRef.current);

    return (
      <SplitviewReact
        orientation={direction === 'horizontal' ? Orientation.HORIZONTAL : Orientation.VERTICAL}
        onReady={onReady}
        components={components}
      />
    );
  });

  return SplitPanel;
}
