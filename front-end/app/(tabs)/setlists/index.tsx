import { SetlistCard } from '@/components/setlists/SetlistCard';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { deleteSetlist } from '@/lib/supabase/setlist';
import { useSetlistsStore } from '@/stores/setlist-store';
import { useRouter } from 'expo-router';
import { ListMusic } from 'lucide-react-native';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SetlistsPage() {
  const router = useRouter();
  const setlistDetailMap = useSetlistsStore((state) => state.setlistDetailMap);
  const fetchSetlists = useSetlistsStore((state) => state.fetchSetlists);

  const handleFabPress = () => {
    router.push(`/setlists/edit/new`);
  };

  const handleEditSetlist = (id: string) => {
    router.push(`/setlists/edit/${id}`);
  };

  const handleDeleteSetlist = (id: string) => {
    const setlistName = setlistDetailMap[id]?.name;
    Alert.alert('Delete', `Are you sure you want to delete setlist ${setlistName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteSetlist(id);
          await fetchSetlists();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1  items-center">
      <ScrollView className="w-full max-w-md px-4 mt-2 space-y-4 mb-24">
        {Object.keys(setlistDetailMap).length > 0 ? (
          Object.entries(setlistDetailMap).map(([id, setlist]) => (
            <SetlistCard
              key={id}
              setlist={setlist}
              onEdit={handleEditSetlist}
              onDelete={handleDeleteSetlist}
            />
          ))
        ) : (
          <View className="items-center py-16">
            <ListMusic size={48} className="text-gray-400 mb-4" />
            <Text className="text-lg font-medium mb-2">No setlists yet</Text>
            <Text className="text-sm text-gray-500 mb-4">
              Create your first setlist to organize your practice routines!
            </Text>
          </View>
        )}
      </ScrollView>
      <FloatingActionButton onPress={handleFabPress} />
    </SafeAreaView>
  );
}
