import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { SessionWithItems } from '@/types/session';
import { formatTimestampToDate, formatToMinutes } from '@/utils/date-time';
import { getBookAndSongNamesFromSession } from '@/utils/session';
import { useRouter } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Separator } from '../ui/separator';

type PracticeSessionSummaryCardProps = {
  session: SessionWithItems;
};

export function PracticeSessionSummaryCard({ session }: PracticeSessionSummaryCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const { bookMap, songMap } = getBookAndSongNamesFromSession(session.session_items);

  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: withTiming(isExpanded ? '180deg' : '0deg', { duration: 300 }) }],
    };
  });

  return (
    <View className="my-3 border-l-4 border-l-orange-500 rounded-xl">
      <Card className="rounded-xl overflow-hidden shadow">
        <Pressable onPress={handleCardClick}>
          <CardHeader className="p-4 pb-2 bg-slate-100 dark:bg-slate-800 border-b-4 border-slate-200 dark:border-slate-700">
            {/* Title + Chevron */}
            <View className="flex-row items-center justify-between mb-2">
              <Text className="pb-2" variant="title-2xl">
                {formatTimestampToDate(session.created_at)}
              </Text>
              <Animated.View style={chevronStyle}>
                <ChevronDown size={24} className="text-slate-600" />
              </Animated.View>
            </View>

            {/* Clock */}
            <View className="flex-row items-center justify-start gap-x-2">
              <View className="flex-row items-center text-muted-foreground mr-2">
                <ThemedIcon name="Clock" size={20} style={{ marginRight: 1 }} />
                <Text className="ml-1" variant="title">
                  {formatToMinutes(session.duration || 0)} mins
                </Text>
              </View>
            </View>
          </CardHeader>
        </Pressable>

        {isExpanded && (
          <CardContent className="p-0 overflow-hidden transition-all duration-300">
            <View className="p-4">
              {/* Books Subheader */}
              {bookMap.size > 0 && (
                <View className="mb-3">
                  <View className="font-semibold flex-row items-center gap-1 mb-2">
                    <ThemedIcon name="Dumbbell" size={22} color="orange-500" />
                    <Text variant="title-xl">Books</Text>
                  </View>
                  {Array.from(bookMap.entries()).map(([id, title]) => (
                    <View key={id} className="flex-row justify-left items-center">
                      <Text className="text-lg">{'• '} </Text>
                      <Text className="text-lg">{title}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Separator between books and songs, need both to be non-empty */}
              {bookMap.size > 0 && songMap.size > 0 && <Separator className="mb-4" />}

              {/* Songs Subheader */}
              {songMap.size > 0 && (
                <View>
                  <View className="font-semibold flex-row items-center gap-1 mb-2">
                    <ThemedIcon name="Music" size={22} color="orange-500" />
                    <Text variant="title-xl">Songs</Text>
                  </View>
                  {Array.from(songMap.entries()).map(([id, title]) => (
                    <View key={id} className="flex-row justify-left items-center">
                      <Text className="text-lg">{'• '} </Text>
                      <Text className="text-lg">{title}</Text>
                    </View>
                  ))}
                </View>
              )}

              <Pressable
                className="mt-4 bg-orange-500 h-12 items-center justify-center rounded-xl"
                onPress={(e) => {
                  e.stopPropagation?.(); // Only on web
                  router.push(`/session-detail/${session.id}`);
                }}
              >
                <Text variant="title-bold" className="text-white">
                  View Full Session
                </Text>
              </Pressable>
            </View>
          </CardContent>
        )}
      </Card>
    </View>
  );
}
