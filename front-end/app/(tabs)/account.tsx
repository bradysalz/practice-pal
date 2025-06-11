import Account from '@/components/Account';
import { RequireAuth } from '@/components/RequireAuth';
import { useSession } from '@/components/providers/SessionProvider';
import { View } from 'react-native';

export default function AccountScreen() {
  const session = useSession();

  return (
    <RequireAuth>
      <View style={{ flex: 1, padding: 16 }}>
        <Account session={session?.session!} />
      </View>
    </RequireAuth>
  );
}
