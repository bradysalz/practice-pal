import BookAddOrEdit from '@/app/components/forms/BookAddOrEdit';
import SongAddOrEdit from '@/app/components/forms/SongAddOrEdit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'expo-router';
import { BookOpen, Music } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddItemPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('books');

  const handleSaveBook = (bookData: { bookName: string; bookAuthor: string; bookSections: string }) => {
    console.log('Save Book:', bookData);
    // TODO: Hook into your backend/store here
    router.back();
  };

  const handleSaveSong = (songData: { songName: string; songArtist: string; songGoalTempo: string }) => {
    console.log('Save Song:', songData);
    // TODO: Hook into your backend/store here
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">Add New Item</Text>
        <Pressable onPress={() => router.back()}>
          <Text className="text-primary">Cancel</Text>
        </Pressable>
      </View>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-row space-x-2 mb-4">
          <TabsTrigger
            value="books"
            className="flex-1 flex-row items-center justify-center space-x-1"
          >
            <BookOpen size={16} />
            <Text>Book</Text>
          </TabsTrigger>
          <TabsTrigger
            value="songs"
            className="flex-1 flex-row items-center justify-center space-x-1"
          >
            <Music size={16} />
            <Text>Song</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="books">
          <BookAddOrEdit onSave={handleSaveBook} />
        </TabsContent>

        <TabsContent value="songs">
          <SongAddOrEdit onSave={handleSaveSong} />
        </TabsContent>
      </Tabs>
    </SafeAreaView>
  );
}
