import { ArtistRow } from '@/types/artist';
import { BookWithCountsRow } from '@/types/book';
import { ExerciseRow } from '@/types/exercise';
import { SectionWithCountsRow } from '@/types/section';
import { SessionItemWithNested, SessionWithItems } from '@/types/session';
import { SetlistItemWithNested, SetlistWithItems } from '@/types/setlist';
import { LocalSong } from '@/types/song';

// Mock UUID for consistent testing
export const MOCK_UUID = '123e4567-e89b-12d3-a456-426614174000';

// Base timestamp for consistency
const BASE_TIMESTAMP = '2024-01-01T00:00:00Z';

// Artist mock data
export const mockArtist: ArtistRow = {
  id: '1',
  name: 'Test Artist',
  created_at: BASE_TIMESTAMP,
  created_by: 'user1',
  updated_at: BASE_TIMESTAMP,
};

// Miles Davis artist for session tests
export const mockMilesDavis: ArtistRow = {
  id: 'artist1',
  name: 'Miles Davis',
  created_at: BASE_TIMESTAMP,
  created_by: 'user1',
  updated_at: BASE_TIMESTAMP,
};

// Book mock data
export const mockBook: BookWithCountsRow = {
  id: '1',
  name: 'Test Book',
  author: 'Test Author',
  created_at: BASE_TIMESTAMP,
  created_by: 'user1',
  updated_at: BASE_TIMESTAMP,
  exercise_count: 1,
};

// Stick Control book for session tests
export const mockStickControl: BookWithCountsRow = {
  id: 'book1',
  name: 'Stick Control',
  author: 'Test Author',
  created_at: BASE_TIMESTAMP,
  created_by: 'user1',
  updated_at: BASE_TIMESTAMP,
  exercise_count: 1,
};

// Section mock data
export const mockSection: SectionWithCountsRow = {
  id: '1',
  name: 'Test Section',
  book_id: '1',
  created_at: BASE_TIMESTAMP,
  created_by: 'user1',
  updated_at: BASE_TIMESTAMP,
  exercise_count: 1,
  order: 1,
};

// Stickings section for session tests
export const mockStickingsSection: SectionWithCountsRow = {
  id: 'sec1',
  name: 'Section 1',
  book_id: 'book1',
  created_at: BASE_TIMESTAMP,
  created_by: 'user1',
  updated_at: BASE_TIMESTAMP,
  exercise_count: 1,
  order: 1,
};

// Exercise mock data
export const mockExercise: ExerciseRow = {
  id: '1',
  name: 'Test Exercise',
  section_id: '1',
  created_at: BASE_TIMESTAMP,
  created_by: 'user1',
  updated_at: BASE_TIMESTAMP,
  filepath: null,
  goal_tempo: null,
  order: 1,
};

// Exercise 1 for session tests
export const mockExercise1: ExerciseRow = {
  id: 'ex1',
  name: 'Exercise 1',
  section_id: 'sec1',
  created_at: BASE_TIMESTAMP,
  created_by: 'user1',
  updated_at: BASE_TIMESTAMP,
  filepath: null,
  goal_tempo: null,
  order: 1,
};

// Song mock data
export const mockSong: LocalSong = {
  id: '1',
  name: 'Test Song',
  artist_id: '1',
  created_at: BASE_TIMESTAMP,
  updated_at: BASE_TIMESTAMP,
  goal_tempo: null,
};

// So What song for session tests
export const mockSoWhat: LocalSong = {
  id: 'song1',
  name: 'So What',
  artist_id: 'artist1',
  created_at: BASE_TIMESTAMP,
  updated_at: BASE_TIMESTAMP,
  goal_tempo: null,
};

// Session item with exercise mock data
export const mockSessionItemWithExercise: SessionItemWithNested = {
  id: '1',
  type: 'exercise',
  session_id: 's1',
  song: null,
  created_by: 'user1',
  created_at: BASE_TIMESTAMP,
  updated_at: BASE_TIMESTAMP,
  exercise_id: 'ex1',
  song_id: null,
  tempo: 120,
  notes: 'Exercise Notes',
  position: 0,
  exercise: {
    ...mockExercise1,
    section: {
      ...mockStickingsSection,
      book: mockStickControl,
    },
  },
};

// Session item with song mock data
export const mockSessionItemWithSong: SessionItemWithNested = {
  id: '2',
  type: 'song',
  session_id: 's1',
  created_by: 'user1',
  created_at: BASE_TIMESTAMP,
  updated_at: BASE_TIMESTAMP,
  exercise_id: null,
  song_id: 'song1',
  tempo: 100,
  notes: 'Song Notes',
  position: 1,
  song: {
    ...mockSoWhat,
    artist: mockMilesDavis,
    created_by: 'user1',
    created_at: BASE_TIMESTAMP,
    updated_at: BASE_TIMESTAMP,
    goal_tempo: null,
  },
  exercise: null,
};

// Complete session mock data
export const mockSession: SessionWithItems = {
  id: '1',
  duration: 30,
  created_at: BASE_TIMESTAMP,
  created_by: 'user1',
  updated_at: BASE_TIMESTAMP,
  song_count: 1,
  exercise_count: 1,
  session_items: [mockSessionItemWithSong, mockSessionItemWithExercise],
};

// Setlist item with song mock data
export const mockSetlistItemWithSong: SetlistItemWithNested = {
  id: '1',
  setlist_id: '1',
  type: 'song',
  song_id: '1',
  exercise_id: null,
  created_at: BASE_TIMESTAMP,
  created_by: 'user1',
  updated_at: BASE_TIMESTAMP,
  position: 1,
  song: {
    ...mockSong,
    artist: mockArtist,
    created_by: 'user1',
    created_at: BASE_TIMESTAMP,
    updated_at: BASE_TIMESTAMP,
    goal_tempo: null,
  },
  exercise: null,
};

// Setlist item with exercise mock data
export const mockSetlistItemWithExercise: SetlistItemWithNested = {
  id: '2',
  setlist_id: '1',
  type: 'exercise',
  song_id: null,
  exercise_id: '1',
  created_at: BASE_TIMESTAMP,
  created_by: 'user1',
  updated_at: BASE_TIMESTAMP,
  position: 2,
  song: null,
  exercise: {
    ...mockExercise,
    section: {
      ...mockSection,
      book: mockBook,
    },
  },
};

// Complete setlist mock data
export const mockSetlist: SetlistWithItems = {
  id: '1',
  name: 'Test Setlist',
  description: 'Test Description',
  created_at: BASE_TIMESTAMP,
  created_by: 'user1',
  updated_at: BASE_TIMESTAMP,
  song_count: 1,
  exercise_count: 1,
  setlist_items: [mockSetlistItemWithSong, mockSetlistItemWithExercise],
};
