import { Database } from '@/types/supabase';
import { NonNullableFields } from '@/types/util';

export type BookRow = Database['public']['Tables']['books']['Row'];
type BookWithCountsPrivate = Database['public']['Views']['book_with_counts']['Row'];
export type BookWithCountsRow = NonNullableFields<BookWithCountsPrivate>;

export type ExerciseNamingType = 'alpha' | 'numeric' | 'custom';

export interface SectionFormData {
  name: string;
  exerciseCount: number;
  exerciseNaming: ExerciseNamingType;
  customExerciseNames?: string[];
}

export interface BookFormData {
  bookName: string;
  bookAuthor: string;
  sections: SectionFormData[];
}

export interface SectionUploadData {
  name: string;
  exerciseNames: string[];
}

export interface BookUploadData {
  bookName: string;
  bookAuthor: string;
  sections: SectionUploadData[];
}
