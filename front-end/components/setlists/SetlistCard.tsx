import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { SetlistWithItems } from '@/types/setlist';
import {
  groupExercisesByBookAndSectionFromSetlist,
  groupSongsByArtistFromSetlist,
} from '@/utils/setlist';
import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ExerciseBody } from '../shared/ExerciseBody';
import { SongBody } from '../shared/SongBody';
import { Separator } from '../ui/separator';

interface Props {
  setlist: SetlistWithItems;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SetlistCard = ({ setlist, onEdit, onDelete }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: withTiming(isExpanded ? '180deg' : '0deg', { duration: 300 }) }],
    };
  });

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  // Count songs and exercises
  const songCount = setlist.setlist_items.filter((item) => item.type === 'song').length;
  const exerciseCount = setlist.setlist_items.filter((item) => item.type === 'exercise').length;

  // Group items by type
  const songs = setlist.setlist_items.filter((item) => item.type === 'song');
  const exercises = setlist.setlist_items.filter((item) => item.type === 'exercise');

  // Group items using utility functions
  const artistOrderedItems = groupSongsByArtistFromSetlist(songs);
  const bookOrderedItems = groupExercisesByBookAndSectionFromSetlist(exercises);

  return (
    <View className="rounded-xl my-3 border-l-4 border-l-slate-700 overflow-hidden">
      <Card className="">
        <Pressable onPress={handleCardClick}>
          <CardHeader className="p-4 pb-2 bg-slate-100 dark:bg-slate-800 border-b-4 border-slate-200 dark:border-slate-700 gap-y-2">
            {/* Title + Chevron */}
            <View className="flex-row items-center justify-between">
              <Text variant="title-2xl">{setlist.name}</Text>
              <Animated.View style={chevronStyle}>
                <ChevronDown size={24} className="text-slate-600" />
              </Animated.View>
            </View>

            {/* Description + Stats */}
            <View>
              {setlist.description && (
                <Text variant="body" className="text-slate-700 mb-2">
                  {setlist.description}
                </Text>
              )}
              <View className="flex-row items-center gap-x-2">
                <Badge className="flex-row items-center gap-1 bg-orange-100 border-orange-200">
                  <ThemedIcon name="Dumbbell" size={20} />
                  <Text variant="body" className="text-black">
                    {exerciseCount}
                  </Text>
                </Badge>
                <Badge className="flex-row items-center gap-1 bg-orange-100 border-orange-200">
                  <ThemedIcon name="Music" size={20} />
                  <Text variant="body" className="text-black">
                    {songCount}
                  </Text>
                </Badge>
              </View>
            </View>
          </CardHeader>
        </Pressable>

        {isExpanded && (
          <CardContent className="p-4 bg-background">
            {/* Exercises Section */}
            {exercises.length > 0 && (
              <View className="mb-3">
                <ExerciseBody bookOrderedItems={bookOrderedItems} />
              </View>
            )}

            {/* Separator if both sections exist */}
            {exercises.length > 0 && songs.length > 0 && <Separator className="mb-4" />}

            {/* Songs Section */}
            {songs.length > 0 && (
              <View className="mb-3">
                <SongBody artistOrderedItems={artistOrderedItems} />
              </View>
            )}

            {/* Actions */}
            <View className="flex-row justify-end items-center mt-2">
              <View className="flex-row gap-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onPress={(e) => {
                    e.stopPropagation?.();
                    onDelete(setlist.id);
                  }}
                >
                  <ThemedIcon name="Trash2" size={24} color="red-500" className="text-red-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onPress={(e) => {
                    e.stopPropagation?.();
                    onEdit(setlist.id);
                  }}
                >
                  <ThemedIcon name="Edit" size={24} />
                </Button>
              </View>
            </View>
          </CardContent>
        )}
      </Card>
    </View>
  );
};
