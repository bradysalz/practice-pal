// components/RequireAuth.tsx
import { useSession } from '@/components/SessionProvider';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export function RequireAuth({ children }: { children: React.ReactNode }) {
    const session = useSession();

    if (session === null) {
        // Still loading session
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!session?.user) {
        // Redirect to sign-in
        return <Redirect href="/" />;
    }

    return <>{children}</>;
}
