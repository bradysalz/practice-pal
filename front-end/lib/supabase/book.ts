import { supabase } from '@/lib/supabase';
import { BookRow, BookUploadData } from '@/types/book';
import { getCurrentUserId } from './shared';

export async function insertFullBookRPC(bookData: BookUploadData): Promise<string> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase.rpc('insert_full_book', {
    book_name: bookData.bookName,
    book_author: bookData.bookAuthor,
    sections: bookData.sections,
    user_id: userId
  });

  if (error) {
    throw new Error(error.message);
  }

  return data; // UUID of the new book
}

export async function fetchBooks() {
  return supabase.from('book_with_counts').select('*');
}

export async function updateBook(bookId: string, updates: Partial<BookRow>) {
  return supabase
    .from("books")
    .update(updates)
    .eq("id", bookId);
}


export async function deleteBook(id: string) {
  return supabase
    .from("books")
    .delete()
    .eq("id", id);
}
