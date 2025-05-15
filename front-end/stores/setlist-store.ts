import { Setlist, SetlistItem } from '@/types/setlist';
import { create } from 'zustand';

interface SetlistState {
  currentSetlist: Setlist | null;
  setSetlist: (setlist: Setlist) => void;
  addItem: (item: SetlistItem) => void;
  removeItem: (index: number) => void;
  reorderItems: (items: SetlistItem[]) => void;
  clearSetlist: () => void;
}

export const useSetlistStore = create<SetlistState>((set) => ({
  currentSetlist: null,

  setSetlist: (setlist) => set({ currentSetlist: setlist }),

  addItem: (item) =>
    set((state) => ({
      currentSetlist: state.currentSetlist
        ? { ...state.currentSetlist, items: [...state.currentSetlist.items, item] }
        : state.currentSetlist,
    })),

  removeItem: (index) =>
    set((state) => {
      if (!state.currentSetlist) return state;
      const newItems = [...state.currentSetlist.items];
      newItems.splice(index, 1);
      return { currentSetlist: { ...state.currentSetlist, items: newItems } };
    }),

  reorderItems: (items) =>
    set((state) => {
      if (!state.currentSetlist) return state;
      return { currentSetlist: { ...state.currentSetlist, items } };
    }),

  clearSetlist: () => set({ currentSetlist: null }),
}));
