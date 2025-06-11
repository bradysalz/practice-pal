import Fuse from 'fuse.js';
import { LocalArtist } from '@/types/artist';

export function fuzzySearchArtists(artists: LocalArtist[], query: string): LocalArtist[] {
  if (!query) return [];
  const fuse = new Fuse(artists, {
    keys: ['name'],
    threshold: 0.3,
    distance: 100,
    minMatchCharLength: 1,
    shouldSort: true,
    includeScore: true,
  });
  return fuse
    .search(query)
    .filter((result) => result.score && result.score < 0.6)
    .map((result) => result.item);
}
