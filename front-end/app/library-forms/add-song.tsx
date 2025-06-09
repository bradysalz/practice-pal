import SongAddOrEdit from '@/components/forms/SongAddOrEdit';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddSongPage() {
  const router = useRouter();

  const handleSaveSong = (songData: { songName: string; songArtist: string; songGoalTempo: string }) => {
    console.log('Save Song:', songData);
    // TODO: Hook into your backend/store here
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-3xl font-bold mb-8">Add New Song</Text>
      <SongAddOrEdit onSave={handleSaveSong} />
    </SafeAreaView>
  );
}
