import { useLocalDatabase } from '@/components/providers/LocalDatabaseProvider';
import { useSession } from '@/components/providers/SessionProvider'; // Import useSession
import { useArtistsStore } from '@/stores/artist-store';
import { useBooksStore } from '@/stores/book-store';
import { useSectionsStore } from '@/stores/section-store';
import { useSessionsStore } from '@/stores/session-store';
import { useSetlistsStore } from '@/stores/setlist-store';
import { useSongsStore } from '@/stores/song-store';
import * as React from 'react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native'; // Import Text for the loading message

export function DataProvider({ children }: PropsWithChildren) {
  const { session, isLoading: isSessionLoading } = useSession(); // Destructure session and the new isLoading
  const { isReady: isDatabaseReady } = useLocalDatabase(); // Get database ready state
  const [isDataLoading, setIsDataLoading] = useState(true); // Renamed for clarity to avoid conflict

  // Core data fetching functions
  const fetchBooks = useBooksStore((state) => state.fetchBooks);
  const fetchSections = useSectionsStore((state) => state.fetchSections);
  const fetchArtists = useArtistsStore((state) => state.fetchArtists);
  const fetchSongs = useSongsStore((state) => state.fetchSongs);
  const fetchSetlists = useSetlistsStore((state) => state.fetchSetlists);
  const fetchSessions = useSessionsStore((state) => state.fetchSessions);
  const fetchRecentSessions = useSessionsStore((state) => state.fetchRecentSessionsWithItems);

  useEffect(() => {
    // 1. Wait for the session to finish loading
    if (isSessionLoading) {
      console.log('DataProvider: Session is still loading, waiting...');
      return;
    }

    // 2. Wait for the database to be ready
    if (!isDatabaseReady) {
      console.log('DataProvider: Database is not ready yet, waiting...');
      return;
    }

    // 3. Once both session and database are loaded, proceed based on user presence
    async function loadInitialData() {
      if (!session?.user) {
        // If there's no user, and session is done loading,
        console.log(
          'DataProvider: No user found after session load. Skipping user-specific data fetch.'
        );
        setIsDataLoading(false);
        return;
      }

      // If user exists, proceed with fetching data
      try {
        console.log('DataProvider: Session loaded and user found. Starting data fetch...');
        setIsDataLoading(true); // Ensure loading state is true while fetching
        await Promise.all([
          fetchBooks(),
          fetchSections(),
          fetchArtists(),
          fetchSongs(),
          fetchSetlists(),
          fetchSessions(),
          fetchRecentSessions(10),
        ]);
        console.log('DataProvider: All initial data fetched successfully.');
      } catch (error) {
        console.error('DataProvider: Failed to load initial data:', error);
        // You might want to show an error state here or retry
      } finally {
        setIsDataLoading(false);
      }
    }

    loadInitialData();
  }, [
    session, // Dependency: Re-run if session object changes (e.g., user logs in/out)
    isSessionLoading, // Dependency: Re-run when session loading state changes from true to false
    isDatabaseReady, // Dependency: Re-run when database becomes ready
    fetchBooks,
    fetchSections,
    fetchArtists,
    fetchSongs,
    fetchSessions,
    fetchSetlists,
    fetchRecentSessions,
  ]);

  // Show a loading indicator if session is loading, database is not ready, or application data is loading
  if (isSessionLoading || !isDatabaseReady || isDataLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading application data...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If we reach here, both session and data (or lack thereof for non-users) are loaded.
  return <View style={{ flex: 1 }}>{children}</View>;
}
