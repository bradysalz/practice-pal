import { Database } from '@/types/supabase';

export type SongRow = Database['public']['Tables']['songs']['Row'];
export type SongInsert = Database['public']['Tables']['songs']['Insert'];
export type LocalSong = Omit<SongInsert, 'created_by'> & {
  artist_id: string;
};
export type NewSong = Omit<LocalSong, 'id'>;
