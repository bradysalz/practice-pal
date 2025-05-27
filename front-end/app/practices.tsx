import PracticeList from '@/components/PracticeList';
import { RequireAuth } from '@/components/RequireAuth';
import { useSession } from '@/components/providers/SessionProvider';
import { View } from 'react-native';

export default function PracticesScreen() {
  const session = useSession();

  return (
    <RequireAuth>
      <View style={{ flex: 1, padding: 16 }}>
        <PracticeList session={session!} />
      </View>
    </RequireAuth>
  );
}
