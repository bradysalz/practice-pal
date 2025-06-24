import { TextInputWithLabel } from '@/components/forms/TextInputWithLabel';
import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { ItemRow } from '@/components/setlists/ItemRow';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useDraftSetlistsStore } from '@/stores/draft-setlist-store';
import { useSetlistsStore } from '@/stores/setlist-store';
import { DraftSetlistItem } from '@/types/setlist';
import { createDraftFromSetlist, createNewDraft } from '@/utils/draft-setlist';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Pressable, View } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

export default function EditSetlistPage() {
  const { id } = useLocalSearchParams();
  const setlistId = id as string;
  const router = useRouter();

  // Get stores
  const setlistDetailMap = useSetlistsStore((state) => state.setlistDetailMap);
  const { updateSetlist, addSetlist } = useSetlistsStore();

  const draftSetlist = useDraftSetlistsStore((state) => state.draftSetlist);
  const { setDraftSetlist, clearDraftSetlist, removeItemFromDraft, reorderDraftItems } =
    useDraftSetlistsStore();

  // Initialize draft on mount
  useEffect(() => {
    clearDraftSetlist();

    if (setlistId === 'new') {
      setDraftSetlist(createNewDraft());
    } else {
      const existingSetlist = setlistDetailMap[setlistId];
      if (existingSetlist) {
        setDraftSetlist(createDraftFromSetlist(existingSetlist));
      }
    }
  }, [setlistId, setlistDetailMap, clearDraftSetlist, setDraftSetlist]);

  const handleOpenAddItemModal = () => {
    if (!draftSetlist) return;
    router.push({
      pathname: '/setlists/add-item',
      params: { setlistId: draftSetlist.id },
    });
  };

  const handleRemoveItem = (index: number) => {
    if (!draftSetlist) return;
    const item = draftSetlist.items[index];
    removeItemFromDraft(item.id);
  };

  const handleSaveSetlist = async () => {
    if (!draftSetlist) return;

    try {
      if (setlistId === 'new') {
        await addSetlist(draftSetlist);
      } else {
        const existingSetlist = setlistDetailMap[setlistId];
        if (!existingSetlist) {
          throw new Error('Setlist not found');
        }
        await updateSetlist({
          ...draftSetlist,
          id: existingSetlist.id,
        });
      }

      // Clear the draft and navigate back
      clearDraftSetlist();
      router.push('/setlists');
    } catch (error) {
      console.error('Failed to save setlist:', error);
      Alert.alert('Error', 'Failed to save setlist. Please try again.', [{ text: 'OK' }]);
    }
  };

  if (!draftSetlist) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500">Loading setlist...</Text>
        <Button variant="outline" onPress={() => router.push('/setlists')} className="mt-4">
          <Text>Go Back to Setlists</Text>
        </Button>
      </View>
    );
  }

  const renderItem = ({ item, getIndex, drag, isActive }: RenderItemParams<DraftSetlistItem>) => {
    const index = getIndex() ?? 0;

    return (
      <ScaleDecorator>
        <ItemRow
          item={item}
          index={index}
          onRemove={() => handleRemoveItem(index)}
          drag={drag}
          isActive={isActive}
        />
      </ScaleDecorator>
    );
  };

  return (
    <View className="flex-1 px-4">
      <View className="flex-1 mb-20">
        <DraggableFlatList
          data={draftSetlist.items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => reorderDraftItems(data)}
          ListHeaderComponent={
            <View className="pt-4 pb-6 gap-y-4">
              <TextInputWithLabel
                label="Setlist Name"
                value={draftSetlist.name || ''}
                onChangeText={(text) => setDraftSetlist({ ...draftSetlist, name: text })}
                placeholder="e.g., Warm-up Routine"
              />

              <TextInputWithLabel
                label="Description"
                value={draftSetlist.description || ''}
                onChangeText={(text) => setDraftSetlist({ ...draftSetlist, description: text })}
                placeholder="e.g., Good for improving doubles technique..."
                textSize="lg"
              />
            </View>
          }
        />
      </View>

      {/* Bottom Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200">
        <View className="flex-row gap-x-4 m-4">
          {/* Add Items Button */}
          <Pressable
            className="flex-1 flex-row items-center justify-center bg-slate-100 rounded-xl py-4 active:opacity-80 gap-x-1"
            onPress={handleOpenAddItemModal}
          >
            <ThemedIcon name="Plus" size={20} color="slate-900" />
            <Text variant="body-semibold" className="text-slate-900">
              Add Item
            </Text>
          </Pressable>

          {/* Save Setlist Button */}
          <Pressable
            className="flex-1 flex-row items-center justify-center bg-primary rounded-xl py-4 shadow-md active:opacity-80 gap-x-1"
            onPress={handleSaveSetlist}
            disabled={!draftSetlist.name}
          >
            <ThemedIcon name="Save" size={20} color="white" />
            <Text variant="body-semibold" className="text-white">
              Save
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
