import { ItemRow } from '@/components/setlists/ItemRow';
import { ThemedIcon } from '@/components/themed-icon';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { setlistsData } from '@/mock/data';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';

export default function EditSetlistPage() {
  const { id } = useLocalSearchParams();
  const setlistId = id as string;

  const router = useRouter();

  const [setlist, setSetlist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch setlist data based on the ID
  const fetchSetlistData = useCallback(() => {
    console.log(`Fetching setlist data for ID: ${setlistId}`);
    setIsLoading(true);
    setError(null); // Clear previous errors

    // Simulate fetching data from your source (e.g., Supabase)
    // Replace this with your actual data fetching logic
    const data = setlistsData.find((s) => s.id === setlistId);

    if (data) {
      setSetlist(data);
      setIsLoading(false);
    } else {
      // Handle case where setlist is not found
      setSetlist(null);
      setError(`Setlist with ID ${setlistId} not found.`);
      setIsLoading(false);
    }
  }, [setlistId]); // Recreate this function if setlistId changes

  // useFocusEffect runs the effect when the screen is focused or re-focused
  // This is ideal for fetching data that might have changed while the screen was unfocused
  useFocusEffect(
    useCallback(() => {
      fetchSetlistData();
    }, [fetchSetlistData]) // Re-run this effect if fetchSetlistData changes (due to setlistId change)
  );

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (!setlist) return;
    const items = [...setlist.items];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;

    [items[index], items[target]] = [items[target], items[index]];
    setSetlist({ ...setlist, items });
  };

  // Function to open the Add Item modal
  const handleOpenAddItemModal = () => {
    // Navigate to the modal route
    // Pass the setlistId as a parameter so the modal knows which setlist to add to
    router.push({
      pathname: '/setlists/add-item',
      params: { setlistId: setlistId },
    });
  };

  const handleRemoveItem = (index: number) => {
    const items = [...setlist.items];
    items.splice(index, 1);
    setSetlist({ ...setlist, items });
  };

  const handleSaveSetlist = () => {
    Alert.alert('Save', 'Setlist saved!');
    router.push('/setlists');
  };

  if (!setlist) return <Text>Loading...</Text>;

  return (
    <View className="flex-1 bg-slate-50 p-4">
      <View className="space-y-3 mb-6">
        <View>
          <Label className="text-2xl mb-2">Setlist Name</Label>
          <TextInput
            value={setlist.name}
            onChangeText={(text) => setSetlist({ ...setlist, name: text })}
            placeholder="e.g., Warm-up Routine"
            className="border border-slate-300 p-2 rounded-xl bg-white mb-4"
          />
        </View>
        <View>
          <Label className="text-2xl mb-2">Description</Label>
          <Textarea
            value={setlist.description}
            onChangeText={(text) => setSetlist({ ...setlist, description: text })}
            placeholder="Describe your setlist..."
            className="mb-2 border border-slate-300 rounded-xl"
          />
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-semibold">Items ({setlist.items.length})</Text>
        <Button size="sm" variant="outline" onPress={() => handleOpenAddItemModal()}>
          <View className="flex-row items-center justify-center px-2 py-2 ">
            <Plus size={16} className="mr-1" />
            <Text className="font-medium">Add Item</Text>
          </View>
        </Button>
      </View>

      <ScrollView className="space-y-3">
        {setlist.items.map((item, index) => (
          <ItemRow
            key={`${item.id}-${index}`}
            item={item}
            index={index}
            total={setlist.items.length}
            onMoveUp={(i) => handleMoveItem(i, 'up')}
            onMoveDown={(i) => handleMoveItem(i, 'down')}
            onRemove={handleRemoveItem}
          />
        ))}
      </ScrollView>

      <View className="mt-4">
        <Button
          variant="default"
          onPress={handleSaveSetlist}
          disabled={!setlist.name || setlist.items.length === 0}
        >
          <View className="flex-row items-center gap-1 justify-center px-2 py-2 ">
            <ThemedIcon
              name="Save"
              size={24}
              color="white" // Used on mobile for color
              className="text-white" // Used on web for both color (text-white) and margin (mr-1)
            />
            <Text className="text-2xl text-white font-medium">Save Setlist</Text>
          </View>
        </Button>
      </View>
    </View>
  );
}
