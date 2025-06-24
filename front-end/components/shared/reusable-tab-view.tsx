import { Text, TextClassContext } from '@/components/ui/text';
import { ReactNode, useCallback } from 'react';
import { Dimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  LinearTransition,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type TabValue = 'books' | 'songs' | 'setlists';

const TAB_METADATA: Record<TabValue, { label: string; icon: 'BookOpen' | 'Music' | 'ListMusic' }> =
  {
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
  const translateX = useSharedValue(0);
  const screenWidth = Dimensions.get('window').width;
  const activeIndex = tabs.indexOf(activeTab);
  const slideOffset = useSharedValue(0);

  const handleTabChange = useCallback(
    (newIndex: number, direction: number) => {
      if (newIndex >= 0 && newIndex < tabs.length) {
        // Set the initial offset based on swipe direction
        slideOffset.value = 1.25 * screenWidth * -direction;

        // Trigger the tab change
        onTabChange(tabs[newIndex]);

        // Animate to final position
        slideOffset.value = withTiming(0, {
          duration: 500,
        });
      }
    },
    [tabs, onTabChange, screenWidth, slideOffset]
  );

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      const velocity = e.velocityX;
      const translation = e.translationX;

      // Determine if we should change tabs based on gesture
      if (Math.abs(velocity) > 500 || Math.abs(translation) > screenWidth * 0.2) {
        const direction = velocity < 0 || translation < 0 ? 1 : -1;
        const newIndex = activeIndex + direction;

        if (newIndex >= 0 && newIndex < tabs.length) {
          runOnJS(handleTabChange)(newIndex, -direction);
        }
      }

      // Reset translation
      translateX.value = withSpring(0, {
        velocity: velocity,
        stiffness: 100,
        damping: 40,
      });
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }, { translateX: slideOffset.value }],
    };
  });

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        const newIndex = tabs.indexOf(value as TabValue);
        const direction = newIndex > activeIndex ? 1 : -1;
        handleTabChange(newIndex, direction);
      }}
    >
      <View>
        <TabsList className="flex-row justify-between bg-white">
          {tabs.map((tabValue) => {
            const { label, icon } = TAB_METADATA[tabValue];
            return (
              <TabsTrigger
                key={tabValue}
                value={tabValue}
                className={`flex-1 border-b-4 ${activeTab === tabValue ? 'border-orange-500' : 'border-b-2 border-slate-300 bg-slate-50'}`}
              >
                <TextClassContext.Provider value="text-2xl">
                  <View className={`py-1 flex-row items-center justify-center gap-x-2`}>
                    <ThemedIcon
                      name={icon}
                      size={28}
                      color={activeTab === tabValue ? 'orange-500' : '#6B7280'}
                    />
                    <Text
                      variant="title-2xl"
                      className={`${activeTab === tabValue ? 'text-orange-500' : 'text-gray-500'}`}
                    >
                      {label}
                    </Text>
                  </View>
                </TextClassContext.Provider>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={animatedStyle}
          className="mt-4 gap-y-4 mb-24"
          layout={LinearTransition}
        >
          {children}
        </Animated.View>
      </GestureDetector>
    </Tabs>
  );
}
