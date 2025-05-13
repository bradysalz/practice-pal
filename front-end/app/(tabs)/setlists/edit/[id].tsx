import { ItemRow } from '@/components/setlists/ItemRow';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { setlistsData } from '@/mock/data';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Plus, Save } from 'lucide-react-native';
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

  // useEffect(() => {
  //   setFilteredSongs(
  //     selectedArtist && selectedArtist !== 'all'
  //       ? songsData.filter((s) => s.artist === selectedArtist)
  //       : songsData
  //   );
  //   setSelectedSong('');
  // }, [selectedArtist]);

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
      pathname: '/setlists/edit/add-item',
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
          <Label className="mb-2">Setlist Name</Label>
          <TextInput
            value={setlist.name}
            onChangeText={(text) => setSetlist({ ...setlist, name: text })}
            placeholder="e.g., Warm-up Routine"
            className="border p-2 rounded bg-white mb-2"
          />
        </View>
        <View>
          <Label className="mb-2">Description</Label>
          <Textarea
            value={setlist.description}
            onChangeText={(text) => setSetlist({ ...setlist, description: text })}
            placeholder="Describe your setlist..."
            className="mb-2 rounded border border-slate-500"
          />
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold">Items ({setlist.items.length})</Text>
        <Button size="sm" variant="outline" onPress={() => handleOpenAddItemModal()}>
          <Plus size={16} />
          <Text>Add Item</Text>
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
        <Button onPress={handleSaveSetlist} disabled={!setlist.name || setlist.items.length === 0}>
          <Save size={16} className="mr-2" />
          <Text>Save Setlist</Text>
        </Button>
      </View>
    </View>
  );
}
