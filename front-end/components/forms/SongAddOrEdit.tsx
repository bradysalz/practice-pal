import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

interface SongAddOrEditProps {
  onSave: (songData: { songName: string; songArtist: string; songGoalTempo: string }) => void;
  initialData?: {
    songName: string;
    songArtist: string;
    songGoalTempo: string;
  };
}

export default function SongAddOrEdit({ onSave, initialData }: SongAddOrEditProps) {
  const [songName, setSongName] = useState(initialData?.songName ?? '');
  const [songArtist, setSongArtist] = useState(initialData?.songArtist ?? '');
  const [songGoalTempo, setSongGoalTempo] = useState(initialData?.songGoalTempo ?? '');

  const handleSave = () => {
    onSave({ songName, songArtist, songGoalTempo });
  };

  return (
    <ScrollView>
      <View className="gap-y-4">
        <View>
          <Text className="mb-1 font-medium">Song Name</Text>
          <TextInput
            value={songName}
            onChangeText={setSongName}
            placeholder="e.g., Uptown Funk"
            className="border border-slate-300 rounded-xl px-3 py-2 bg-slate-50"
          />
        </View>
        <View>
          <Text className="mb-1 font-medium">Artist</Text>
          <TextInput
            value={songArtist}
            onChangeText={setSongArtist}
            placeholder="e.g., Bruno Mars"
            className="border border-slate-300 rounded-xl px-3 py-2 bg-slate-50"
          />
        </View>
        <View>
          <Text className="mb-1 font-medium">Goal Tempo (BPM)</Text>
          <TextInput
            value={songGoalTempo}
            onChangeText={setSongGoalTempo}
            placeholder="e.g., 120"
            keyboardType="numeric"
            className="border border-slate-300 rounded-xl px-3 py-2 bg-slate-50"
          />
        </View>
        <Pressable
          onPress={handleSave}
          className="bg-primary rounded-xl py-3 items-center"
        >
          <Text className="text-white font-medium">Save Song</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
