import { Database } from '@/types/supabase';

export type BookRow = Database['public']['Tables']['books']['Row'];
export type BookWithCountsRow = BookRow & {
  exercise_count: number;
};

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
