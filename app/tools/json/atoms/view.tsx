import { atom, useAtom } from 'jotai';

export declare type ViewType = 'tree' | 'json' | 'diff' | 'transformer';
export const currentView = atom<ViewType>('tree');

export function useView() {
  const [view, setView] = useAtom(currentView);

  return {
    view,
    setView,
  };
}
