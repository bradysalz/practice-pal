import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useSessionItemsStore } from '@/stores/session-item-store';
import { DraftSessionItem } from '@/types/session';
import { getItemId, getItemName } from '@/utils/session-detail';
import { maybeTrimString } from '@/utils/string';
import { router } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import { ReactNode, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface SessionItemCardProps {
  item: DraftSessionItem;
  onTempoChange: (id: string, value: string) => void;
}

export function ActiveSessionItemCard({ item, onTempoChange }: SessionItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [tempoFocused, setTempoFocused] = useState(false);
  const [tempo, setTempo] = useState('');

  const sessionItemsByExercise = useSessionItemsStore((state) => state.sessionItemsByExercise);
  const sessionItemsBySong = useSessionItemsStore((state) => state.sessionItemsBySong);

  const itemId = getItemId(item);
  const itemName = getItemName(item);

  // Get the last tempo from history
  const getLastTempo = () => {
    if (!itemId) return null;

    const items =
      item.type === 'exercise'
        ? sessionItemsByExercise[itemId] || []
        : sessionItemsBySong[itemId] || [];

    // Sort by created_at in descending order and find the first item with a tempo
    const lastItem = [...items]
      .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
      .find((item) => item.tempo !== null);

    return lastItem?.tempo || null;
  };

  const handleViewHistory = () => {
    if (!itemId) return;

    if (item.type === 'exercise' && item.exercise?.section) {
      router.push(`/library-detail/exercise/${itemId}`);
    } else if (item.type === 'song') {
      router.push(`/library-detail/song/${itemId}`);
    }
  };

  const getItemSource = (): ReactNode => {
    if (item.type === 'exercise' && item.exercise) {
      const sectionName = item.exercise.section?.name || '';
      const bookName = item.exercise.section?.book?.name || '';
      return (
        <View className="gap-y-1">
          {bookName && (
            <View className="flex-row items-center gap-x-2">
              <ThemedIcon name="BookOpen" size={16} color="slate" />
              <Text variant="body" className="text-slate-700">
                {isExpanded ? bookName : maybeTrimString(bookName, 20)}
              </Text>
            </View>
          )}
          {sectionName && (
            <View className="flex-row items-center gap-x-2">
              <ThemedIcon name="Bookmark" size={16} color="slate" />
              <Text variant="body" className="text-slate-700">
                {isExpanded ? sectionName : maybeTrimString(sectionName, 20)}
              </Text>
            </View>
          )}
        </View>
      );
    } else if (item.type === 'song' && item.song) {
      const artistName = item.song.artist?.name || '';
      return (
        <View className="gap-y-1">
          {artistName && (
            <View className="flex-row items-center gap-x-2">
              <ThemedIcon name="MicVocal" size={16} color="slate" />
              <Text variant="body" className="text-slate-700">
                {isExpanded ? artistName : maybeTrimString(artistName, 20)}
              </Text>
            </View>
          )}
        </View>
      );
    }
    return <></>;
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
      borderLeftColor: withTiming(isCompleted && !shouldBeFullOpacity ? '#64748b' : '#ef4444', {
        duration: 300,
      }),
    };
  });

  const handleTempoChange = (value: string) => {
    setIsCompleted(false);
    setTempo(value);
    onTempoChange(itemId, value);
  };

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
                <Text variant="title-xl" className=" mb-1">
                  {itemName}
                </Text>
                {getItemSource()}
              </View>

              <View className="flex-row items-center gap-x-2">
                <View className="flex-row items-center">
                  <TextInput
                    value={tempo}
                    onChangeText={handleTempoChange}
                    onBlur={handleTempoBlur}
                    onFocus={() => setTempoFocused(true)}
                    keyboardType="numeric"
                    className="w-16 text-center border border-slate-300 rounded-xl bg-white py-2 text-lg"
                  />
                  <Text variant="body" className="ml-2 text-slate-600">
                    BPM
                  </Text>
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
                    <Text variant="body" className="text-lg  ">
                      Last Time:{' '}
                    </Text>
                    <Text variant="body" className="text-lg">
                      {getLastTempo() ? `${getLastTempo()} BPM` : 'No history'}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text variant="body-semibold" className="underline text-orange-500">
                      View full history
                    </Text>
                  </View>
                </View>
              </Pressable>
              <Text variant="body-semibold" className="mb-2">
                Notes
              </Text>
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
