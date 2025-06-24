import { ActiveValueIndicator } from '@/components/stats/ActiveValueIndicator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { ItemProgressPoint, TimeRange } from '@/types/stats';
import { filterProgressData } from '@/utils/item-progress';
import { formatDateByRange } from '@/utils/stats';
import { useFont } from '@shopify/react-native-skia';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { CartesianChart, Line, Scatter, useChartPressState } from 'victory-native';

interface ItemProgressGraphProps {
  data: ItemProgressPoint[];
  use_percent: boolean;
  total_items: number;
}

export default function ItemProgressGraph({
  data,
  use_percent,
  total_items,
}: ItemProgressGraphProps) {
  const font = useFont(require('@/assets/fonts/Inter-VariableFont_opsz,wght.ttf'), 14);

  const playedKey = use_percent ? 'percent_played' : 'played';
  const atGoalKey = use_percent ? 'percent_at_goal' : 'at_goal';

  const { state, isActive } = useChartPressState({
    x: 0,
    y: { [playedKey]: 0, [atGoalKey]: 0 },
  });
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  const now = Date.now();
  const { filteredData, cutoffDate } = useMemo(
    () => filterProgressData(data, timeRange, now),
    [data, timeRange, now]
  );

  if (!font) {
    return null;
  }

  // If no valid data points, show a message
  if (filteredData.length === 0) {
    return (
      <View className="gap-y-4">
        <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
          <TabsList className="flex-row justify-between rounded-xl bg-slate-300">
            <TabsTrigger value="week" className="flex-1 rounded-xl">
              <Text variant={timeRange === 'week' ? 'body-bold' : 'body-semibold'}>Week</Text>
            </TabsTrigger>
            <TabsTrigger value="month" className="flex-1 rounded-xl">
              <Text variant={timeRange === 'month' ? 'body-bold' : 'body-semibold'}>Month</Text>
            </TabsTrigger>
            <TabsTrigger value="year" className="flex-1 rounded-xl">
              <Text variant={timeRange === 'year' ? 'body-bold' : 'body-semibold'}>Year</Text>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex-1 rounded-xl">
              <Text variant={timeRange === 'all' ? 'body-bold' : 'body-semibold'}>All</Text>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Text className="text-center text-gray-500">No data available for this time range</Text>
      </View>
    );
  }

  return (
    <View className="gap-y-4">
      <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
        <TabsList className="flex-row justify-between rounded-xl bg-slate-300">
          <TabsTrigger value="week" className="flex-1 rounded-xl">
            <Text variant={timeRange === 'week' ? 'body-bold' : 'body-semibold'}>Week</Text>
          </TabsTrigger>
          <TabsTrigger value="month" className="flex-1 rounded-xl">
            <Text variant={timeRange === 'month' ? 'body-bold' : 'body-semibold'}>Month</Text>
          </TabsTrigger>
          <TabsTrigger value="year" className="flex-1 rounded-xl">
            <Text variant={timeRange === 'year' ? 'body-bold' : 'body-semibold'}>Year</Text>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex-1 rounded-xl">
            <Text variant={timeRange === 'all' ? 'body-bold' : 'body-semibold'}>All</Text>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <View style={{ height: 300 }} className="gap-y-4">
        <CartesianChart
          // this is realistically just ItemProgressPoint[] but I can't figure out how to type it
          data={filteredData as any[]}
          xKey="timestamp"
          yKeys={[playedKey, atGoalKey]}
          domain={{
            x: [cutoffDate, now],
            y: use_percent ? [0, 90] : [0, total_items * 1.1],
          }}
          domainPadding={{ left: 40, right: 40, top: 60, bottom: 10 }}
          xAxis={{
            font,
            formatXLabel: (value) => formatDateByRange(value, timeRange, filteredData),
            tickCount: filteredData.length <= 2 ? 1 : 4,
          }}
          yAxis={[
            {
              font,
              formatYLabel: (label: number) => {
                if (use_percent) {
                  return `${Math.round(label)}%`;
                }
                return Math.round(label).toString();
              },
            },
          ]}
          chartPressState={state as any}
          renderOutside={({ chartBounds }) => {
            if (isActive) {
              return (
                <ActiveValueIndicator
                  xPosition={state.x.position}
                  yPosition={state.y[playedKey].position}
                  xValue={state.x.value}
                  yValue={state.y[playedKey].value}
                  y2Position={state.y[atGoalKey].position}
                  y2Value={state.y[atGoalKey].value}
                  textColor={'black'}
                  lineColor={'black'}
                  indicatorColor={'#ef4444'}
                  indicatorColor2={'#3b82f6'}
                  bottom={chartBounds.bottom}
                  top={chartBounds.top}
                  label="Played"
                  label2="At Goal"
                />
              );
            }
          }}
        >
          {({ points }) => (
            <View>
              <Line points={points[playedKey]} color="#ef4444" strokeWidth={3} />
              <Scatter points={points[playedKey]} color="#ef4444" radius={5} />
              <Line points={points[atGoalKey]} color="#3b82f6" strokeWidth={3} />
              <Scatter points={points[atGoalKey]} color="#3b82f6" radius={5} />
            </View>
          )}
        </CartesianChart>
      </View>
    </View>
  );
}
