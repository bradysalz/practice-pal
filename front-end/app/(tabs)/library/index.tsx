import { useRouter } from 'expo-router';
import { BookOpen, ChevronRight, Music, Search } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { CardWithAccent } from '@/components/card-with-accent';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { bookData, songsData } from '@/mock/data';

export default function LibraryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'books' | 'songs'>('books');

  const filteredBooks = bookData.filter(
    (book) =>
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSongs = songsData.filter(
    (song) =>
      song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (song.artist && song.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View className="flex-1 bg-slate-50/50 p-4">
      <View className="mb-6 relative">
        <Search className="absolute left-3 top-3 text-slate-400" size={16} />
        <TextInput
          placeholder="Search library..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="pl-8 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
        />
      </View>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-row space-x-2 mb-4">
          <TabsTrigger
            value="books"
            className="flex-1 flex-row items-center justify-center space-x-1"
          >
            <BookOpen size={16} />
            <Text>Books</Text>
          </TabsTrigger>
          <TabsTrigger
            value="songs"
            className="flex-1 flex-row items-center justify-center space-x-1"
          >
            <Music size={16} />
            <Text>Songs</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="books">
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <Pressable key={book.id} onPress={() => router.push(`/library/book/${book.id}`)}>
                  <Card className="mb-4">
                    <CardContent className="flex-row p-0">
                      <View className={`${book.coverColor} w-24 items-center justify-center`}>
                        <BookOpen size={32} className="text-slate-700" />
                      </View>
                      <View className="flex-1 p-4">
                        <Text className="font-medium text-lg">{book.name}</Text>
                        <Text className="text-slate-500">{book.author}</Text>
                        <View className="flex-row space-x-2 mt-2">
                          <Badge variant="secondary" className="text-sm">
                            {book.sections.length} sections
                          </Badge>
                          <Badge variant="secondary" className="text-sm">
                            <Text>
                              {book.sections.reduce((sum, section) => sum + section.exercises, 0)}{' '}
                              exercises
                            </Text>
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
          </ScrollView>
        </TabsContent>

        <TabsContent value="songs">
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            {filteredSongs.length > 0 ? (
              filteredSongs.map((song) => (
                <Pressable key={song.id} onPress={() => router.push(`/library/song/${song.id}`)}>
                  <CardWithAccent className="mb-4">
                    <CardHeader className="flex-row justify-between items-center p-4 pb-2">
                      <View>
                        <Text className="font-medium">{song.name}</Text>
                        {song.artist && (
                          <Text className="text-slate-500 italic">{song.artist}</Text>
                        )}
                      </View>
                    </CardHeader>
                    <CardContent className="flex-row justify-between items-center px-4 pt-0 pb-4">
                      <Text className="text-sm text-slate-500">Goal: {song.goalTempo} BPM</Text>
                      <Text className="text-xs">Last practiced: {song.lastPracticed}</Text>
                    </CardContent>
                  </CardWithAccent>
                </Pressable>
              ))
            ) : (
              <Text className="text-center text-slate-500 py-8">
                No songs found matching your search.
              </Text>
            )}
          </ScrollView>
        </TabsContent>
      </Tabs>
    </View>
  );
}
