import { BooksTab } from '@/components/setlists/BooksTab';
import { SongsTab } from '@/components/setlists/SongsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { router, useLocalSearchParams } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddItemScreen() {
  const { setlistId } = useLocalSearchParams<{ setlistId: string }>();
  const [activeTab, setActiveTab] = useState<string>('books');
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4 pt-6">
        {/* Search */}
        <TextInput
          placeholder="Search..."
          className="px-3 py-2 border border-slate-300 rounded-md bg-white mb-6"
        />

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'books' | 'songs')}
        >
          <TabsList className="flex-row space-x-2 mb-6">
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

          <TabsContent value="books">
            <BooksTab />
          </TabsContent>

          <TabsContent value="songs">
            <SongsTab />
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
