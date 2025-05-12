import { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Plus, Save } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { setlistsData, exercisesData, songsData } from "@/mock/data";
import { ItemRow } from "@/components/setlists/ItemRow";

export default function EditSetlistPage() {
    const { id } = useLocalSearchParams();

    const router = useRouter();


    const [setlist, setSetlist] = useState<any>(null);
    const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("exercises");
    const [selectedArtist, setSelectedArtist] = useState<string | "">("");
    const [filteredSongs, setFilteredSongs] = useState(songsData);
    const [selectedExercise, setSelectedExercise] = useState<string>("");
    const [selectedSong, setSelectedSong] = useState<string>("");

    const artists = Array.from(new Set(songsData.map((s) => s.artist))).filter(Boolean) as string[];

    useEffect(() => {
        const data = setlistsData.find((s) => s.id === id);

        setSetlist(
            data || { id: id, name: "", description: "", items: [], lastPracticed: "Never" }
        );
    }, [id]);

    useEffect(() => {
        setFilteredSongs(
            selectedArtist && selectedArtist !== "all"
                ? songsData.filter((s) => s.artist === selectedArtist)
                : songsData
        );
        setSelectedSong("");
    }, [selectedArtist]);

    const handleAddItem = () => {
        if (!setlist) return;

        if (activeTab === "exercises" && selectedExercise) {
            const ex = exercisesData.find((e) => e.id === selectedExercise);
            if (ex) {
                setSetlist({ ...setlist, items: [...setlist.items, { ...ex, tempo: ex.goalTempo }] });
            }
        } else if (activeTab === "songs" && selectedSong) {
            const song = songsData.find((s) => s.id === selectedSong);
            if (song) {
                setSetlist({ ...setlist, items: [...setlist.items, { ...song, tempo: song.goalTempo }] });
            }
        }

        setIsAddItemDialogOpen(false);
        setSelectedExercise("");
        setSelectedSong("");
    };

    const handleMoveItem = (index: number, direction: "up" | "down") => {
        if (!setlist) return;
        const items = [...setlist.items];
        const target = direction === "up" ? index - 1 : index + 1;
        if (target < 0 || target >= items.length) return;

        [items[index], items[target]] = [items[target], items[index]];
        setSetlist({ ...setlist, items });
    };

    const handleRemoveItem = (index: number) => {
        const items = [...setlist.items];
        items.splice(index, 1);
        setSetlist({ ...setlist, items });
    };

    const handleSaveSetlist = () => {
        Alert.alert("Save", "Setlist saved!");
        router.push("/setlists");
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
                <Button size="sm" variant="outline" onPress={() => setIsAddItemDialogOpen(true)}>
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
                        onMoveUp={(i) => handleMoveItem(i, "up")}
                        onMoveDown={(i) => handleMoveItem(i, "down")}
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

            {/* Placeholder Dialog */}
            <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Item</DialogTitle>
                    </DialogHeader>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="exercises">Exercises</TabsTrigger>
                            <TabsTrigger value="songs">Songs</TabsTrigger>
                        </TabsList>
                        <TabsContent value="exercises">
                            <Select onValueChange={setSelectedExercise} value={selectedExercise}>
                                <SelectTrigger><SelectValue placeholder="Choose Exercise" /></SelectTrigger>
                                <SelectContent>
                                    {exercisesData.map((ex) => (
                                        <SelectItem key={ex.id} value={ex.id}>{ex.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </TabsContent>
                        <TabsContent value="songs">
                            <Select onValueChange={setSelectedArtist} value={selectedArtist}>
                                <SelectTrigger><SelectValue placeholder="Filter by Artist" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {artists.map((artist) => (
                                        <SelectItem key={artist} value={artist}>{artist}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={setSelectedSong} value={selectedSong}>
                                <SelectTrigger><SelectValue placeholder="Choose Song" /></SelectTrigger>
                                <SelectContent>
                                    {filteredSongs.map((song) => (
                                        <SelectItem key={song.id} value={song.id}>{song.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </TabsContent>
                    </Tabs>
                    <DialogFooter>
                        <Button onPress={handleAddItem}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </View>
    );
}
