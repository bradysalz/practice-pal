import { InputWithDelete } from '@/components/forms/InputWithDelete';
import { TextInputWithLabel } from '@/components/forms/TextInputWithLabel';
import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { Separator } from '@/components/shared/Separator';
import { Text } from '@/components/ui/text';
import { deleteBook, updateBook } from '@/lib/supabase/book';
import { deleteSections, insertSections, updateSection } from '@/lib/supabase/section';
import { useBooksStore } from '@/stores/book-store';
import { useSectionsStore } from '@/stores/section-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import { ActionButton } from '@/components/ui/action-button';
import { ScrollView } from 'react-native-gesture-handler';

export type EditableSection = {
  id?: string;
  name?: string;
};

export default function EditBookPage() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();

  const router = useRouter();

  const fetchBooks = useBooksStore((state) => state.fetchBooks);
  const books = useBooksStore((state) => state.books);
  const book = books.find((book) => book.id === bookId);

  const fetchSections = useSectionsStore((state) => state.fetchSections);
  const sections = useSectionsStore((state) => state.sections);
  const usefulSectionsFromStore = sections.filter((section) => section.book_id === bookId);

  const [bookName, setBookName] = useState(book?.name || '');
  const [bookAuthor, setBookAuthor] = useState(book?.author || '');
  const [sectionForms, setSectionForms] = useState<EditableSection[]>([]);

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSectionForms(
      usefulSectionsFromStore.map((section) => ({
        id: section.id,
        name: section.name,
      }))
    );
    // only run on page load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveBook = async () => {
    if (!hasChanges) {
      router.navigate(`/library-detail/book/${bookId}`);
      return;
    }

    setIsSaving(true);

    if (bookName !== book?.name || bookAuthor !== book?.author) {
      await updateBook(bookId, { name: bookName, author: bookAuthor });
    }

    // Handle sections - split into new and existing sections
    const sectionsToInsert = sectionForms.filter((section) => !section.id);
    const sectionsToUpdate = sectionForms.filter((section) => section.id);

    // Find sections that were deleted (exist in original sections but not in sectionForms)
    const currentSectionIds = new Set(sectionForms.map((s) => s.id).filter(Boolean));
    const deletedSectionIds = usefulSectionsFromStore
      .map((s) => s.id)
      .filter((id) => !currentSectionIds.has(id));

    await Promise.all([
      // Insert new sections
      sectionsToInsert.length > 0 && insertSections(bookId, sectionsToInsert),
      // Update existing sections
      ...sectionsToUpdate.map((section) =>
        updateSection(section.id!, { name: section.name || '' })
      ),
      // Delete removed sections
      deletedSectionIds.length > 0 && deleteSections(deletedSectionIds),
    ]);

    setIsSaving(false);
    router.navigate(`/library-detail/book/${bookId}`);
  };

  const handleDeleteBook = async () => {
    Alert.alert(
      'Delete',
      `Are you sure you want to delete the entire book, sections, and exercises?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteBook(bookId);
            await Promise.all([fetchBooks(), fetchSections()]);
            router.navigate(`/library`);
          },
        },
      ]
    );
  };

  const handleAddSection = () => {
    setHasChanges(true);
    setSectionForms([...sectionForms, { name: '' }]);
  };

  const handleUpdateSection = (index: number, section: EditableSection) => {
    setHasChanges(true);
    setSectionForms(sectionForms.map((s, i) => (i === index ? section : s)));
  };

  const handleDeleteSection = (index: number) => {
    setHasChanges(true);
    setSectionForms(sectionForms.filter((_, i) => i !== index));
  };

  if (!book) {
    return <Text>Book not found</Text>;
  }

  return (
    <View className="flex-1 bg-white p-4">
      <ScrollView contentContainerStyle={{ paddingBottom: 320 }} className="">
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
            placeholder=""
          />
          <Pressable onPress={handleDeleteBook} className="self-start">
            <View className="flex-row items-center gap-x-2 bg-red-100 rounded-xl py-2 px-4">
              <ThemedIcon name="TriangleAlert" size={24} color="red-500" />
              <Text variant="body-semibold" className="text-red-500">
                Delete Book
              </Text>
            </View>
          </Pressable>
        </View>
        <Separator color="slate" className="my-4" />

        {/* Sections */}
        <View>
          <View className="flex-row justify-between items-center mb-4">
            <Text variant="title-xl">Sections</Text>
            <Pressable
              onPress={handleAddSection}
              className="bg-slate-100 rounded-xl py-2 px-4 text-lg border border-slate-300 flex-row items-center gap-x-1.5"
            >
              <ThemedIcon name="Plus" size={16} color="slate-500" />
              <Text variant="body-semibold">Add Section</Text>
            </Pressable>
          </View>

          <View className="gap-y-4 mb-4">
            {sectionForms.map((section, index) => (
              <InputWithDelete
                key={index}
                name={section.name}
                onNameChange={(value) => handleUpdateSection(index, { ...section, name: value })}
                onDelete={() => handleDeleteSection(index)}
              />
            ))}
          </View>
        </View>

        <ActionButton
          onPress={handleSaveBook}
          disabled={isSaving}
          className={isSaving ? 'bg-primary/70' : undefined}
          textVariant="body-bold"
          text={isSaving ? 'Saving...' : 'Save Book'}
          icon={isSaving ? <ActivityIndicator color="white" /> : undefined}
        />
      </ScrollView>
    </View>
  );
}
