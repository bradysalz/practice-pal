import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { Plus, ListMusic } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SetlistCard } from '@/components/setlists/SetlistCard';

const setlistsData = [
  {
    id: 'sl1',
    name: 'Warm-up Routine',
    description: 'A complete warm-up routine with essential rudiments',
    items: [
      { id: 'ex1', type: 'exercise', name: 'Single Stroke Roll', tempo: 120 },
      { id: 'ex3', type: 'exercise', name: 'Double Stroke Roll', tempo: 90 },
      { id: 'ex4', type: 'exercise', name: 'Paradiddles', tempo: 110 },
    ],
    lastPracticed: '2 days ago',
  },
  {
    id: 'sl2',
    name: 'Rock Classics',
    description: 'Classic rock songs for practice',
    items: [
      { id: 's1', type: 'song', name: 'Back in Black', artist: 'AC/DC', tempo: 96 },
      { id: 's2', type: 'song', name: 'Smells Like Teen Spirit', artist: 'Nirvana', tempo: 116 },
      { id: 's3', type: 'song', name: 'Enter Sandman', artist: 'Metallica', tempo: 123 },
    ],
    lastPracticed: '1 week ago',
  },
  {
    id: 'sl3',
    name: 'Coordination Workout',
    description: 'Exercises focused on improving coordination',
    items: [
      { id: 'ex4', type: 'exercise', name: 'Paradiddles', tempo: 110 },
      { id: 'ex7', type: 'exercise', name: 'Independence Exercise 1', tempo: 95 },
      { id: 'ex8', type: 'exercise', name: 'Independence Exercise 2', tempo: 90 },
    ],
    lastPracticed: 'Yesterday',
  },
];

export default function SetlistsPage() {
  const router = useRouter();
  const [setlists, setSetlists] = useState(setlistsData);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSetlistData, setNewSetlistData] = useState({ name: '', description: '' });

  const handleCreateSetlist = () => {
    const newSetlist = {
      id: `sl${setlists.length + 1}`,
      name: newSetlistData.name,
      description: newSetlistData.description,
      items: [],
      lastPracticed: 'Never',
    };
    setSetlists([...setlists, newSetlist]);
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
        onPress: () => setSetlists(setlists.filter((s) => s.id !== id)),
      },
    ]);
  };

  return (
    <View className="flex-1 bg-slate-100 p-4">
      <ScrollView className="space-y-4">
        {setlists.length > 0 ? (
          setlists.map((setlist) => (
            <SetlistCard
              key={setlist.id}
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
