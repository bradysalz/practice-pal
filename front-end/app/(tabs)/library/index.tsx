import { useRouter } from 'expo-router';
import { BookOpen, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { CardWithAccent } from '@/components/card-with-accent';
import { ThemedIcon } from '@/components/icons/themed-icon';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useArtistsStore } from '@/stores/artist-store';
import { useBooksStore } from '@/stores/book-store';
import { useSectionsStore } from '@/stores/section-store';
import { useSongsStore } from '@/stores/song-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LibraryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('books');

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

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <View className="bg-slate-300 py-1 rounded-xl">
              <TabsList className="flex-row bg-slate-300 py-1 rounded-xl">
                <TabsTrigger value="books" className="flex-1 rounded-xl">
                  <View className="flex-row items-center justify-center gap-x-2 rounded-xl">
                    <ThemedIcon
                      name="BookOpen"
                      size={31}
                      color={activeTab === 'books' ? 'black' : '#6B7280'}
                    />
                    <Text className={`text-3xl ${activeTab === 'books' ? 'text-black' : 'text-gray-500'}`}>
                      Books
                    </Text>
                  </View>
                </TabsTrigger>
                <TabsTrigger value="songs" className="flex-1 rounded-xl">
                  <View className="flex-row items-center justify-center gap-x-2 rounded-xl">
                    <ThemedIcon
                      name="Music"
                      size={31}
                      color={activeTab === 'songs' ? 'black' : '#6B7280'}
                    />
                    <Text className={`text-3xl ${activeTab === 'songs' ? 'text-black' : 'text-gray-500'}`}>
                      Songs
                    </Text>
                  </View>
                </TabsTrigger>
              </TabsList>
            </View>

            <View className="mt-4 space-y-4 mb-24">
              <TabsContent value="books">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <Pressable key={book.id} onPress={() => router.push(`/library/book/${book.id}`)}>
                      <Card className="mb-4 bg-slate-100">
                        <CardContent className="flex-row p-0">
                          <View
                            className={`bg-${book.cover_color}-100 w-24 items-center justify-center`}
                          >
                            <BookOpen size={32} className="text-slate-700" />
                          </View>
                          <View className="flex-1 p-4">
                            <Text className="font-medium text-lg">{book.name}</Text>
                            <View className="flex-row mt-2">
                              <Badge variant="secondary" className="text-sm mr-5 bg-slate-200">
                                <Text>{bookSections(book.id).length} sections</Text>
                              </Badge>
                              <Badge variant="secondary" className="text-sm bg-slate-200">
                                <Text>{book.exercise_count} exercises</Text>
                              </Badge>
                            </View>
                          </View>
                          <View className="justify-center pr-3">
                            <ChevronRight size={20} className="text-slate-400" />
                          </View>
                        </CardContent>
                      </Card>
                    </Pressable>
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
                    <Pressable key={song.id} onPress={() => router.push(`/library/song/${song.id}`)}>
                      <CardWithAccent className="mb-4 bg-slate-100">
                        <CardHeader className="flex-row justify-between items-center p-4 pb-2">
                          <View>
                            <Text className="font-medium">{song.name}</Text>
                            {song.artist && (
                              <Text className="text-slate-500 italic">{song.artist}</Text>
                            )}
                          </View>
                        </CardHeader>
                        <CardContent className="flex-row justify-between items-center px-4 pt-0 pb-4">
                          <Text className="text-sm text-slate-500">
                            Goal: {/* song.goalTempo */} BPM
                          </Text>
                          <Text className="text-xs">Last practiced: {/* song.lastPracticed */}</Text>
                        </CardContent>
                      </CardWithAccent>
                    </Pressable>
                  ))
                ) : (
                  <Text className="text-center text-slate-500 py-8">
                    No songs found matching your search.
                  </Text>
                )}
              </TabsContent>
            </View>
          </Tabs>
        </View>
      </ScrollView>

      <FloatingActionButton href="/library/add-item" />
    </View>
  );
}
