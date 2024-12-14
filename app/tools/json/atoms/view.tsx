import { atom, useAtom } from 'jotai';

export declare type ViewType = 'tree' | 'table' | 'json' | 'diff';
export const currentView = atom<ViewType>('tree');

export function useView() {
  const [view, setView] = useAtom(currentView);

  return {
    view,
    setView,
  };
}
