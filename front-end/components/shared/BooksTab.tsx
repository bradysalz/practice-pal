import { useBooksStore } from '@/stores/book-store';
import { useDraftSessionsStore } from '@/stores/draft-sessions-store';
import { useDraftSetlistsStore } from '@/stores/draft-setlist-store';
import { useExercisesStore } from '@/stores/exercise-store';
import { useSectionsStore } from '@/stores/section-store';
import { BookWithCountsRow } from '@/types/book';
import { LocalExercise } from '@/types/exercise';
import { SectionWithCountsRow } from '@/types/section';
import {
  createSessionExerciseItem,
  createSetlistExerciseItem,
  filterByName,
  findSessionExerciseItemId,
  findSetlistExerciseItemId,
  isExerciseInDraft,
} from '@/utils/books-tab';
import { useEffect, useState } from 'react';
import { BackHandler, Pressable, Text, View } from 'react-native';
import { ThemedIcon } from '../icons/ThemedIcon';
import { HighlightBar } from './HighlightBar';
import { ListItemCard } from './ListItemCard';

interface BooksTabProps {
  mode: 'session' | 'setlist';
  searchQuery?: string;
  onNavigate?: () => void;
}

export function BooksTab({ mode, searchQuery = '', onNavigate }: BooksTabProps) {
  const [viewMode, setViewMode] = useState<'list' | 'book' | 'section'>('list');
  const [selectedBook, setSelectedBook] = useState<BookWithCountsRow | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionWithCountsRow | null>(null);

  // Store hooks
  const { exercisesBySectionId: exercises, fetchExercisesBySection } = useExercisesStore();
  const books = useBooksStore((state) => state.books);
  const sections = useSectionsStore((state) => state.sections);

  // Session/Setlist store hooks
  const draftSession = useDraftSessionsStore((state) => state.draftSession);
  const addSessionItem = useDraftSessionsStore((state) => state.addItemToDraft);
  const removeSessionItem = useDraftSessionsStore((state) => state.removeItemFromDraft);

  const draftSetlist = useDraftSetlistsStore((state) => state.draftSetlist);
  const addSetlistItem = useDraftSetlistsStore((state) => state.addItemToDraft);
  const removeSetlistItem = useDraftSetlistsStore((state) => state.removeItemFromDraft);

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      if (viewMode === 'section') {
        setViewMode('book');
        onNavigate?.();
        return true;
      }
      if (viewMode === 'book') {
        setViewMode('list');
        setSelectedBook(null);
        onNavigate?.();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [viewMode, onNavigate]);

  // Fetch exercises when section is selected
  useEffect(() => {
    if (selectedSection) {
      fetchExercisesBySection(selectedSection.id);
    }
  }, [selectedSection, fetchExercisesBySection]);

  const handleAddExercise = (exercise: LocalExercise) => {
    if (!selectedSection || !selectedBook) return;

    if (mode === 'session' && draftSession) {
      const item = createSessionExerciseItem(
        exercise,
        selectedSection,
        selectedBook
      );
      addSessionItem(item);
    } else if (mode === 'setlist' && draftSetlist) {
      const item = createSetlistExerciseItem(
        exercise,
        selectedSection,
        selectedBook
      );
      addSetlistItem(item);
    }
  };

  const handleRemoveExercise = (exercise: LocalExercise) => {
    if (mode === 'session' && draftSession) {
      const id = findSessionExerciseItemId(draftSession, exercise.id);
      if (id) removeSessionItem(id);
    } else if (mode === 'setlist' && draftSetlist) {
      const id = findSetlistExerciseItemId(draftSetlist, exercise.id);
      if (id) removeSetlistItem(id);
    }
  };

  const handleNavigateBack = (newMode: 'list' | 'book') => {
    setViewMode(newMode);
    if (newMode === 'list') {
      setSelectedBook(null);
    }
    if (newMode === 'book') {
      setSelectedSection(null);
    }
    onNavigate?.();
  };

  const isExerciseAdded = (exercise: LocalExercise) => {
    return isExerciseInDraft(exercise.id, mode, draftSession, draftSetlist);
  };

  if (viewMode === 'section' && selectedSection && selectedBook) {
    const sectionExercises = exercises[selectedSection.id] || [];
    const filteredExercises = filterByName(sectionExercises, searchQuery);

    return (
      <View className="gap-y-4 mt-4">
        <Pressable className="mb-2" onPress={() => handleNavigateBack('book')}>
          <Text className="text-primary">{'< Back'}</Text>
        </Pressable>

        <HighlightBar type="book" name={selectedBook.name} />
        <HighlightBar type="section" name={selectedSection.name} />
        {filteredExercises.map((exercise) => (
          <ListItemCard
            key={exercise.id}
            title={exercise.name || 'Untitled Exercise'}
            subtitle={exercise.goal_tempo ? `Goal: ${exercise.goal_tempo} BPM` : undefined}
            isAdded={isExerciseAdded(exercise)}
            onAdd={() => handleAddExercise(exercise)}
            onRemove={() => handleRemoveExercise(exercise)}
          />
        ))}
      </View>
    );
  }

  if (viewMode === 'book' && selectedBook) {
    const bookSections = sections.filter(section => section.book_id === selectedBook.id);
    const filteredSections = filterByName(bookSections, searchQuery);

    return (
      <View className="gap-y-4 mt-4">
        <Pressable className="mb-2" onPress={() => handleNavigateBack('list')}>
          <Text className="text-primary">{'< Back'}</Text>
        </Pressable>

        <HighlightBar type="book" name={selectedBook.name} />
        {filteredSections.map((section) => (
          <ListItemCard
            key={section.id}
            title={section.name || 'Untitled Section'}
            subtitle={`${section.exercise_count} exercises`}
            onPress={() => {
              setSelectedSection(section);
              setViewMode('section');
              onNavigate?.();
            }}
            isAdded={false}
            rightElement={<ThemedIcon name="ChevronRight" size={20} />}
          />
        ))}
      </View>
    );
  }

  const filteredBooks = filterByName(books, searchQuery);

  return (
    <View className="gap-y-4 mt-4">
      {filteredBooks.map((book) => (
        <ListItemCard
          key={book.id}
          title={book.name || 'Untitled Book'}
          subtitle={`${book.exercise_count} exercises`}
          onPress={() => {
            setSelectedBook(book);
            setViewMode('book');
            onNavigate?.();
          }}
          isAdded={false}
          rightElement={<ThemedIcon name="ChevronRight" size={20} />}
        />
      ))}
    </View>
  );
}
