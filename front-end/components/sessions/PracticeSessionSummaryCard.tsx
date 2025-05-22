import { ThemedIcon } from '@/components/icons/themed-icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatTimestampToDate, formatToMinutes } from '@/lib/utils/date-time';
import { getBookAndSongNamesFromSession } from '@/lib/utils/session';
import { SessionWithItems } from '@/types/session';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
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

  return (
    <View
      className={`rounded-xl my-3 border-l-4 overflow-hidden transition-all duration-300 ${
        isExpanded ? 'border-l-slate-700' : 'border-l-slate-700'
      }`}
    >
      <Card>
        <Pressable onPress={handleCardClick}>
          <CardHeader className="p-4 pb-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            {/* Title + Chevron */}
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-bold text-2xl pb-2">
                {formatTimestampToDate(session.created_at)}
              </Text>
              <View
                className={`-mb-9 transition-transform ${isExpanded ? 'rotate-90' : 'rotate-0'}`}
              >
                <ThemedIcon name="ChevronRight" size={34} />
              </View>
            </View>

            {/* Clock / Dumbbell / Music */}
            <View className="flex-row items-center justify-start">
              <View className="flex-row items-center text-muted-foreground mr-2">
                <ThemedIcon name="Clock" size={20} style={{ marginRight: 1 }} />
                <Text className="ml-1 text-lg">{formatToMinutes(session.duration || 0)} mins</Text>
              </View>
              <Badge className="flex-row items-center gap-1 bg-orange-100 border-orange-200 mr-2">
                <ThemedIcon name="Dumbbell" size={20} />
                <Text className="text-lg">{session.exercise_count}</Text>
              </Badge>
              <Badge className="flex-row items-center gap-1 bg-orange-100 border-orange-200">
                <ThemedIcon name="Music" size={20} />
                <Text className="text-lg">{session.song_count}</Text>
              </Badge>
            </View>
          </CardHeader>
        </Pressable>

        {isExpanded && (
          <CardContent className="p-0 overflow-hidden transition-all duration-300">
            <View className="p-4 pt-2">
              {/* Books Subheader */}
              {bookMap.size > 0 && (
                <View className="mb-3">
                  <View className="font-semibold flex-row items-center gap-1 mb-2">
                    <ThemedIcon name="Dumbbell" size={16} color="red-500" />
                    <Text className="text-lg font-bold"> Books </Text>
                  </View>
                  {Array.from(bookMap.entries()).map(([id, title]) => (
                    <View key={id} className="flex-row justify-left items-center">
                      <Text className="text-lg">{'• '} </Text>
                      <Text className="text-lg">{title}</Text>
                    </View>
                  ))}
                </View>
              )}
              <Separator className="mb-4" />
              {/* Songs Subheader */}
              {songMap.size > 0 && (
                <View>
                  <View className="font-semibold flex-row items-center gap-1 mb-2">
                    <ThemedIcon name="Music" size={16} color="indigo-500" />
                    <Text className="text-lg font-bold"> Songs</Text>
                  </View>
                  {Array.from(songMap.entries()).map(([id, title]) => (
                    <View key={id} className="flex-row justify-left items-center">
                      <Text className="text-lg">{'• '} </Text>
                      <Text className="text-lg">{title}</Text>
                    </View>
                  ))}
                </View>
              )}

              <Button
                className="mt-4 bg-orange-500 "
                onPress={(e) => {
                  e.stopPropagation?.(); // Only on web
                  router.push(`/sessions/${session.id}`);
                }}
              >
                <Text className="text-white font-medium">View Full Session</Text>
              </Button>
            </View>
          </CardContent>
        )}
      </Card>
    </View>
  );
}
