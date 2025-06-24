import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export type SongWithSetlist = {
  id: string;
  name: string;
  artist: {
    id: string;
    name: string;
  } | null;
};

export type SongWithSession = {
  id: string;
  name: string;
  goal_tempo?: number | null;
  artist: {
    id: string;
    name: string;
  } | null;
  session: {
    id: string;
    tempo?: number | null;
    notes?: string | null;
  };
};

type ArtistWithSongs<T> = {
  id: string;
  name: string;
  songs: T[];
};

interface SongBodyProps<T> {
  artistOrderedItems: ArtistWithSongs<T>[];
  showTempo?: boolean;
  showNotes?: boolean;
  showStar?: boolean;
  getTempo?: (song: T) => number | null;
  getNotes?: (song: T) => string | null;
  getGoalTempo?: (song: T) => number | null;
}

export function SongBody<T>({
  artistOrderedItems,
  showTempo = false,
  showNotes = false,
  showStar = false,
  getTempo,
  getNotes,
  getGoalTempo,
}: SongBodyProps<T>) {
  if (artistOrderedItems.length === 0) return null;

  return (
    <>
      {artistOrderedItems.map((artist, artistIndex) => (
        <View key={artist.id} className="gap-y-1">
          <Text variant="title-xl">{artist.name}</Text>

          {artist.songs.map((song) => {
            const tempo = getTempo ? getTempo(song) : null;
            const notes = getNotes ? getNotes(song) : null;
            const goalTempo = getGoalTempo ? getGoalTempo(song) : null;
            const showStarIcon =
              showStar && tempo != null && goalTempo != null && tempo >= goalTempo;

            return (
              <View key={(song as any).id} className="ml-6">
                <View className="flex-row items-center pb-2">
                  <ThemedIcon name="Music" size={20} color="black" />
                  <Text variant="body" className="ml-1">
                    {(song as any).name}
                  </Text>
                  {showTempo && tempo && (
                    <Text variant="body-semibold" className="text-lg italic">
                      {` @ ${tempo} bpm`}
                    </Text>
                  )}
                  {showStarIcon && (
                    <Text
                      variant="body"
                      className="ml-1 text-yellow-500"
                      accessibilityLabel="Met goal tempo"
                    >
                      ⭐️
                    </Text>
                  )}
                </View>
                {showNotes && notes && (
                  <Text
                    variant="body"
                    className="pl-7 pb-2 italic text-lg"
                    accessibilityLabel="Notes"
                  >
                    {notes}
                  </Text>
                )}
              </View>
            );
          })}

          {artistIndex < artistOrderedItems.length - 1 && <Separator className="my-4" />}
        </View>
      ))}
    </>
  );
}
