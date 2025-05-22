import { AddRemoveButton } from '@/components/shared/AddRemoveButton';
import { useSessionsStore } from '@/stores/session-store';
import { useSetlistsStore } from '@/stores/setlist-store';
import { InputLocalSessionItem, LocalExerciseDetails } from '@/types/session';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export function SetlistsTab() {
  const { currentSession, updateLocalSession } = useSessionsStore();
  const { setlistDetailMap, fetchSetlists } = useSetlistsStore();

  useEffect(() => {
    fetchSetlists();
  }, [fetchSetlists]);

  const handleAddSetlist = (setlistId: string) => {
    if (!currentSession) return;

    const setlist = setlistDetailMap[setlistId];
    if (!setlist) return;

    // Convert setlist items to session items
    const newItems = setlist.setlist_items.map((item): InputLocalSessionItem | null => {
      if (item.song) {
        return {
          song_id: item.song_id,
          exercise_id: null,
          notes: null,
          tempo: item.tempo ?? null,
        };
      } else if (item.exercise && item.exercise.section?.book) {
        const exerciseDetails: LocalExerciseDetails = {
          id: item.exercise.id,
          name: item.exercise.name ?? '',
          section: {
            id: Number(item.exercise.section.id),
            name: item.exercise.section.name ?? '',
            book: {
              id: item.exercise.section.book.id,
              name: item.exercise.section.book.name ?? '',
              author: item.exercise.section.book.cover_color ?? '', // Using cover_color as author since that's what we have
            },
          },
        };

        return {
          exercise_id: item.exercise_id,
          song_id: null,
          notes: null,
          tempo: item.tempo ?? null,
          exercise: exerciseDetails,
        };
      }
      return null;
    }).filter((item): item is InputLocalSessionItem => item !== null);

    // Filter out any items that are already in the session
    const itemsToAdd = newItems.filter((newItem) => {
      return !currentSession.session_items.some(
        (existingItem) =>
          (newItem.song_id && existingItem.song_id === newItem.song_id) ||
          (newItem.exercise_id && existingItem.exercise_id === newItem.exercise_id)
      );
    });

    if (itemsToAdd.length === 0) return;

    updateLocalSession({
      session_items: [...currentSession.session_items, ...itemsToAdd],
    });
  };

  const getSetlistStatus = (setlistId: string) => {
    const setlist = setlistDetailMap[setlistId];
    if (!setlist) return { isAdded: false, totalItems: 0, addedItems: 0 };

    const totalItems = setlist.setlist_items.length;

    if (!currentSession?.session_items) {
      return { isAdded: false, totalItems, addedItems: 0 };
    }

    const addedItems = setlist.setlist_items.filter((item) =>
      currentSession.session_items.some(
        (sessionItem) =>
          (item.song_id && sessionItem.song_id === item.song_id) ||
          (item.exercise_id && sessionItem.exercise_id === item.exercise_id)
      )
    ).length;

    return {
      isAdded: addedItems === totalItems,
      totalItems,
      addedItems,
    };
  };

  return (
    <View className="space-y-2 mt-4">
      {Object.entries(setlistDetailMap).map(([id, setlist]) => {
        const { isAdded, totalItems, addedItems } = getSetlistStatus(id);

        return (
          <View
            key={id}
            className="flex-row items-center justify-between p-4 bg-slate-100 rounded-md"
          >
            <View className="flex-1 mr-4">
              <Text className="font-medium">{setlist.name}</Text>
              <Text className="text-sm text-slate-500">{setlist.description}</Text>
              <Text className="text-xs text-slate-400 mt-1">
                {addedItems}/{totalItems} items added
              </Text>
            </View>
            <AddRemoveButton
              isAdded={isAdded}
              onPress={() => handleAddSetlist(id)}
            />
          </View>
        );
      })}
    </View>
  );
}
