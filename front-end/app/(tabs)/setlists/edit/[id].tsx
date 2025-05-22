import { ThemedIcon } from '@/components/icons/themed-icon';
import { ItemRow } from '@/components/setlists/ItemRow';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSetlistsStore } from '@/stores/setlist-store';
import { SetlistWithItems } from '@/types/setlist';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

export default function EditSetlistPage() {
  const { id } = useLocalSearchParams();
  const setlistId = id as string;
  const router = useRouter();

  // Get setlist from store
  const setlistDetailMap = useSetlistsStore((state) => state.setlistDetailMap);
  const draftSetlist = useSetlistsStore((state) => state.draftSetlist);
  const syncDraftSetlist = useSetlistsStore((state) => state.syncDraftSetlist);
  const updateSetlist = useSetlistsStore((state) => state.updateSetlist);

  const [localSetlist, setLocalSetlist] = useState<SetlistWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize local state once on mount
  useEffect(() => {
    if (setlistId === 'new') {
      if (!draftSetlist) {
        setError('No draft setlist found');
      } else {
        setLocalSetlist({
          id: 'new',
          name: draftSetlist.name ?? '',
          description: draftSetlist.description ?? '',
          created_by: draftSetlist.created_by,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          setlist_items: [],
          song_count: 0,
          exercise_count: 0,
        });
      }
    } else {
      const storeSetlist = setlistDetailMap[setlistId];
      if (storeSetlist) {
        setLocalSetlist(storeSetlist);
      } else {
        setError(`Setlist with ID ${setlistId} not found.`);
      }
    }
    setIsLoading(false);
  }, [setlistId, setlistDetailMap, draftSetlist]);

  const handleOpenAddItemModal = () => {
    if (!localSetlist) return;
    router.push({
      pathname: '/setlists/add-item',
      params: { setlistId: localSetlist.id },
    });
  };

  const handleRemoveItem = (index: number) => {
    if (!localSetlist) return;

    const items = [...localSetlist.setlist_items];
    items.splice(index, 1);
    setLocalSetlist({ ...localSetlist, setlist_items: items });
  };

  const handleSaveSetlist = async () => {
    if (!localSetlist) return;

    try {
      if (setlistId === 'new') {
        await syncDraftSetlist('new');
      } else {
        await updateSetlist(localSetlist);
      }
      Alert.alert('Success', 'Setlist saved successfully!');
      router.push('/setlists');
    } catch (err) {
      Alert.alert('Error', 'Failed to save setlist. Please try again.');
      console.log(err);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading setlist...</Text>
      </View>
    );
  }

  if (error || !localSetlist) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500">{error || 'Setlist not found'}</Text>
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
            value={localSetlist.name || ''}
            onChangeText={(text) => setLocalSetlist({ ...localSetlist, name: text })}
            placeholder="e.g., Warm-up Routine"
            className="border border-slate-300 p-2 rounded-xl bg-white mb-4"
          />
        </View>
        <View>
          <Label className="text-2xl mb-2">Description</Label>
          <Textarea
            value={localSetlist.description || ''}
            onChangeText={(text) => setLocalSetlist({ ...localSetlist, description: text })}
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
          data={localSetlist.setlist_items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => setLocalSetlist({ ...localSetlist, setlist_items: data })}
        />
      </View>

      <View className="mt-4">
        <Button
          variant="default"
          onPress={handleSaveSetlist}
          disabled={!localSetlist.name || localSetlist.setlist_items.length === 0}
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
