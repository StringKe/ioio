import type { GroupProps } from '@mantine/core';

import { Group } from '@mantine/core';
import React from 'react';
import { useMeasure, useMount, usePrevious, useShallowCompareEffect, useUpdateEffect } from 'react-use';

type CollapseDirection = 'start' | 'end';
type OverflowDirection = 'none' | 'grow' | 'shrink';

export interface OverflowListProps<T> extends Omit<GroupProps, 'ref' | 'children'> {
  items: T[];
  itemRenderer: (item: T, index: number) => React.ReactNode;
  overflowRenderer: (items: T[]) => React.ReactNode;
  minVisibleItems?: number;
  onOverflow?: (items: T[]) => void;
  collapseFrom?: CollapseDirection;
  alwaysRenderOverflow?: boolean;
}

interface OverflowListState<T> {
  visible: T[];
  overflow: T[];
  lastOverflowCount: number;
  overflowDirection: OverflowDirection;
}

export function OverflowList<T>({
  items,
  collapseFrom = 'end',
  minVisibleItems = 0,
  alwaysRenderOverflow = false,
  overflowRenderer,
  itemRenderer,
  ...props
}: OverflowListProps<T>) {
  const [state, setState] = React.useState<OverflowListState<T>>({
    visible: items,
    overflow: [],
    lastOverflowCount: 0,
    overflowDirection: 'none',
  });

  const spacer = React.useRef<HTMLDivElement>(null);

  useShallowCompareEffect(() => {
    repartition(false);
  }, [state]);

  useMount(() => {
    repartition(false);
  });

  useUpdateEffect(() => {
    setState(() => ({
      overflowDirection: 'none',
      lastOverflowCount: 0,
      overflow: [],
      visible: items,
    }));
  }, [items]);

  const maybeOverflow = state.overflow.length === 0 && !alwaysRenderOverflow ? null : overflowRenderer(state.overflow);

  const repartition = (growing: boolean) => {
    if (!spacer.current) {
      return;
    }

    if (growing) {
      setState((state) => ({
        overflowDirection: 'grow',
        lastOverflowCount: state.overflowDirection === 'none' ? state.overflow.length : state.lastOverflowCount,
        overflow: [],
        visible: items,
      }));
    } else if (spacer.current.getBoundingClientRect().width < 0.9) {
      setState((state) => {
        if (state.visible.length <= minVisibleItems!) {
          return state;
        }
        const collapseFromStart = collapseFrom === 'start';
        const visible = state.visible.slice();
        const next = collapseFromStart ? visible.shift() : visible.pop();
        if (!next) {
          return state;
        }
        const overflow = collapseFromStart ? [...state.overflow, next] : [next, ...state.overflow];
        return {
          ...state,
          direction: state.overflowDirection === 'none' ? 'shrink' : state.overflowDirection,
          overflow,
          visible,
        };
      });
    } else {
      setState((prevState) => {
        return { ...prevState, overflowDirection: 'none' };
      });
    }
  };

  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const previousWidth = usePrevious(width);

  React.useEffect(() => {
    if (!previousWidth) return;

    repartition(width > previousWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, previousWidth]);

  return (
    <Group
      ref={ref}
      {...props}
      style={{
        ...props.style,
        display: 'flex',
        flexWrap: 'nowrap',
        minWidth: 0,
      }}
    >
      {collapseFrom === 'start' ? maybeOverflow : null}
      {state.visible.map(itemRenderer)}
      {collapseFrom === 'end' ? maybeOverflow : null}
      <div style={{ flexShrink: 1, width: 1 }} ref={spacer} />
    </Group>
  );
}
