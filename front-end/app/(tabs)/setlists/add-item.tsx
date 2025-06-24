import { BooksTab } from '@/components/shared/BooksTab';
import { ReusableTabView, TabValue } from '@/components/shared/reusable-tab-view';
import { SongsTab } from '@/components/shared/SongsTab';
import { TabsContent } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { ActionButton } from '@/components/ui/action-button';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ADD_ITEM_TABS: readonly TabValue[] = ['books', 'songs'] as const;

export default function AddItemScreen() {
  const [activeTab, setActiveTab] = useState<TabValue>('books');
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4 pt-6">
        {/* Search */}
        <TextInput
          placeholder="Search..."
          className="px-3 py-2 border border-slate-300 rounded-xl bg-white mb-6"
        />

        <ReusableTabView tabs={ADD_ITEM_TABS} activeTab={activeTab} onTabChange={setActiveTab}>
          <TabsContent value="books">
            <BooksTab mode="setlist" />
          </TabsContent>

          <TabsContent value="songs">
            <SongsTab mode="setlist" />
          </TabsContent>
        </ReusableTabView>
      </ScrollView>

      {/* Done Button */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200"
        style={{ paddingBottom: insets.bottom }}
      >
        <ActionButton
          text="Done"
          icon={<Check size={20} color="white" />}
          onPress={() => router.back()}
          className="mx-4 my-4"
        />
      </View>
    </View>
  );
}
