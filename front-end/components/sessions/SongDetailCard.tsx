import { SessionDetailCardWrapper } from '@/components/sessions/SessionDetailCardWrapper';
import { Separator } from '@/components/ui/separator';
import { groupSongsByArtistWithSession } from '@/lib/utils/session';
import { SessionItemWithNested } from '@/types/session';

import { Text, View } from 'react-native';

type Props = {
  items: SessionItemWithNested[];
};

export function SongDetailCard({ items }: Props) {
  const songs = items.filter((i) => i.type === 'song' && i.song);
  const artistOrderedItems = groupSongsByArtistWithSession(songs);

  if (artistOrderedItems.length === 0) return null;
  return (
    <SessionDetailCardWrapper title="Songs" iconName="Music" accentColor="orange-500">
      {artistOrderedItems.map((artist, artistIndex) => (
        <View key={artist.id} className="space-y-4">
          <Text className="text-xl font-bold">{artist.name}</Text>

          {artist.songs.map((song) => {
            const tempo = song.session.tempo ?? null;
            const goal = song.goal_tempo ?? null;
            const showStar = tempo != null && goal != null && tempo >= goal;

            return (
              <View key={`${song.id}-${song.session.id}`} className="pl-4 flex-row items-center">
                <Text className="text-base">
                  • {song.name} ({tempo ?? '-'} bpm)
                </Text>
                {showStar && (
                  <Text className="ml-1 text-yellow-500" accessibilityLabel="Met goal tempo">
                    ⭐️
                  </Text>
                )}
              </View>
            );
          })}

          {artistIndex < artistOrderedItems.length - 1 && <Separator className="mt-4" />}
        </View>
      ))}
    </SessionDetailCardWrapper>
  );
}
