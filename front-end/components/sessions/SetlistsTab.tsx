import { AddRemoveButton } from '@/components/shared/AddRemoveButton';
import { setlistItemToDraftSetlistItem } from '@/lib/utils/draft-setlist';
import { useDraftSessionsStore } from '@/stores/draft-sessions-store';
import { useSetlistsStore } from '@/stores/setlist-store';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export function SetlistsTab() {
  const { draftSession, addItemToDraft } = useDraftSessionsStore();
  const { setlistDetailMap, fetchSetlists } = useSetlistsStore();

  useEffect(() => {
    fetchSetlists();
  }, [fetchSetlists]);

  const handleAddSetlist = (setlistId: string) => {
    if (!draftSession) return;

    const setlist = setlistDetailMap[setlistId];
    if (!setlist) return;

    // Convert setlist items to draft session items
    const newItems = setlist.setlist_items.map((item) => {
      return setlistItemToDraftSetlistItem(item);
    })

    // Filter out any items that are already in the session
    const itemsToAdd = newItems.filter((newItem) => {
      if (!newItem) return false;
      return !draftSession.items.some(
        (existingItem) =>
          (newItem.type === 'song' && existingItem.type === 'song' && existingItem.song?.id === newItem.song?.id) ||
          (newItem.type === 'exercise' && existingItem.type === 'exercise' && existingItem.exercise?.id === newItem.exercise?.id)
      );
    });

    // Add each item individually to the draft session
    itemsToAdd.forEach((item) => {
      if (item) {
        addItemToDraft(item);
      }
    });
  };

  const getSetlistStatus = (setlistId: string) => {
    const setlist = setlistDetailMap[setlistId];
    if (!setlist || !draftSession) return { isAdded: false, totalItems: 0, addedItems: 0 };

    const totalItems = setlist.setlist_items.length;
    const addedItems = setlist.setlist_items.filter((item) =>
      draftSession.items.some(
        (draftItem) =>
          (item.song_id && draftItem.type === 'song' && draftItem.song?.id === item.song_id) ||
          (item.exercise_id && draftItem.type === 'exercise' && draftItem.exercise?.id === item.exercise_id)
      )
    ).length;

    return {
      isAdded: addedItems === totalItems,
      totalItems,
      addedItems,
    };
  };

  if (!draftSession) return null;

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
