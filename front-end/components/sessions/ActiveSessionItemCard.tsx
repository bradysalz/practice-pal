import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useSessionItemsStore } from '@/stores/session-item-store';
import { router } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface SessionItemCardProps {
  name: string;
  source: string;
  tempo: string;
  onTempoChange: (value: string) => void;
  itemId: string;
  itemType: 'exercise' | 'song';
  exerciseDetails?: {
    bookId: string;
    sectionId: string;
  };
}

export function ActiveSessionItemCard({
  name,
  source,
  tempo,
  onTempoChange,
  itemId,
  itemType,
  exerciseDetails
}: SessionItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [tempoFocused, setTempoFocused] = useState(false);

  const sessionItemsByExercise = useSessionItemsStore((state) => state.sessionItemsByExercise);
  const sessionItemsBySong = useSessionItemsStore((state) => state.sessionItemsBySong);

  // Get the last tempo from history
  const getLastTempo = () => {
    if (!itemId) return null;

    const items = itemType === 'exercise'
      ? sessionItemsByExercise[itemId] || []
      : sessionItemsBySong[itemId] || [];

    // Sort by created_at in descending order and find the first item with a tempo
    const lastItem = [...items]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .find(item => item.tempo !== null);

    return lastItem?.tempo || null;
  };

  const handleViewHistory = () => {
    if (!itemId) return;

    if (itemType === 'exercise' && exerciseDetails) {
      router.push(`/library-detail/book/${exerciseDetails.bookId}/section/${exerciseDetails.sectionId}/exercise/${itemId}`);
    } else if (itemType === 'song') {
      router.push(`/library-detail/song/${itemId}`);
    }
  };

  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: withTiming(isExpanded ? '180deg' : '0deg', { duration: 300 }) }],
    };
  });

  const cardStyle = useAnimatedStyle(() => {
    const shouldBeFullOpacity = isExpanded || tempoFocused;
    return {
      opacity: withTiming(isCompleted && !shouldBeFullOpacity ? 0.4 : 1, { duration: 300 }),
      borderLeftColor: withTiming(
        isCompleted && !shouldBeFullOpacity ? '#64748b' : '#ef4444',
        { duration: 300 }
      ),
    };
  });

  const handleTempoBlur = () => {
    setTempoFocused(false);
    if (tempo) {
      setIsCompleted(true);
    }
  };

  return (
    <Animated.View style={cardStyle} className="rounded-xl my-3 border-l-4 overflow-hidden">
      <Pressable onPress={() => setIsExpanded(!isExpanded)} className="active:opacity-80">
        <Card>
          <CardHeader className="p-4 pb-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-xl font-bold mb-1">{name}</Text>
                <Text className="text-slate-500 text-base">{source}</Text>
              </View>

              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center">
                  <TextInput
                    value={tempo}
                    onChangeText={(value) => {
                      setIsCompleted(false);
                      onTempoChange(value);
                    }}
                    onBlur={handleTempoBlur}
                    onFocus={() => setTempoFocused(true)}
                    keyboardType="numeric"
                    className="w-16 text-center border border-slate-300 rounded-xl bg-white py-2 text-lg"
                  />
                  <Text className="text-base ml-2 text-slate-600">BPM</Text>
                </View>

                <Animated.View style={chevronStyle}>
                  <ChevronDown size={24} className="text-slate-600" />
                </Animated.View>
              </View>
            </View>
          </CardHeader>

          {isExpanded && (
            <CardContent className="p-4 bg-white">
              <Pressable onPress={handleViewHistory}>
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <Text className="text-lg  ">Last Time: </Text>
                    <Text className="text-lg">
                      {getLastTempo() ? `${getLastTempo()} BPM` : 'No history'}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-base font-semibold underline text-orange-500">View full history</Text>
                  </View>
                </View>
              </Pressable>
              <Text className="text-lg font-semibold mb-2">Notes</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                onBlur={() => {
                  setIsExpanded(false);
                  handleTempoBlur();
                }}
                placeholder="Add notes about your practice..."
                multiline
                numberOfLines={4}
                className="w-full border border-slate-300 rounded-xl bg-white px-3 py-2 text-base"
                placeholderTextColor="#94a3b8"
              />
            </CardContent>
          )}
        </Card>
      </Pressable>
    </Animated.View>
  );
}
