import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

interface BookAddOrEditProps {
  onSave: (bookData: { bookName: string; bookAuthor: string; bookSections: string }) => void;
  initialData?: {
    bookName: string;
    bookAuthor: string;
    bookSections: string;
  };
}

export default function BookAddOrEdit({ onSave, initialData }: BookAddOrEditProps) {
  const [bookName, setBookName] = useState(initialData?.bookName ?? '');
  const [bookAuthor, setBookAuthor] = useState(initialData?.bookAuthor ?? '');
  const [bookSections, setBookSections] = useState(initialData?.bookSections ?? '');

  const handleSave = () => {
    onSave({ bookName, bookAuthor, bookSections });
  };

  return (
    <ScrollView>
      <View className="gap-y-4">
        <View>
          <Text className="mb-1 font-medium">Book Name</Text>
          <TextInput
            value={bookName}
            onChangeText={setBookName}
            placeholder="e.g., Stick Control"
            className="border border-slate-300 rounded-xl px-3 py-2 bg-slate-50"
          />
        </View>
        <View>
          <Text className="mb-1 font-medium">Author</Text>
          <TextInput
            value={bookAuthor}
            onChangeText={setBookAuthor}
            placeholder="e.g., George Lawrence Stone"
            className="border border-slate-300 rounded-xl px-3 py-2 bg-slate-50"
          />
        </View>
        <View>
          <Text className="mb-1 font-medium">Number of Sections</Text>
          <TextInput
            value={bookSections}
            onChangeText={setBookSections}
            placeholder="e.g., 3"
            keyboardType="numeric"
            className="border border-slate-300 rounded-xl px-3 py-2 bg-slate-50"
          />
        </View>
        <Pressable
          onPress={handleSave}
          className="bg-primary rounded-xl py-3 items-center"
        >
          <Text className="text-white font-medium">Save Book</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
