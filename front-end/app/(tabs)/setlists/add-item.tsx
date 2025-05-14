import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { exercisesData, songsData } from '@/mock/data';
import { useSetlistStore } from '@/stores/setlistStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

export default function AddItemScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // setlist ID from route
  const addItem = useSetlistStore((s) => s.addItem);

  const [activeTab, setActiveTab] = useState<'exercises' | 'songs'>('exercises');
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [selectedSong, setSelectedSong] = useState<string>('');

  const handleAdd = () => {
    if (activeTab === 'exercises' && selectedExercise) {
      const ex = exercisesData.find((e) => e.id === selectedExercise);
      if (ex) {
        addItem({
          id: ex.id,
          type: 'exercise',
          name: ex.name,
          tempo: ex.goalTempo,
        });
      }
    } else if (activeTab === 'songs' && selectedSong) {
      const song = songsData.find((s) => s.id === selectedSong);
      if (song) {
        addItem({
          id: song.id,
          type: 'song',
          name: song.name,
          artist: song.artist,
          tempo: song.goalTempo,
        });
      }
    }
    router.back(); // Go back to setlist screen
  };

  return (
    <View className="w-full max-w-md mx-auto justify-center p-6">
      <Text className="text-xl font-bold mb-6">Add Item to Setlist {id}</Text>

      <Tabs
        className="gap-1.5"
        value={activeTab}
        onValueChange={(v) => {
          console.log('Tab value changed to:', v);
          setActiveTab(v as 'exercises' | 'songs');
        }}
      >
        <TabsList className="flex-row">
          <TabsTrigger value="exercises" className="flex-1">
            <Text>Exercises</Text>
          </TabsTrigger>
          <TabsTrigger value="songs" className="flex-1">
            <Text> Songs</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exercises" className="mt-4">
          <Select value={selectedExercise} onValueChange={setSelectedExercise}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an exercise" />
            </SelectTrigger>
            <SelectContent>
              {exercisesData.map((ex) => (
                <SelectItem key={ex.id} value={ex.id} label={ex.name} />
              ))}
            </SelectContent>
          </Select>
        </TabsContent>

        <TabsContent value="songs" className="mt-4">
          <Select value={selectedSong} onValueChange={setSelectedSong}>
            <SelectTrigger>
              <SelectValue placeholder="Select Song" />
            </SelectTrigger>
            <SelectContent>
              {console.log('Data being mapped for Select:', songsData)} {/* Add this line */}
              {songsData.map((song) => (
                <SelectItem key={song.id} label={song.name} value={song.id} />
              ))}
            </SelectContent>
          </Select>
        </TabsContent>
      </Tabs>

      <Button
        className="mt-8"
        disabled={
          (activeTab === 'exercises' && !selectedExercise) ||
          (activeTab === 'songs' && !selectedSong)
        }
        onPress={handleAdd}
      >
        <Text className="text-white font-medium">Add to Setlist</Text>
      </Button>
    </View>
  );
}
