import { SessionDetailCardWrapper } from '@/components/sessions/SessionDetailCardWrapper';
import { Separator } from '@/components/ui/separator';
import { SessionItemWithNested } from '@/types/session';

import { Text, View } from 'react-native';

export function SongDetailCardCard({ items }: { items: SessionItemWithNested[] }) {
  const songs = items.filter((i) => i.type === 'song' && i.song);
  if (songs.length === 0) return null;

  return (
    <SessionDetailCardWrapper title="Songs" iconName="Music" accentColor="orange-500">
      {songs.map((song, index) => (
        <View key={song.id}>
          {index > 0 && <Separator className="mb-2" />}
          <View className="flex-row justify-between items-start mb-1">
            <Text className="font-medium">{song.song?.name}</Text>
            <Text>{song.tempo ?? '-'} BPM</Text>
          </View>
        </View>
      ))}
    </SessionDetailCardWrapper>
  );
}
