import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type BookRow = Database['public']['Tables']['books']['Row'];
type BookInsert = Database['public']['Tables']['books']['Insert'];
type InputBook = Omit<BookInsert, 'id' | 'created_at' | 'updated_at'>;

type BooksState = {
  books: BookRow[];
  addBookLocal: (book: InputBook) => string;
  syncAddBook: (tempId: string) => Promise<void>;
  fetchBooks: () => Promise<void>;
};

export const useBooksStore = create<BooksState>((set, get) => ({
  books: [],

  fetchBooks: async () => {
    const { data, error } = await supabase.from('books').select('*');
    if (error) {
      console.error('Fetch failed', error);
      return;
    }
    set({ books: data as BookRow[] });
  },

  addBookLocal: (book) => {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newBook: BookRow = {
      id,
      created_by: book.created_by,
      name: book.name,
      created_at: now,
      updated_at: now,
    };
    set((state) => ({ books: [...state.books, newBook] }));
    return id;
  },

  syncAddBook: async (id) => {
    const localBook = get().books.find((s) => s.id === id);
    if (!localBook) return;

    const { data, error } = await supabase.from('books').insert(localBook).select().single();

    if (error) {
      console.error('Sync failed', error);
      // Optional: mark sync failure, revert, etc.
    } else {
      set((state) => ({
        books: state.books.map((s) => (s.id === id ? data : s)),
      }));
    }
  },
}));
