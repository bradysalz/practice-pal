import { useState } from 'react';
import { format } from 'date-fns';
import { View, Text, Pressable } from 'react-native';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Dumbbell, Music, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

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
      className={`rounded-xl mb-3 border-l-4 overflow-hidden transition-all duration-300 ${isExpanded ? 'border-l-red-500' : 'border-l-slate-300'}`}
    >
      <Card>
        <Pressable onPress={handleCardClick}>
          <CardHeader className="p-4 pb-2 flex-row items-center justify-between bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <View>
              <Text className="font-bold text-md pb-1">{formattedDate}</Text>
              <View className="flex-row items-center text-sm text-muted-foreground">
                <Clock size={14} className="mr-1" />
                <Text>{session.totalDuration} mins</Text>
              </View>
            </View>
            <View className="flex-row items-center space-x-2">
              <Badge className="flex-row items-center gap-1 bg-red-100 text-red-700 border-red-200">
                <Dumbbell size={12} className="text-red-500" />
                <Text>{session.exercises.length}</Text>
              </Badge>
              <Badge className="flex-row items-center gap-1 bg-slate-100 text-slate-700 border-slate-200">
                <Music size={12} className="text-slate-500" />
                <Text>{session.songs.length}</Text>
              </Badge>
              <View className={`transition-transform ${isExpanded ? 'rotate-90' : 'rotate-0'}`}>
                <ChevronRight size={20} />
              </View>
            </View>
          </CardHeader>
        </Pressable>

        <CardContent
          className={`p-0 overflow-hidden transition-all duration-300 ${isExpanded ? 'h-auto' : 'h-0'}`}
        >
          <View className="p-4 pt-2">
            {session.exercises.length > 0 && (
              <View className="mb-3">
                <View className="text-sm font-semibold flex-row items-center gap-1 mb-2">
                  <Dumbbell size={16} className="text-red-500" /> Exercises
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
                  <Music size={16} className="text-orange-500" /> Songs
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
              className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white"
              onPress={(e) => {
                e.stopPropagation?.(); // Only on web
                router.push(`/practice-sessions/${session.id}`);
              }}
            >
              View Full Session
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
