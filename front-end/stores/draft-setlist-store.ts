import { DraftSetlist, DraftSetlistItem } from '@/types/setlist';
import { create } from 'zustand';

type DraftSetlistsState = {
  draftSetlist: DraftSetlist | null;
  setDraftSetlist: (draft: DraftSetlist) => void;
  clearDraftSetlist: () => void;

  addItemToDraft: (item: DraftSetlistItem) => void;
  removeItemFromDraft: (itemId: string) => void;
  updateItemInDraft: (item: DraftSetlistItem) => void;
  reorderDraftItems: (newItems: DraftSetlistItem[]) => void;
};

export const useDraftSetlistsStore = create<DraftSetlistsState>((set, get) => ({
  draftSetlist: null,

  setDraftSetlist: (draft: DraftSetlist) => {
    set({ draftSetlist: draft });
  },

  clearDraftSetlist: () => {
    set({ draftSetlist: null });
  },

  addItemToDraft: (item) => {
    const current = get().draftSetlist;
    if (!current) return;
    set({
      draftSetlist: {
        ...current,
        items: [...current.items, item],
      },
    });
  },

  removeItemFromDraft: (itemId) => {
    const current = get().draftSetlist;
    if (!current) return;
    set({
      draftSetlist: {
        ...current,
        items: current.items.filter((item) => item.id !== itemId),
      },
    });
  },

  updateItemInDraft: (updatedItem) => {
    const current = get().draftSetlist;
    if (!current) return;
    set({
      draftSetlist: {
        ...current,
        items: current.items.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        ),
      },
    });
  },

  reorderDraftItems: (newItems) => {
    const current = get().draftSetlist;
    if (!current) return;
    set({
      draftSetlist: {
        ...current,
        items: newItems,
      },
    });
  },
}));
