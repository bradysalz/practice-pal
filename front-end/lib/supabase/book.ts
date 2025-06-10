import { supabase } from '@/lib/supabase';
import { BookUploadData } from '@/types/book';
import { Database } from '@/types/supabase';

export type BookRow = Database['public']['Tables']['books']['Row'];
export type BookWithCountsRow = BookRow & {
  exercise_count: number;
};

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

export async function fetchBooks() {
  return supabase.from('book_with_counts').select('*');
}

export async function updateBook(bookId: string, updates: Partial<BookRow>) {
  return supabase
    .from("books")
    .update(updates)
    .eq("id", bookId);
}

export async function insertBook(book: BookRow) {
  return supabase
    .from("books")
    .insert(book)
    .select()
    .single();
}

export async function deleteBook(id: string) {
  return supabase
    .from("books")
    .delete()
    .eq("id", id);
}
