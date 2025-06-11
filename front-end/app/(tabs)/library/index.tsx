import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { ListItemCard } from '@/components/shared/ListItemCard';
import { ReusableTabView, TabValue } from '@/components/shared/reusable-tab-view';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { TabsContent } from '@/components/ui/tabs';
import { useArtistsStore } from '@/stores/artist-store';
import { useBooksStore } from '@/stores/book-store';
import { useSectionsStore } from '@/stores/section-store';
import { useSongsStore } from '@/stores/song-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LIBRARY_TABS: readonly TabValue[] = ['books', 'songs'] as const;

export default function LibraryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabValue>('books');

  const insets = useSafeAreaInsets();

  // Get data from stores - no need to fetch since DataProvider handles it
  const books = useBooksStore((state) => state.books);
  const songs = useSongsStore((state) => state.songs);
  const artists = useArtistsStore((state) => state.artists);

  // Book Building
  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const bookSections = (bookId: string) => {
    const sections = useSectionsStore.getState().sections;
    return sections.filter((section) => section.book_id === bookId);
  };

  // Song building
  const artistMap = Object.fromEntries(artists.map((a) => [a.id, a.name]));

  const songsWithArtistNames = songs.map((song) => {
    if (!song.artist_id) return { ...song, artist: '' };
    if (artistMap[song.artist_id]) return { ...song, artist: artistMap[song.artist_id] };
    return { ...song, artist: '' };
  });

  const filteredSongs = songsWithArtistNames.filter(
    (song) =>
      song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (song.artist && song.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" style={{ paddingTop: insets.top }}>
        <View className="p-4">
          <View className="mb-6">
            <View className="relative w-full">
              <TextInput
                placeholder="Search library..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="w-full pl-8 pr-3 py-2 text-lg rounded-xl border border-slate-300 bg-white text-slate-900"
              />
            </View>
          </View>

          <ReusableTabView
            tabs={LIBRARY_TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            <TabsContent value="books">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <ListItemCard
                    key={book.id}
                    title={book.name}
                    description={`${bookSections(book.id).length} sections • ${book.exercise_count} exercises`}
                    onPress={() => router.push(`/library-detail/book/${book.id}`)}
                    className="mb-4"
                    rightElement={<ThemedIcon name="ChevronRight" size={20} color="slate-500" />}
                  />
                ))
              ) : (
                <Text className="text-center text-slate-500 py-8">
                  No books found matching your search.
                </Text>
              )}
            </TabsContent>

            <TabsContent value="songs">
              {filteredSongs.length > 0 ? (
                filteredSongs.map((song) => (
                  <ListItemCard
                    key={song.id}
                    title={song.name}
                    subtitle={song.artist}
                    onPress={() => router.push(`/library-detail/song/${song.id}`)}
                    className="mb-4"
                    rightElement={<ThemedIcon name="ChevronRight" size={20} color="slate-500" />}
                  />
                ))
              ) : (
                <Text className="text-center text-slate-500 py-8">
                  No songs found matching your search.
                </Text>
              )}
            </TabsContent>
          </ReusableTabView>
        </View>
      </ScrollView>

      <FloatingActionButton
        href={activeTab === 'books' ? '/library-forms/add-book' : '/library-forms/add-song'}
      />
    </View>
  );
}
