import { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { ThemedIcon } from '@/components/icons/themed-icon';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type TabValue = 'books' | 'songs' | 'setlists';

const TAB_METADATA: Record<TabValue, { label: string; icon: 'BookOpen' | 'Music' | 'ListMusic' }> = {
  books: { label: 'Books', icon: 'BookOpen' },
  songs: { label: 'Songs', icon: 'Music' },
  setlists: { label: 'Setlists', icon: 'ListMusic' },
} as const;

interface ReusableTabViewProps {
  tabs: readonly TabValue[];
  activeTab: TabValue;
  onTabChange: (value: TabValue) => void;
  children: ReactNode;
}

export function ReusableTabView({ tabs, activeTab, onTabChange, children }: ReusableTabViewProps) {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as TabValue)}>
      <View className="">
        <TabsList className="flex-row justify-between bg-white">
          {tabs.map((tabValue) => {
            const { label, icon } = TAB_METADATA[tabValue];
            return (
              <TabsTrigger key={tabValue} value={tabValue} className={`flex-1 border-b-4 ${activeTab === tabValue ? 'border-orange-500' : 'border-b-2 border-slate-300 bg-slate-50'}`}>
                <View className={`py-1 flex-row items-center justify-center gap-x-2`}>
                  <ThemedIcon
                    name={icon}
                    size={28}
                    color={activeTab === tabValue ? 'orange-500' : '#6B7280'}
                  />
                  <Text className={`text-2xl ${activeTab === tabValue ? 'text-orange-500' : 'text-gray-500'}`}>
                    {label}
                  </Text>
                </View>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </View>

      <View className="mt-4 gap-y-4 mb-24">
        {children}
      </View>
    </Tabs>
  );
}
