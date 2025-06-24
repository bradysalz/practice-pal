import { CurrentSessionItems } from '@/components/sessions/CurrentSessionItems';
import { Text } from '@/components/ui/text';
import { useDraftSessionsStore } from '@/stores/draft-sessions-store';
import { createNewDraft } from '@/utils/draft-session';
import { router } from 'expo-router';
import { Play, Plus } from 'lucide-react-native';
import { ActionButton } from '@/components/ui/action-button';
import { useEffect } from 'react';
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MakeSessionPage() {
  const { draftSession, setDraftSession, removeItemFromDraft } = useDraftSessionsStore();
  const insets = useSafeAreaInsets();

  // Initialize draft session if not exists
  useEffect(() => {
    if (!draftSession) {
      setDraftSession(createNewDraft());
    }
  }, [draftSession, setDraftSession]);

  const handleRemoveItem = (itemId: string) => {
    if (!draftSession) return;
    removeItemFromDraft(itemId);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4" style={{ paddingTop: insets.top + 16 }}>
        {/* Selected Items */}
        <CurrentSessionItems
          sessionItems={draftSession?.items || []}
          onRemoveItem={handleRemoveItem}
        />
      </ScrollView>

      {/* Bottom Buttons */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200"
        style={{ paddingBottom: insets.bottom }}
      >
        <View className="flex-row gap-x-4 mt-4 mx-4">
          {/* Add Items Button */}
          <Pressable
            className="flex-1 flex-row items-center justify-center bg-slate-100 rounded-xl py-4 active:opacity-80"
            onPress={() => router.push('/session-detail/add-item-to-session')}
          >
            <Plus size={20} className="mr-2 text-slate-900" />
            <Text variant="body-semibold" className="text-slate-900">
              Add Items
            </Text>
          </Pressable>

          {/* Start Practice Button */}
          <ActionButton
            text="Start"
            icon={<Play size={20} color="white" />}
            onPress={() => router.push('/session-detail/active-session')}
            className="flex-1"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
