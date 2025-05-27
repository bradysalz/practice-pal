import { useArtistsStore } from '@/stores/artist-store';
import { useBooksStore } from '@/stores/book-store';
import { useSectionsStore } from '@/stores/section-store';
import { useSessionsStore } from '@/stores/session-store';
import { useSetlistsStore } from '@/stores/setlist-store';
import { useSongsStore } from '@/stores/song-store';
import * as React from 'react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export function DataProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);

  // Core data fetching functions
  const fetchBooks = useBooksStore((state) => state.fetchBooks);
  const fetchSections = useSectionsStore((state) => state.fetchSections);
  const fetchArtists = useArtistsStore((state) => state.fetchArtists);
  const fetchSongs = useSongsStore((state) => state.fetchSongs);
  const fetchSetlists = useSetlistsStore((state) => state.fetchSetlists);
  const fetchRecentSessions = useSessionsStore((state) => state.fetchRecentSessionsWithItems);

  useEffect(() => {
    async function loadInitialData() {
      try {
        // Load all core data in parallel
        await Promise.all([
          fetchBooks(),
          fetchSections(),
          fetchArtists(),
          fetchSongs(),
          fetchSetlists(),
          fetchRecentSessions(10), // Load last 10 sessions
        ]);
      } catch (error) {
        console.error('Failed to load initial data:', error);
        // You might want to show an error state here
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, [fetchBooks, fetchSections, fetchArtists, fetchSongs, fetchSetlists, fetchRecentSessions]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}
