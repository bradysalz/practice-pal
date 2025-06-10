import { BookWithCountsRow, fetchBooks } from '@/lib/supabase/book';
import { create } from 'zustand';

type BooksState = {
  books: BookWithCountsRow[];
  fetchBooks: () => Promise<void>;
};

export const useBooksStore = create<BooksState>((set, get) => ({
  books: [],

  fetchBooks: async () => {
    const { data, error } = await fetchBooks();
    if (error) {
      console.error('Fetch failed', error);
      return;
    }
    set({ books: data as BookWithCountsRow[] });
  }
}));
