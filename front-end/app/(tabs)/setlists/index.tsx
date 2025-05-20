import { SetlistCard } from '@/components/setlists/SetlistCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSetlistsStore } from '@/stores/setlist-store';
import { useRouter } from 'expo-router';
import { ListMusic, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';

export default function SetlistsPage() {
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSetlistData, setNewSetlistData] = useState({ name: '', description: '' });

  const fetchSetlists = useSetlistsStore((state) => state.fetchSetlists);

  useEffect(() => {
    fetchSetlists();
  }, [fetchSetlists]);

  const setlistDetailMap = useSetlistsStore((state) => state.setlistDetailMap);
  console.log(setlistDetailMap);

  const handleCreateSetlist = () => {
    const newSetlist = {
      id: `sl23`,
      name: newSetlistData.name,
      description: newSetlistData.description,
      items: [],
      lastPracticed: 'Never',
    };
    setNewSetlistData({ name: '', description: '' });
    setIsCreateDialogOpen(false);
    router.push(`/setlists/edit/${newSetlist.id}`);
  };

  const handleEditSetlist = (id: string) => {
    router.push(`/setlists/edit/${id}`);
  };

  const handleDeleteSetlist = (id: string) => {
    Alert.alert('Delete', `Are you sure you want to delete setlist ${id}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        // onPress: () => setSetlists(setlists.filter((s) => s.id !== id)),
      },
    ]);
  };

  return (
    <View className="flex-1 bg-slate-100 p-4">
      <ScrollView className="space-y-4">
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
              Create your first setlist to organize your practice routine
            </Text>
            <Button onPress={() => setIsCreateDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              <Text>Create Setlist</Text>
            </Button>
          </View>
        )}
      </ScrollView>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Setlist</DialogTitle>
          </DialogHeader>
          <View className="space-y-4">
            <View>
              <Label>Setlist Name</Label>
              <TextInput
                value={newSetlistData.name}
                onChangeText={(text) => setNewSetlistData((prev) => ({ ...prev, name: text }))}
                placeholder="e.g., Warm-up Routine"
                className="border rounded px-3 py-2 mt-1 bg-white"
              />
            </View>
            <View>
              <Label>Description (Optional)</Label>
              <Textarea
                value={newSetlistData.description}
                onChangeText={(text) =>
                  setNewSetlistData((prev) => ({ ...prev, description: text }))
                }
                placeholder="Describe your setlist..."
              />
            </View>
          </View>
          <DialogFooter>
            <Button disabled={!newSetlistData.name} onPress={handleCreateSetlist}>
              <Text>Create & Edit</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
}
