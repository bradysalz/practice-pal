import { AddRemoveButton } from '@/components/shared/AddRemoveButton';
import { bookData } from '@/mock/data';
import { useSetlistsStore } from '@/stores/setlist-store';
import { Book, Exercise, Section } from '@/types/library';
import { InputLocalSetlist } from '@/types/setlist';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export function BooksTab() {
  const { setlistId } = useLocalSearchParams<{ setlistId: string }>();
  const [viewMode, setViewMode] = useState<'list' | 'book' | 'section'>('list');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const { setlistDetailMap, setDraftSetlist } = useSetlistsStore();

  const handleToggleExercise = (exercise: Exercise) => {
    if (!setlistId || !selectedSection || !selectedBook) return;
    console.log('made it this far');
    const setlist = setlistDetailMap[setlistId];
    if (!setlist) return;
    console.log('and here');

    const isAdded = setlist.setlist_items.some(
      (item) => item.exercise_id === exercise.id
    );

    if (isAdded) {
      // Remove the exercise
      const updatedSetlist: InputLocalSetlist = {
        name: setlist.name ?? '',
        description: setlist.description ?? '',
        created_by: setlist.created_by,
        setlistItems: setlist.setlist_items
          .filter((item) => item.exercise_id !== exercise.id)
          .map((item) => ({
            exercise_id: item.exercise_id,
            song_id: item.song_id,
            setlist_id: item.setlist_id,
            position: item.position,
            tempo: item.tempo ?? 0,
            type: item.type,
            created_by: item.created_by,
          })),
      };
      setDraftSetlist(updatedSetlist);
    } else {
      // Add the exercise
      const updatedSetlist: InputLocalSetlist = {
        name: setlist.name ?? '',
        description: setlist.description ?? '',
        created_by: setlist.created_by,
        setlistItems: [
          ...setlist.setlist_items.map((item) => ({
            exercise_id: item.exercise_id,
            song_id: item.song_id,
            setlist_id: item.setlist_id,
            position: item.position,
            tempo: item.tempo ?? 0,
            type: item.type,
            created_by: item.created_by,
          })),
          {
            exercise_id: exercise.id,
            song_id: null,
            setlist_id: setlistId,
            position: setlist.setlist_items.length,
            tempo: exercise.goalTempo || 0,
            type: 'exercise',
            created_by: 'user', // TODO: Get from auth context
          },
        ],
      };
      setDraftSetlist(updatedSetlist);
    }
  };

  if (viewMode === 'section' && selectedSection) {
    return (
      <View className="space-y-2 mt-4">
        <Pressable className="mb-2" onPress={() => setViewMode('book')}>
          <Text className="text-primary">{'< Back'}</Text>
        </Pressable>

        <Text className="text-xl font-bold">{selectedSection.name}</Text>
        {selectedSection.exercises.map((exercise) => {
          const isAdded = setlistDetailMap[setlistId]?.setlist_items.some(
            (item) => item.exercise_id === exercise.id
          );

          return (
            <View
              key={exercise.id}
              className="flex-row items-center justify-between p-3 bg-slate-100 rounded-md"
            >
              <View>
                <Text className="font-medium">{exercise.name}</Text>
                {exercise.goalTempo && (
                  <Text className="text-sm text-slate-500">Goal: {exercise.goalTempo} BPM</Text>
                )}
              </View>
              <AddRemoveButton
                isAdded={!!isAdded}
                onPress={() => handleToggleExercise(exercise)}
              />
            </View>
          );
        })}
      </View>
    );
  }

  if (viewMode === 'book' && selectedBook) {
    return (
      <View className="space-y-2 mt-4">
        <Pressable className="mb-2" onPress={() => setViewMode('list')}>
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
    );
  }

  return (
    <View className="space-y-2 mt-4">
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
    </View>
  );
}
