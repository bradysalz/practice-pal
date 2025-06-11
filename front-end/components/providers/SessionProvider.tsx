import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

// Define the shape of the context value
interface SessionContextType {
  session: Session | null | undefined;
  isLoading: boolean; // Add this
}

// Initialize context with a default value that matches the interface
const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true); // Explicitly track loading state

  useEffect(() => {
    async function getInitialSession() {
      setIsLoading(true); // Start loading
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();
        setSession(initialSession);
      } catch (error) {
        console.error('Error fetching initial session:', error);
        setSession(null); // Ensure session is null on error
      } finally {
        setIsLoading(false); // End loading
      }
    }

    getInitialSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setIsLoading(false); // Also set loading to false on subsequent changes
    });

    return () => subscription.unsubscribe();
  }, []);

  // Use useMemo to prevent unnecessary re-renders of children
  const contextValue = useMemo(
    () => ({
      session,
      isLoading,
    }),
    [session, isLoading]
  );

  if (isLoading) {
    // Use the explicit isLoading state for rendering the loading indicator
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading session...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
}
