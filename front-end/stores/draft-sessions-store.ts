import { DraftSession, DraftSessionItem } from '@/types/session';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type DraftSessionsState = {
  draftSession: DraftSession | null;
  setDraftSession: (draft: Partial<DraftSession>) => void;
  clearDraftSession: () => void;

  addItemToDraft: (item: Partial<DraftSessionItem>) => void;
  removeItemFromDraft: (itemId: string) => void;
  updateItemInDraft: (item: DraftSessionItem) => void;
  reorderDraftItems: (newItems: DraftSessionItem[]) => void;
  updateDraftDetails: (updates: Partial<DraftSession>) => void;
};

export const useDraftSessionsStore = create<DraftSessionsState>((set, get) => ({
  draftSession: null,

  setDraftSession: (draft) => {
    const id = draft.id || uuidv4();

    const newSession: DraftSession = {
      id,
      duration: draft.duration ?? 0,
      items: draft.items ?? [],
    };

    set({ draftSession: newSession });
  },

  clearDraftSession: () => {
    set({ draftSession: null });
  },

  addItemToDraft: (item) => {
    const current = get().draftSession;
    if (!current) return;

    const itemWithId: DraftSessionItem = {
      id: uuidv4(),
      type: item.type || 'exercise',
      notes: item.notes ?? null,
      tempo: item.tempo ?? null,
      exercise: item.exercise,
      song: item.song,
    };

    set({
      draftSession: {
        ...current,
        items: [...current.items, itemWithId],
      },
    });
  },

  removeItemFromDraft: (itemId) => {
    const current = get().draftSession;
    if (!current) return;
    set({
      draftSession: {
        ...current,
        items: current.items.filter((item) => item.id !== itemId),
      },
    });
  },

  updateItemInDraft: (updatedItem) => {
    const current = get().draftSession;
    if (!current) return;

    set({
      draftSession: {
        ...current,
        items: current.items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      },
    });
  },

  reorderDraftItems: (newItems) => {
    const current = get().draftSession;
    if (!current) return;
    set({
      draftSession: {
        ...current,
        items: newItems,
      },
    });
  },

  updateDraftDetails: (updates) => {
    const current = get().draftSession;
    if (!current) return;
    set({
      draftSession: {
        ...current,
        ...updates,
      },
    });
  },
}));
