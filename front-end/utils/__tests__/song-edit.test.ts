import { fuzzySearchArtists } from '@/utils/song-edit';
import { LocalArtist } from '@/types/artist';

describe('song-edit utils', () => {
  test('fuzzySearchArtists returns matching artists', () => {
    const artists: LocalArtist[] = [
      { id: '1', name: 'Bruno Mars', created_at: '', created_by: '', updated_at: '' },
      { id: '2', name: 'Miles Davis', created_at: '', created_by: '', updated_at: '' },
    ];
    const result = fuzzySearchArtists(artists, 'bru');
    expect(result[0].name).toBe('Bruno Mars');
  });

  test('returns empty array for empty query', () => {
    const artists: LocalArtist[] = [
      { id: '1', name: 'Bruno Mars', created_at: '', created_by: '', updated_at: '' },
    ];
    expect(fuzzySearchArtists(artists, '')).toEqual([]);
  });
});
