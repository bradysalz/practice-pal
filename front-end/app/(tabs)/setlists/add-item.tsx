import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exercisesData, songsData } from "@/mock/data";
import { useSetlistStore } from "@/stores/setlistStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function AddItemScreen() {
  console.log('hi')
  const router = useRouter();
  const { id } = useLocalSearchParams(); // setlist ID from route
  const addItem = useSetlistStore((s) => s.addItem);

  const [activeTab, setActiveTab] = useState<"exercises" | "songs">("exercises");
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [selectedSong, setSelectedSong] = useState<string>("");

  const artists = Array.from(new Set(songsData.map((s) => s.artist))).filter(Boolean);

  const [selectedArtist, setSelectedArtist] = useState<string | "">("");
  const filteredSongs = selectedArtist
    ? songsData.filter((s) => s.artist === selectedArtist)
    : songsData;

  const handleAdd = () => {
    if (activeTab === "exercises" && selectedExercise) {
      const ex = exercisesData.find((e) => e.id === selectedExercise);
      if (ex) {
        addItem({
          id: ex.id,
          type: "exercise",
          name: ex.name,
          tempo: ex.goalTempo,
        });
      }
    } else if (activeTab === "songs" && selectedSong) {
      const song = songsData.find((s) => s.id === selectedSong);
      if (song) {
        addItem({
          id: song.id,
          type: "song",
          name: song.name,
          artist: song.artist,
          tempo: song.goalTempo,
        });
      }
    }
    console.log('there')
    router.back(); // Go back to setlist screen
  };

  return (
    <View className='flex-1 justify-center p-6'>
      <Text className="text-xl font-bold mb-6">Add Item to Setlist {id}</Text>

      <Tabs className='w-full max-w-[400px] mx-auto flex-col gap-1.5' value={activeTab} onValueChange={(v) => setActiveTab(v as "exercises" | "songs")}>
        <TabsList className="flex-row w-full">
          <TabsTrigger
            value="exercises"
            className="flex-1"
          >
            <Text>Exercises</Text>
          </TabsTrigger>
          <TabsTrigger
            value="songs"
            className="flex-1 text-center py-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-500 transition-colors"
          >
            <Text> Songs </Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exercises" className="mt-4">
          <Select value={selectedExercise} onValueChange={setSelectedExercise}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an exercise" />
            </SelectTrigger>
            <SelectContent>
              {exercisesData.map((ex) => (
                <SelectItem key={ex.id} value={ex.id}>
                  {ex.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TabsContent>

        <TabsContent value="songs" className="mt-4">
          <Select value={selectedArtist} onValueChange={setSelectedArtist}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Artist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              {artists.map((artist) => (
                <SelectItem key={artist} value={artist}>
                  {artist}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSong} onValueChange={setSelectedSong}>
            <SelectTrigger>
              <SelectValue placeholder="Select Song" />
            </SelectTrigger>
            <SelectContent>
              {filteredSongs.map((song) => (
                <SelectItem key={song.id} value={song.id}>
                  {song.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TabsContent>
      </Tabs>

      <Button
        className="mt-8"
        disabled={
          (activeTab === "exercises" && !selectedExercise) ||
          (activeTab === "songs" && !selectedSong)
        }
        onPress={handleAdd}
      >
        Add to Setlist
      </Button>
    </View >
  );
}
