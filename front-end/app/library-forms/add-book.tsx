import { SectionForm } from '@/components/forms/SectionForm';
import { TextInputWithLabel } from '@/components/forms/TextInputWithLabel';
import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { insertFullBookRPC } from '@/lib/supabase/book';
import { useBooksStore } from '@/stores/book-store';
import { useSectionsStore } from '@/stores/section-store';
import { SectionFormData, SectionUploadData } from '@/types/book';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddBookPage() {
  const router = useRouter();
  const { fetchBooks } = useBooksStore();
  const { fetchSections } = useSectionsStore();
  const [bookName, setBookName] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [sections, setSections] = useState<SectionFormData[]>([
    {
      name: '',
      exerciseCount: 1,
      exerciseNaming: 'numeric',
    },
  ]);

  const getExerciseNames = (sectionData: SectionFormData): string[] => {
    const { exerciseCount, exerciseNaming, customExerciseNames } = sectionData;
    return Array.from({ length: exerciseCount }).map((_, index) => {
      switch (exerciseNaming) {
        case 'alpha':
          return 'Exercise ' + String.fromCharCode(65 + index); // Exercise A, Exercise B, Exercise C...
        case 'numeric':
          return 'Exercise ' + (index + 1).toString(); // Exercise 1, Exercise 2, Exercise 3...
        case 'custom':
          return customExerciseNames?.[index] || `Exercise ${index + 1}`;
        default:
          return `Exercise ${index + 1}`;
      }
    });
  };

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        name: '',
        exerciseCount: 1,
        exerciseNaming: 'numeric',
      },
    ]);
  };

  const handleUpdateSection = (index: number, updatedSection: SectionFormData) => {
    const newSections = [...sections];
    newSections[index] = updatedSection;
    setSections(newSections);
  };

  const handleDeleteSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSaveBook = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      // Prepare sections with client-generated exercise names
      const preparedSections: SectionUploadData[] = sections.map((section, index) => ({
        name: section.name || `Section ${index + 1}`,
        exerciseNames: getExerciseNames(section),
      }));

      // Call Supabase RPC
      await insertFullBookRPC({
        bookName: bookName,
        bookAuthor: bookAuthor,
        sections: preparedSections,
      });

      // Navigate to library
      await Promise.all([fetchBooks(), fetchSections()]);
      router.push('/library');
    } catch (error) {
      console.error('Failed to save book:', error);
      // XXX: Show error feedback to user here
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4 mr-2">
      <Text className="text-2xl font-bold mb-4">Add New Book</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 320 }} className="mr-1">
        <View className="gap-y-4">
          <TextInputWithLabel
            label="Book Name"
            value={bookName}
            onChangeText={setBookName}
            placeholder="Stick Control"
          />
          <TextInputWithLabel
            label="Author"
            value={bookAuthor}
            onChangeText={setBookAuthor}
            placeholder="George Lawrence Stone"
          />
          <View className="mb-4"></View>
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-semibold">Sections</Text>
              <Pressable
                onPress={handleAddSection}
                className="bg-slate-100 rounded-xl py-2 px-4 text-lg border border-slate-300 flex-row items-center gap-x-1.5"
              >
                <ThemedIcon name="Plus" size={16} color="slate-500" />
                <Text className="text-lg">Add Section</Text>
              </Pressable>
            </View>

            {sections.map((section, index) => (
              <SectionForm
                key={index}
                section={section}
                onUpdate={(updatedSection) => handleUpdateSection(index, updatedSection)}
                onDelete={() => handleDeleteSection(index)}
                index={index}
              />
            ))}
          </View>

          <Pressable
            onPress={handleSaveBook}
            disabled={isSaving}
            className={`rounded-xl py-3 items-center flex-row justify-center ${isSaving ? 'bg-primary/70' : 'bg-primary'}`}
          >
            {isSaving ? (
              <>
                <ActivityIndicator color="white" className="mr-2" />
                <Text className="text-white text-xl font-medium">Saving...</Text>
              </>
            ) : (
              <Text className="text-white text-xl font-medium">Save Book</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
