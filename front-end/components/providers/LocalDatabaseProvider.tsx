import { db } from '@/lib/db/db';
import { runMigrationsIfNeeded } from '@/lib/db/migrations';
import { refreshAllFastViews } from '@/lib/db/mutations';
import { seedLocalDb } from '@/lib/db/seed';
import { createContext, useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const LocalDatabaseContext = createContext<{ isReady: boolean }>({ isReady: false });

export const useLocalDatabase = () => useContext(LocalDatabaseContext);

export function LocalDatabaseProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await runMigrationsIfNeeded(db);
        await refreshAllFastViews();
        await seedLocalDb();
        setReady(true);
      } catch (error) {
        console.error('LocalDatabaseProvider: Failed to initialize database:', error);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading PracticePal DB...</Text>
      </View>
    );
  }

  return (
    <LocalDatabaseContext.Provider value={{ isReady: ready }}>
      {children}
    </LocalDatabaseContext.Provider>
  );
}
