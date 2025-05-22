import { CurrentSessionItems } from '@/components/sessions/CurrentSessionItems';
import { useSessionsStore } from '@/stores/session-store';
import { InputLocalSessionItem } from '@/types/session';
import { router } from 'expo-router';
import { Play, Plus } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MakeSessionPage() {
  const { currentSession, initializeLocalSession, updateLocalSession } = useSessionsStore();
  const insets = useSafeAreaInsets();

  // Initialize session if not exists
  useEffect(() => {
    if (!currentSession) {
      initializeLocalSession({
        notes: '',
        duration: 0,
        session_items: [],
      });
    }
  }, [currentSession, initializeLocalSession]);

  const handleRemoveItem = (itemId: string, type: 'song' | 'exercise') => {
    if (!currentSession) return;

    const newItems: InputLocalSessionItem[] = currentSession.session_items.filter((item) =>
      type === 'song' ? item.song_id !== itemId : item.exercise_id !== itemId
    );

    updateLocalSession({
      session_items: newItems,
    });
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4 pt-6">
        {/* Selected Items */}
        <CurrentSessionItems
          sessionItems={currentSession?.session_items || []}
          onRemoveItem={handleRemoveItem}
        />
      </ScrollView>

      {/* Bottom Buttons */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200"
        style={{ paddingBottom: insets.bottom }}
      >
        <View className="flex-row gap-x-4 m-4">
          {/* Add Items Button */}
          <Pressable
            className="flex-1 flex-row items-center justify-center bg-slate-100 rounded-xl py-4 active:opacity-80"
            onPress={() => router.push('/sessions/add-item-to-session')}
          >
            <Plus size={20} className="mr-2 text-slate-900" />
            <Text className="text-slate-900 font-semibold text-lg">Add Items</Text>
          </Pressable>

          {/* Start Practice Button */}
          <Pressable
            className="flex-1 flex-row items-center justify-center bg-primary rounded-xl py-4 shadow-md active:opacity-80"
            onPress={() => router.push('/sessions/active-session')}
          >
            <Play size={20} color="white" className="mr-2" />
            <Text className="text-white font-semibold text-lg">Start</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
