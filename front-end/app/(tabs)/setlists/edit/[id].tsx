import { ThemedIcon } from '@/components/icons/themed-icon';
import { ItemRow } from '@/components/setlists/ItemRow';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createDraftFromSetlist, createNewDraft } from '@/lib/utils/draft-setlist';
import { useDraftSetlistsStore } from '@/stores/draft-setlist-store';
import { useSetlistsStore } from '@/stores/setlist-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useEffect } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
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
  const { updateSetlist, insertSetlist } = useSetlistsStore();

  const {
    draftSetlist,
    setDraftSetlist,
    clearDraftSetlist,
    removeItemFromDraft,
    reorderDraftItems,
  } = useDraftSetlistsStore();

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
  }, [setlistId, setlistDetailMap]);

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
        await insertSetlist(draftSetlist);
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
      Alert.alert(
        'Error',
        'Failed to save setlist. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  if (!draftSetlist) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500">Loading setlist...</Text>
        <Button
          variant="outline"
          onPress={() => router.push('/setlists')}
          className="mt-4"
        >
          <Text>Go Back to Setlists</Text>
        </Button>
      </View>
    );
  }

  const renderItem = ({ item, getIndex, drag, isActive }: RenderItemParams<any>) => {
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
    <View className="flex-1 bg-slate-50 p-4">
      <View className="space-y-3 mb-6">
        <View>
          <Label className="text-2xl mb-2">Setlist Name</Label>
          <TextInput
            value={draftSetlist.name || ''}
            onChangeText={(text) => setDraftSetlist({ ...draftSetlist, name: text })}
            placeholder="e.g., Warm-up Routine"
            className="border border-slate-300 p-2 rounded-xl bg-white mb-4"
          />
        </View>
        <View>
          <Label className="text-2xl mb-2">Description</Label>
          <Textarea
            value={draftSetlist.description || ''}
            onChangeText={(text) => setDraftSetlist({ ...draftSetlist, description: text })}
            placeholder="Describe your setlist..."
            className="mb-2 border border-slate-300 rounded-xl"
          />
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-semibold">Items</Text>
        <Button size="sm" variant="outline" onPress={handleOpenAddItemModal}>
          <View className="flex-row items-center justify-center px-2 py-2 ">
            <Plus size={16} className="mr-1" />
            <Text className="font-medium">Add Item</Text>
          </View>
        </Button>
      </View>

      <View style={{ flex: 1 }}>
        <DraggableFlatList
          data={draftSetlist.items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => reorderDraftItems(data)}
        />
      </View>

      <View className="mt-4">
        <Button
          variant="default"
          onPress={handleSaveSetlist}
          disabled={!draftSetlist.name}
        >
          <View className="flex-row items-center gap-1 justify-center px-2 py-2 ">
            <ThemedIcon
              name="Save"
              size={24}
              color="white"
              className="text-white"
            />
            <Text className="text-2xl text-white font-medium">Save Setlist</Text>
          </View>
        </Button>
      </View>
    </View>
  );
}
