import { ThemedIcon } from '@/components/icons/themed-icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type Exercise = {
  id: string;
  name: string;
  tempo: number;
  duration: number;
};

type Song = {
  id: string;
  name: string;
  artist?: string;
  tempo: number;
  duration: number;
};

type PracticeSession = {
  id: string;
  date: Date;
  exercises: Exercise[];
  songs: Song[];
  totalDuration: number;
};

interface PracticeSessionCardProps {
  session: PracticeSession;
}

export function PracticeSessionCard({ session }: PracticeSessionCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = format(session.date, 'EEEE, MMMM d');

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View
      className={`rounded-xl my-3 border-l-4 overflow-hidden transition-all duration-300 ${
        isExpanded ? 'border-l-red-500' : 'border-l-slate-300'
      }`}
    >
      <Card>
        <Pressable onPress={handleCardClick}>
          <CardHeader className="p-4 pb-2 flex-row items-center justify-between bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <View>
              <Text className="font-bold text-xl pb-1">{formattedDate}</Text>
              <View className="flex-row items-center text-sm text-muted-foreground">
                <ThemedIcon name="Clock" size={14} style={{ marginRight: 1 }} />
                <Text className="ml-1 text-md">{session.totalDuration} mins</Text>
              </View>
            </View>
            <View className="flex-row items-center space-x-2">
              <Badge className="flex-row items-center gap-1 bg-red-100 text-red-700 border-red-200">
                <ThemedIcon name="Dumbbell" size={14} color="red-500" />
                <Text className="text-lg">{session.exercises.length}</Text>
              </Badge>
              <Badge className="flex-row items-center gap-1 bg-slate-100 text-slate-700 border-slate-200">
                <ThemedIcon name="Music" size={14} color="slate-500" />
                <Text className="text-lg">{session.songs.length}</Text>
              </Badge>
              <View className={`transition-transform ${isExpanded ? 'rotate-90' : 'rotate-0'}`}>
                <ThemedIcon name="ChevronRight" size={20} />
              </View>
            </View>
          </CardHeader>
        </Pressable>

        {isExpanded && (
          <CardContent className="p-0 overflow-hidden transition-all duration-300">
            <View className="p-4 pt-2">
              {session.exercises.length > 0 && (
                <View className="mb-3">
                  <View className="text-sm font-semibold flex-row items-center gap-1 mb-2">
                    <ThemedIcon name="Dumbbell" size={16} color="red-500" />
                    <Text> Exercises </Text>
                  </View>
                  {session.exercises.map((exercise) => (
                    <View key={exercise.id} className="flex-row justify-between">
                      <Text>{exercise.name}</Text>
                      <Text className="text-muted-foreground">{exercise.tempo} BPM</Text>
                    </View>
                  ))}
                </View>
              )}

              {session.songs.length > 0 && (
                <View>
                  <View className="text-sm font-semibold flex-row items-center gap-1 mb-2">
                    <ThemedIcon name="Music" size={16} color="orange-500" />
                    <Text> Songs</Text>
                  </View>
                  {session.songs.map((song) => (
                    <View key={song.id} className="flex-row justify-between">
                      <View>
                        <Text>{song.name}</Text>
                        {song.artist && (
                          <Text className="text-muted-foreground text-xs"> - {song.artist}</Text>
                        )}
                      </View>
                      <Text className="text-muted-foreground">{song.tempo} BPM</Text>
                    </View>
                  ))}
                </View>
              )}

              <Button
                className="mt-4"
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
