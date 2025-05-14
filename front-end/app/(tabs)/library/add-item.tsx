import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'expo-router';
import { BookOpen, Music } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function AddItemPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'books' | 'songs'>('books');

  // Form state for Book
  const [bookName, setBookName] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookSections, setBookSections] = useState('');

  // Form state for Song
  const [songName, setSongName] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songGoalTempo, setSongGoalTempo] = useState('');

  const handleSaveBook = () => {
    console.log('Save Book:', { bookName, bookAuthor, bookSections });
    // TODO: Hook into your backend/store here
    router.back();
  };

  const handleSaveSong = () => {
    console.log('Save Song:', { songName, songArtist, songGoalTempo });
    // TODO: Hook into your backend/store here
    router.back();
  };

  return (
    <View className="flex-1 bg-white p-4">
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
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <View className="space-y-4">
              <View>
                <Text className="mb-1 font-medium">Book Name</Text>
                <TextInput
                  value={bookName}
                  onChangeText={setBookName}
                  placeholder="e.g., Stick Control"
                  className="border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                />
              </View>
              <View>
                <Text className="mb-1 font-medium">Author</Text>
                <TextInput
                  value={bookAuthor}
                  onChangeText={setBookAuthor}
                  placeholder="e.g., George Lawrence Stone"
                  className="border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                />
              </View>
              <View>
                <Text className="mb-1 font-medium">Number of Sections</Text>
                <TextInput
                  value={bookSections}
                  onChangeText={setBookSections}
                  placeholder="e.g., 3"
                  keyboardType="numeric"
                  className="border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                />
              </View>
              <Pressable
                onPress={handleSaveBook}
                className="bg-primary rounded-lg py-3 items-center"
              >
                <Text className="text-white font-medium">Save Book</Text>
              </Pressable>
            </View>
          </ScrollView>
        </TabsContent>

        <TabsContent value="songs">
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <View className="space-y-4">
              <View>
                <Text className="mb-1 font-medium">Song Name</Text>
                <TextInput
                  value={songName}
                  onChangeText={setSongName}
                  placeholder="e.g., Uptown Funk"
                  className="border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                />
              </View>
              <View>
                <Text className="mb-1 font-medium">Artist</Text>
                <TextInput
                  value={songArtist}
                  onChangeText={setSongArtist}
                  placeholder="e.g., Bruno Mars"
                  className="border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                />
              </View>
              <View>
                <Text className="mb-1 font-medium">Goal Tempo (BPM)</Text>
                <TextInput
                  value={songGoalTempo}
                  onChangeText={setSongGoalTempo}
                  placeholder="e.g., 120"
                  keyboardType="numeric"
                  className="border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                />
              </View>
              <Pressable
                onPress={handleSaveSong}
                className="bg-primary rounded-lg py-3 items-center"
              >
                <Text className="text-white font-medium">Save Song</Text>
              </Pressable>
            </View>
          </ScrollView>
        </TabsContent>
      </Tabs>
    </View>
  );
}
