import { useSession } from '@/components/providers/SessionProvider';
import { Redirect } from 'expo-router';
import React, { PropsWithChildren } from 'react';
import { ActivityIndicator, View } from 'react-native';

export function RequireAuth({ children }: PropsWithChildren) {
  const session = useSession();

  if (session === null) {
    // Still loading session
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session?.session?.user) {
    // Redirect to sign-in
    return <Redirect href="/" />;
  }

  return <>{children}</>;
}
