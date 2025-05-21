import { SessionDetailCardWrapper } from '@/components/sessions/SessionDetailCardWrapper';
import { Text } from 'react-native';

export function NotesDetailCard({ notes }: { notes?: string | null }) {
  if (!notes) return null;

  return (
    <SessionDetailCardWrapper
      title="Notes"
      iconName="NotebookPen"
      iconColor="slate-500"
      accentColor="slate-500"
    >
      <Text className="text-base text-slate-700 dark:text-slate-300">{notes}</Text>
    </SessionDetailCardWrapper>
  );
}
