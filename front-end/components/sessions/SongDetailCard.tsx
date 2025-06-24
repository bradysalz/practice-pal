import { SessionDetailCardWrapper } from '@/components/sessions/SessionDetailCardWrapper';
import { SessionItemWithNested } from '@/types/session';
import { groupSongsByArtistWithSession } from '@/utils/session';
import { SongBody } from '../shared/SongBody';

type Props = {
  items: SessionItemWithNested[];
};

export function SongDetailCard({ items }: Props) {
  const songs = items.filter((i) => i.type === 'song' && i.song);
  const artistOrderedItems = groupSongsByArtistWithSession(songs);

  if (artistOrderedItems.length === 0) return null;

  return (
    <SessionDetailCardWrapper title="Songs" iconName="Music" accentColor="orange-500">
      <SongBody
        artistOrderedItems={artistOrderedItems}
        showTempo={true}
        showNotes={true}
        showStar={true}
        getTempo={(song) => song.session.tempo ?? null}
        getNotes={(song) => song.session.notes ?? null}
        getGoalTempo={(song) => song.goal_tempo ?? null}
      />
    </SessionDetailCardWrapper>
  );
}
