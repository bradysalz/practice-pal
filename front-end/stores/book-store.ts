import { db } from '@/lib/db/db';
import { bookWithCountsView, refreshBookWithCountsView } from '@/lib/db/views/book_counts';
import { BookWithCountsRow } from '@/types/book';
import { create } from 'zustand';

type BooksState = {
  books: BookWithCountsRow[];
  fetchBooks: () => Promise<void>;
};

export const useBooksStore = create<BooksState>((set) => ({
  books: [],

  fetchBooks: async () => {
    await refreshBookWithCountsView();
    const books = await db.select().from(bookWithCountsView);
    set({ books });
  },
}));
