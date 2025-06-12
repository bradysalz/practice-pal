import { refreshAndSelectBooks } from '@/lib/db/queries';
import { BookWithCountsRow } from '@/types/book';
import { create } from 'zustand';

type BooksState = {
  books: BookWithCountsRow[];
  fetchBooks: () => Promise<void>;
};

export const useBooksStore = create<BooksState>((set) => ({
  books: [],

  fetchBooks: async () => {
    const books = await refreshAndSelectBooks();
    set({ books });
  },
}));
