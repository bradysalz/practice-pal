import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

// Not directly typing on the view because it null'd every field
export type BookRow = Database['public']['Tables']['books']['Row'];
export type BookWithCountsRow = BookRow & {
  exercise_count: number;
};

type BookInsert = Database['public']['Tables']['books']['Insert'];
type InputBook = Omit<BookInsert, 'id' | 'created_at' | 'updated_at'>;

function toBookInsert(book: BookWithCountsRow): BookInsert {
  const { exercise_count, ...bookInsert } = book;
  return bookInsert;
}

type BooksState = {
  books: BookWithCountsRow[];
  addBookLocal: (book: InputBook) => string;
  syncAddBook: (tempId: string) => Promise<void>;
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
  },

  addBookLocal: (book) => {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newBook: BookWithCountsRow = {
      id,
      created_by: book.created_by,
      cover_color: book.cover_color ?? null,
      name: book.name,
      created_at: now,
      updated_at: now,
      exercise_count: 0, // since it's a view field
    };
    set((state) => ({ books: [...state.books, newBook] }));
    return id;
  },

  syncAddBook: async (id) => {
    const localBook = get().books.find((s) => s.id === id);
    if (!localBook) return;

    const bookToUse = toBookInsert(localBook);
    const { data, error } = await supabase.from('books').insert(bookToUse).select().single();

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
