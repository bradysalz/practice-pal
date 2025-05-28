import { BooksTab } from '@/components/sessions/BooksTab';
import { SetlistsTab } from '@/components/sessions/SetlistsTab';
import { SongsTab } from '@/components/sessions/SongsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddItemToSessionScreen() {
  const [activeTab, setActiveTab] = useState<string>('setlists');
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  const handleResetSearch = () => {
    setSearchQuery('');
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-4"
        style={{ paddingTop: insets.top + 16 }}
      >
        {/* Search */}
        <TextInput
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="px-3 py-2 border border-slate-300 rounded-xl bg-white mb-6"
        />

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'setlists' | 'books' | 'songs')}
        >
          <View className="p-2 bg-slate-100">
            <TabsList className="flex-row">
              <TabsTrigger value="setlists" className="flex-1">
                <View className="flex-row items-center justify-center">
                  <Text className="text-xl">Setlists</Text>
                </View>
              </TabsTrigger>
              <TabsTrigger value="books" className="flex-1">
                <View className="flex-row items-center justify-center">
                  <Text className="text-xl">Books</Text>
                </View>
              </TabsTrigger>
              <TabsTrigger value="songs" className="flex-1">
                <View className="flex-row items-center justify-center">
                  <Text className="text-xl">Songs</Text>
                </View>
              </TabsTrigger>
            </TabsList>
          </View>

          <TabsContent value="setlists">
            <SetlistsTab searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="books">
            <BooksTab searchQuery={searchQuery} onNavigate={handleResetSearch} />
          </TabsContent>

          <TabsContent value="songs">
            <SongsTab searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </ScrollView>

      {/* Done Button */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200"
        style={{ paddingBottom: insets.bottom }}
      >
        <Pressable
          className="mx-4 my-4 flex-row items-center justify-center bg-primary rounded-xl py-4 shadow-md active:opacity-80"
          onPress={() => router.back()}
        >
          <Check size={20} color="white" className="mr-2" />
          <Text className="text-white font-semibold text-lg">Done</Text>
        </Pressable>
      </View>
    </View>
  );
}
