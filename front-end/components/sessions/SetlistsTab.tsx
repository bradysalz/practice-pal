import { setlistItemToDraftSessionItem } from '@/lib/utils/draft-session';
import { useDraftSessionsStore } from '@/stores/draft-sessions-store';
import { useSetlistsStore } from '@/stores/setlist-store';
import { useEffect } from 'react';
import { View } from 'react-native';
import { ListItemCard } from '../shared/ListItemCard';

interface SetlistsTabProps {
  searchQuery: string;
}

export function SetlistsTab({ searchQuery }: SetlistsTabProps) {
  const { draftSession, addItemToDraft, removeItemFromDraft } = useDraftSessionsStore();
  const { setlistDetailMap, fetchSetlists } = useSetlistsStore();

  useEffect(() => {
    fetchSetlists();
  }, [fetchSetlists]);

  const handleAddSetlist = (setlistId: string) => {
    if (!draftSession) return;

    const setlist = setlistDetailMap[setlistId];
    if (!setlist) return;

    const { isAdded } = getSetlistStatus(setlistId);

    // If all items are already added, don't do anything
    if (isAdded) return;

    // Convert setlist items to draft session items
    const newItems = setlist.setlist_items.map((item) => {
      return setlistItemToDraftSessionItem(item);
    }).filter(item => item !== null);

    // Only add items that aren't already in the session
    newItems.forEach((item) => {
      if (!item) return;

      const isItemAlreadyInSession = draftSession.items.some(
        (existingItem) =>
          (item.type === 'song' && existingItem.type === 'song' && existingItem.song?.id === item.song?.id) ||
          (item.type === 'exercise' && existingItem.type === 'exercise' && existingItem.exercise?.id === item.exercise?.id)
      );

      if (!isItemAlreadyInSession) {
        addItemToDraft(item);
      }
    });
  };

  const handleRemoveSetlist = (setlistId: string) => {
    if (!draftSession) return;

    const setlist = setlistDetailMap[setlistId];
    if (!setlist) return;

    // Find all items from this setlist that are in the session and remove them
    setlist.setlist_items.forEach((setlistItem) => {
      const itemToRemove = draftSession.items.find(
        (item) =>
          (setlistItem.type === 'song' && item.type === 'song' && item.song?.id === setlistItem.song?.id) ||
          (setlistItem.type === 'exercise' && item.type === 'exercise' && item.exercise?.id === setlistItem.exercise?.id)
      );
      if (itemToRemove) {
        removeItemFromDraft(itemToRemove.id);
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
          (item.type === 'song' && draftItem.type === 'song' && draftItem.song?.id === item.song?.id) ||
          (item.type === 'exercise' && draftItem.type === 'exercise' && draftItem.exercise?.id === item.exercise?.id)
      )
    ).length;

    return {
      isAdded: addedItems === totalItems,
      totalItems,
      addedItems,
    };
  };

  if (!draftSession) return null;

  const filteredSetlists = Object.entries(setlistDetailMap).filter(([_, setlist]) => {
    const query = searchQuery.toLowerCase();
    return (
      setlist.name?.toLowerCase().includes(query) ||
      setlist.description?.toLowerCase().includes(query)
    );
  });

  return (
    <View className="gap-y-4 mt-4">
      {filteredSetlists.map(([id, setlist]) => {
        const { isAdded, totalItems, addedItems } = getSetlistStatus(id);

        return (
          <ListItemCard
            key={id}
            title={setlist.name || 'Untitled Setlist'}
            description={setlist.description || undefined}
            stats={`${addedItems}/${totalItems} items added`}
            isAdded={isAdded}
            onAdd={() => handleAddSetlist(id)}
            onRemove={() => handleRemoveSetlist(id)}
          />
        );
      })}
    </View>
  );
}
