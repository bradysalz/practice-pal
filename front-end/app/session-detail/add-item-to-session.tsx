import { SetlistsTab } from '@/components/sessions/SetlistsTab';
import { BooksTab } from '@/components/shared/BooksTab';
import { ReusableTabView, TabValue } from '@/components/shared/reusable-tab-view';
import { SongsTab } from '@/components/shared/SongsTab';
import { ActionButton } from '@/components/ui/action-button';
import { TabsContent } from '@/components/ui/tabs';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { SafeAreaView, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SESSION_TABS: readonly TabValue[] = ['setlists', 'books', 'songs'] as const;

export default function AddItemToSessionScreen() {
  const [activeTab, setActiveTab] = useState<TabValue>('setlists');
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  const handleResetSearch = () => {
    setSearchQuery('');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-4"
        style={{ paddingTop: insets.top + 16, marginBottom: insets.bottom + 100 }}
      >
        {/* Search */}
        <TextInput
          placeholder="Filter by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="px-3 py-2 border border-slate-300 text-lg rounded-xl bg-white mb-6"
        />

        <ReusableTabView tabs={SESSION_TABS} activeTab={activeTab} onTabChange={setActiveTab}>
          <TabsContent value="setlists">
            <SetlistsTab searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="books">
            <BooksTab mode="session" searchQuery={searchQuery} onNavigate={handleResetSearch} />
          </TabsContent>

          <TabsContent value="songs">
            <SongsTab mode="session" searchQuery={searchQuery} />
          </TabsContent>
        </ReusableTabView>
      </ScrollView>

      {/* Done Button */}
      <View
        className="absolute bottom-4 left-0 right-0 bg-white "
        style={{ paddingBottom: insets.bottom }}
      >
        <ActionButton
          text="Done"
          icon={<Check size={22} color="white" />}
          onPress={() => router.back()}
          className="mx-4 my-4"
        />
      </View>
    </SafeAreaView>
  );
}
