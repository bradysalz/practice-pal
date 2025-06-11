import { ActiveValueIndicator } from '@/components/stats/ActiveValueIndicator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItemTempoPoint, TimeRange } from '@/types/stats';
import { filterProgressData } from '@/utils/item-progress';
import { formatDateByRange } from '@/utils/stats';
import { DashPathEffect, useFont } from '@shopify/react-native-skia';
import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { CartesianChart, Line, Scatter, useChartPressState } from 'victory-native';

interface ItemTempoGraphProps {
  data: ItemTempoPoint[];
}

export default function ItemTempoGraph({ data }: ItemTempoGraphProps) {
  const font = useFont(require('@/assets/fonts/Inter-VariableFont_opsz,wght.ttf'), 14);
  const { state, isActive } = useChartPressState({ x: 0, y: { tempo: 0 } });
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
              <Text className={`text-lg ${timeRange === 'week' ? 'font-bold' : ''}`}>Week</Text>
            </TabsTrigger>
            <TabsTrigger value="month" className="flex-1 rounded-xl">
              <Text className={`text-lg ${timeRange === 'month' ? 'font-bold' : ''}`}>Month</Text>
            </TabsTrigger>
            <TabsTrigger value="year" className="flex-1 rounded-xl">
              <Text className={`text-lg ${timeRange === 'year' ? 'font-bold' : ''}`}>Year</Text>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex-1 rounded-xl">
              <Text className={`text-lg ${timeRange === 'all' ? 'font-bold' : ''}`}>All</Text>
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
            <Text className={`text-lg ${timeRange === 'week' ? 'font-bold' : ''}`}>Week</Text>
          </TabsTrigger>
          <TabsTrigger value="month" className="flex-1 rounded-xl">
            <Text className={`text-lg ${timeRange === 'month' ? 'font-bold' : ''}`}>Month</Text>
          </TabsTrigger>
          <TabsTrigger value="year" className="flex-1 rounded-xl">
            <Text className={`text-lg ${timeRange === 'year' ? 'font-bold' : ''}`}>Year</Text>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex-1 rounded-xl">
            <Text className={`text-lg ${timeRange === 'all' ? 'font-bold' : ''}`}>All</Text>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <View style={{ height: 300 }}>
        <CartesianChart
          // this is realistically just ItemTempoPoint[] but I can't figure out how to type it
          data={filteredData as any[]}
          xKey="timestamp"
          yKeys={['tempo', 'goal_tempo']}
          domainPadding={{ left: 40, right: 40, top: 40, bottom: 10 }}
          xAxis={{
            font,
            formatXLabel: (value) => formatDateByRange(value, timeRange, filteredData),
            tickCount: filteredData.length <= 2 ? 2 : 4,
          }}
          yAxis={[
            {
              tickCount: 5,
              font,
              formatYLabel: (value: number) => `${Math.round(value)}`,
            },
          ]}
          domain={{
            x: [cutoffDate, now],
          }}
          chartPressState={state as any}
          renderOutside={({ chartBounds }) => {
            if (isActive) {
              return (
                <ActiveValueIndicator
                  xPosition={state.x.position}
                  yPosition={state.y.tempo.position}
                  xValue={state.x.value}
                  yValue={state.y.tempo.value}
                  textColor={'black'}
                  lineColor={'black'}
                  indicatorColor={'#ef4444'}
                  bottom={chartBounds.bottom}
                  top={chartBounds.top}
                  label="Tempo"
                />
              );
            }
          }}
        >
          {({ points }) => (
            <View>
              <Line points={points.tempo} color="#ef4444" strokeWidth={3} />
              <Scatter points={points.tempo} color="#ef4444" radius={5} />
              <Line
                points={points.goal_tempo}
                color="#3b82f6"
                strokeWidth={3}
              >
                <DashPathEffect intervals={[15, 5]} />
              </Line>
            </View>
          )}
        </CartesianChart>
      </View >
    </View >
  );
}
