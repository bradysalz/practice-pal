import { DraftSession, DraftSessionItem } from '@/types/session';

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function initializeTempos(items: DraftSessionItem[]): Record<string, string> {
  return Object.fromEntries(items.map(item => [item.id, item.tempo?.toString() || '']));
}

export function updateDraftItemTempo(items: DraftSessionItem[], itemId: string, text: string): DraftSessionItem[] {
  return items.map(item =>
    item.id === itemId ? { ...item, tempo: text ? parseInt(text, 10) || null : null } : item
  );
}

export function applyTemposToDraft(draft: DraftSession, tempos: Record<string, string>, elapsed: number): DraftSession {
  const items = draft.items.map(item => {
    const current = tempos[item.id];
    return { ...item, tempo: current ? parseInt(current, 10) || null : null };
  });
  return { ...draft, duration: elapsed, items };
}

export function getItemId(item: DraftSessionItem): string {
  if (item.type === 'exercise' && item.exercise) {
    return item.exercise.id;
  }
  if (item.type === 'song' && item.song) {
    return item.song.id;
  }
  return '';
}

export function getItemName(item: DraftSessionItem): string {
  if (item.type === 'exercise' && item.exercise) {
    return item.exercise.name || 'Untitled Exercise';
  }
  if (item.type === 'song' && item.song) {
    return item.song.name || 'Untitled Song';
  }
  return '';
}
