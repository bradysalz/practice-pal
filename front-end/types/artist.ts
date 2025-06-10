import { Database } from '@/types/supabase';

export type ArtistRow = Database['public']['Tables']['artists']['Row'];
export type ArtistInsert = Database['public']['Tables']['artists']['Insert'];
export type LocalArtist = Omit<ArtistInsert, 'created_by'>;
export type NewArtist = Omit<LocalArtist, 'id'>;
