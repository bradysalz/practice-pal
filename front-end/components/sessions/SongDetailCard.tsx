import { SessionDetailCardWrapper } from '@/components/sessions/SessionDetailCardWrapper';
import { Separator } from '@/components/ui/separator';
import { SessionItemWithNested } from '@/types/session';
import { groupSongsByArtistWithSession } from '@/utils/session';

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
        <View key={artist.id} className="gap-y-4">
          <Text className="text-xl font-bold">{artist.name}</Text>

          {artist.songs.map((song) => {
            const tempo = song.session.tempo ?? null;
            const goal = song.goal_tempo ?? null;
            const showStar = tempo != null && goal != null && tempo >= goal;

            return (
              <View key={`${song.id}-${song.session.id}`} className="pl-4 gap-y-1">
                <View className="flex-row items-center">

                  <Text className="text-base">
                    • {song.name} ({tempo ?? '-'} bpm)
                  </Text>
                  {showStar && (
                    <Text className="ml-1 text-yellow-500" accessibilityLabel="Met goal tempo">
                      ⭐️
                    </Text>
                  )}
                </View>
                {song.session.notes && (
                  <Text className="pl-3 pb-2 text-slate-500" accessibilityLabel="Notes">
                    {song.session.notes}
                  </Text>
                )}
              </View>
            );
          })}

          {artistIndex < artistOrderedItems.length - 1 && <Separator className="my-4" />}
        </View>
      ))}
    </SessionDetailCardWrapper>
  );
}
