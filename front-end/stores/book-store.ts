import { deleteBook, insertBook, updateBook } from '@/lib/db/mutations';
import { refreshAndSelectBooks } from '@/lib/db/queries';
import { BookWithCountsRow, NewBook } from '@/types/book';
import { create } from 'zustand';

type BooksState = {
  books: BookWithCountsRow[];
  fetchBooks: () => Promise<void>;
  addBook: (book: NewBook) => Promise<void>;
  updateBook: (id: string, updates: { name?: string; author?: string }) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
};

export const useBooksStore = create<BooksState>((set, get) => ({
  books: [],

  fetchBooks: async () => {
    const books = await refreshAndSelectBooks();
    set({ books });
  },

  addBook: async (book: NewBook) => {
    await insertBook(book.name, book.author);
    await get().fetchBooks();
  },

  updateBook: async (id: string, updates: { name?: string; author?: string }) => {
    await updateBook(id, updates);
    await get().fetchBooks();
  },

  deleteBook: async (id: string) => {
    await deleteBook(id);
    await get().fetchBooks();
  },
}));
