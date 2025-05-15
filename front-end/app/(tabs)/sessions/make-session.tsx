import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { bookData, setlistsData, songsData } from '@/mock/data';
import { router } from 'expo-router';
import { Play } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function MakeSessionPage() {
  const [activeTab, setActiveTab] = useState<'setlists' | 'books' | 'songs'>('setlists');

  const [viewMode, setViewMode] = useState<'tabs' | 'book' | 'section'>('tabs');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  return (
    <View className="flex-1 bg-white items-center">
      <ScrollView className="w-full max-w-md px-4 mt-6 mb-24 space-y-6">
        {/* Selected Items */}
        <View>
          <Text className="text-xl font-bold mb-2">Selected Items</Text>
          <View className="p-4 bg-slate-100 rounded-md">
            <Text className="text-slate-500">No items selected yet. Add items from below.</Text>
          </View>
        </View>

        {/* Add Items Header */}
        <Text className="text-xl font-bold">Add Items</Text>

        {/* Search */}
        <TextInput
          placeholder="Search..."
          className="px-3 py-2 border border-slate-300 rounded-md bg-white"
        />

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'setlists' | 'books' | 'songs')}
        >
          <TabsList className="flex-row space-x-2 mt-4">
            <TabsTrigger value="setlists" className="flex-1">
              Setlists
            </TabsTrigger>
            <TabsTrigger value="books" className="flex-1">
              Books
            </TabsTrigger>
            <TabsTrigger value="songs" className="flex-1">
              Songs
            </TabsTrigger>
          </TabsList>

          {/* Setlists Tab */}
          <TabsContent value="setlists" className="space-y-2 mt-4">
            {setlistsData.map((setlist) => (
              <View
                key={setlist.id}
                className="flex-row items-center justify-between p-4 bg-slate-100 rounded-md"
              >
                <View>
                  <Text className="font-medium">{setlist.name}</Text>
                  <Text className="text-sm text-slate-500">{setlist.items.length} items</Text>
                </View>
                <Pressable className="px-3 py-1 bg-primary rounded-md active:opacity-80">
                  <Text className="text-white text-sm">Add All</Text>
                </Pressable>
              </View>
            ))}
          </TabsContent>

          {/* Books Tab */}
          {viewMode === 'tabs' && (
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as 'setlists' | 'books' | 'songs')}
            >
              {/* Your TabsList + TabsTrigger same as before */}

              <TabsContent value="books" className="space-y-2 mt-4">
                {bookData.map((book) => (
                  <Pressable
                    key={book.id}
                    className="flex-row items-center justify-between p-4 bg-slate-100 rounded-md active:opacity-80"
                    onPress={() => {
                      setSelectedBook(book);
                      setViewMode('book');
                    }}
                  >
                    <View>
                      <Text className="font-medium">{book.name}</Text>
                      <Text className="text-sm text-slate-500">{book.author}</Text>
                    </View>
                  </Pressable>
                ))}
              </TabsContent>

              {/* Same for setlists & songs */}
            </Tabs>
          )}

          {viewMode === 'book' && selectedBook && (
            <View className="space-y-2 mt-4">
              <Pressable className="mb-2" onPress={() => setViewMode('tabs')}>
                <Text className="text-primary">{'< Back'}</Text>
              </Pressable>

              <Text className="text-xl font-bold">{selectedBook.name}</Text>
              {selectedBook.sections.map((section) => (
                <Pressable
                  key={section.id}
                  className="flex-row items-center justify-between p-4 bg-slate-100 rounded-md active:opacity-80"
                  onPress={() => {
                    setSelectedSection(section);
                    setViewMode('section');
                  }}
                >
                  <Text className="font-medium">{section.name}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {viewMode === 'section' && selectedSection && (
            <View className="space-y-2 mt-4">
              <Pressable className="mb-2" onPress={() => setViewMode('book')}>
                <Text className="text-primary">{'< Back'}</Text>
              </Pressable>

              <Text className="text-xl font-bold">{selectedSection.name}</Text>
              {Array.from({ length: selectedSection.exercises }, (_, exercise) => (
                <View
                  key={exercise}
                  className="flex-row items-center justify-between p-3 bg-slate-100 rounded-md"
                >
                  <Text>{exercise}</Text>
                  <Pressable className="px-3 py-1 bg-primary rounded-md active:opacity-80">
                    <Text className="text-white text-sm">Add</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {/* Songs Tab */}
          <TabsContent value="songs" className="space-y-2 mt-4">
            {songsData.map((song) => (
              <View
                key={song.id}
                className="flex-row items-center justify-between p-4 bg-slate-100 rounded-md"
              >
                <View>
                  <Text className="font-medium">{song.name}</Text>
                  <Text className="text-sm text-slate-500">{song.artist}</Text>
                </View>
                <Pressable className="px-3 py-1 bg-primary rounded-md active:opacity-80">
                  <Text className="text-white text-sm">Add</Text>
                </Pressable>
              </View>
            ))}
          </TabsContent>
        </Tabs>
      </ScrollView>

      {/* Floating Start Practice Button */}
      <View className="absolute bottom-4 w-full max-w-md px-4">
        <Pressable
          className="flex-row items-center justify-center bg-primary rounded-xl py-4 shadow-md active:opacity-80"
          onPress={() => router.push('/sessions/active-session')}
        >
          <Play size={20} color="white" className="mr-2" />
          <Text className="text-white font-semibold text-lg">Start Practice</Text>
        </Pressable>
      </View>
    </View>
  );
}
