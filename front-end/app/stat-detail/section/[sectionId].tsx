import NotFound from '@/app/+not-found';
import { HighlightBar } from '@/components/shared/HighlightBar';
import ItemProgressGraph from '@/components/stats/ItemProgressGraph';
import { Text } from '@/components/ui/text';
import { useBooksStore } from '@/stores/book-store';
import { useSectionsStore } from '@/stores/section-store';
import { useStatStore } from '@/stores/stat-store';
import { ItemProgressPoint } from '@/types/stats';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Switch, View } from 'react-native';

export default function SectionStatsPage() {
  const { sectionId } = useLocalSearchParams<{ sectionId: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [use_percent, setUsePercent] = useState<boolean>(true);
  const section = useSectionsStore((state) =>
    state.sections.find((section) => section.id === sectionId)
  );
  const book = useBooksStore((state) => state.books.find((book) => book.id === section?.book_id));
  const { fetchSectionStatsOverTime, sectionStatsOverTime } = useStatStore();

  useEffect(() => {
    const fetchData = async () => {
      await fetchSectionStatsOverTime(sectionId);
      setIsLoading(false);
    };
    fetchData();
  }, [fetchSectionStatsOverTime, sectionId, setIsLoading]);

  const data = sectionStatsOverTime[sectionId]?.map((item) => ({
    timestamp: new Date(item.date).getTime(),
    percent_at_goal: item.percent_at_goal,
    percent_played: item.percent_played,
    played: item.played,
    at_goal: item.at_goal,
    total: item.total,
  })) as ItemProgressPoint[];

  if (!book || !section) {
    return <NotFound />;
  }

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator />;
    }

    if (!sectionStatsOverTime[sectionId]) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text variant="body" className="text-gray-500">
            No progress yet!
          </Text>
        </View>
      );
    }

    return (
      <View className="gap-y-4">
        <HighlightBar type="book" name={book.name} />
        <HighlightBar type="section" name={section.name} />
        <View className="flex-row items-center justify-between gap-x-2">
          <Text variant="title-xl" className="text-red-500">
            Items Played
          </Text>
          <Text variant="title-xl" className="text-blue-500">
            Beat Goal
          </Text>

          <View className="flex-row items-center gap-x-2">
            <Text variant="title-xl">Use Percent</Text>
            <Switch
              value={use_percent}
              onValueChange={setUsePercent}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
            />
          </View>
        </View>
        <ItemProgressGraph
          data={data}
          use_percent={use_percent}
          total_items={section.exercise_count}
        />
      </View>
    );
  };

  return <View className="flex-1 p-4 gap-y-4">{renderContent()}</View>;
}
