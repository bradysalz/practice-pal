import { supabase } from '@/lib/supabase';
import { BookUploadData } from '@/types/book';

export async function insertFullBookRPC(bookData: BookUploadData): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase.rpc('insert_full_book', {
    book_name: bookData.bookName,
    book_author: bookData.bookAuthor,
    sections: bookData.sections,
    user_id: user.id
  });

  if (error) {
    throw new Error(error.message);
  }

  return data; // UUID of the new book
}

export async function deleteBook(bookId: string) {
  return supabase
    .from("books")
    .delete()
    .eq("id", bookId);
}

export async function updateBook(bookId: string, updates: { name?: string; author?: string }) {
  return supabase
    .from("books")
    .update(updates)
    .eq("id", bookId);
}
