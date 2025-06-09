import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { create } from 'zustand';

// Not directly typing on the view because it null'd every field
export type BookRow = Database['public']['Tables']['books']['Row'];
export type BookWithCountsRow = BookRow & {
  exercise_count: number;
};

type BooksState = {
  books: BookWithCountsRow[];
  fetchBooks: () => Promise<void>;
};

export const useBooksStore = create<BooksState>((set, get) => ({
  books: [],

  fetchBooks: async () => {
    const { data, error } = await supabase.from('book_with_counts').select('*');
    if (error) {
      console.error('Fetch failed', error);
      return;
    }
    set({ books: data as BookWithCountsRow[] });
  }
}));
