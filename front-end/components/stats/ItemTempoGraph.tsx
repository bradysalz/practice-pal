import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemTempoPoint, TimeRange } from "@/types/stats";
import { calculateCutoffDate, isValidDate } from "@/utils/date-time";
import { formatDateByRange } from "@/utils/stats";
import { Circle, Skia, Line as SkiaLine, Text as SkiaText, useFont, vec } from "@shopify/react-native-skia";
import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { useDerivedValue, type SharedValue } from "react-native-reanimated";
import { CartesianChart, Line, Scatter, useChartPressState } from "victory-native";

interface ItemTempoGraphProps {
  data: ItemTempoPoint[];
}



export default function ItemTempoGraph({ data }: ItemTempoGraphProps) {
  const font = useFont(require("@/assets/fonts/Inter-VariableFont_opsz,wght.ttf"), 14);
  const { state, isActive } = useChartPressState({ x: '', y: { tempo: 0 } });
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  const filteredData = useMemo(() => {
    const now = new Date();
    const cutoffDate = calculateCutoffDate(timeRange);

    return data
      .filter(point => isValidDate(point.timestamp))
      .filter(point => new Date(point.timestamp) >= cutoffDate)
      .filter(point => new Date(point.timestamp) <= now)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [data, timeRange]);


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
        <CartesianChart<ItemTempoPoint, "timestamp", "tempo">
          data={filteredData}
          xKey="timestamp"
          yKeys={["tempo"]}
          domainPadding={{ left: 40, right: 40, top: 40, bottom: 10 }}
          xAxis={{
            font,
            formatXLabel: (value) => formatDateByRange(value, timeRange, filteredData),
            tickCount: filteredData.length <= 2 ? 1 : 4
          }}
          yAxis={[{
            tickCount: 5,
            font,
            formatYLabel: (value: number) => `${Math.round(value)}`
          }]}
          chartPressState={state}
          renderOutside={({ chartBounds }) => {
            if (isActive) {
              return (
                <ActiveValueIndicator
                  xPosition={state.x.position}
                  yPosition={state.y.tempo.position}
                  xValue={state.x.value}
                  yValue={state.y.tempo.value}
                  textColor={"black"}
                  lineColor={"black"}
                  indicatorColor={"black"}
                  bottom={chartBounds.bottom}
                  top={chartBounds.top}
                />)
            }
          }}
        >
          {({ points }) => (
            <View>
              <Line
                points={points.tempo}
                color="#ef4444"
                strokeWidth={3}
              />
              <Scatter
                points={points.tempo}
                color="#ef4444"
                radius={5}
              />
            </View>
          )}
        </CartesianChart>
      </View>
    </View>
  );
}

const ActiveValueIndicator = ({
  xPosition,
  yPosition,
  top,
  bottom,
  xValue,
  yValue,
  textColor,
  lineColor,
  indicatorColor,
  topOffset = 0,
}: {
  xPosition: SharedValue<number>;
  yPosition: SharedValue<number>;
  xValue: SharedValue<string>;
  yValue: SharedValue<number>;
  bottom: number;
  top: number;
  textColor: string;
  lineColor: string;
  indicatorColor: string;
  topOffset?: number;
}) => {
  const FONT_SIZE = 16;
  const font = useFont(require("@/assets/fonts/Inter-VariableFont_opsz,wght.ttf"), FONT_SIZE);
  const start = useDerivedValue(() => vec(xPosition.value, bottom));
  const end = useDerivedValue(() =>
    vec(xPosition.value, top + 1.5 * FONT_SIZE + topOffset),
  );

  // Text label
  const tempoDisplay = useDerivedValue(
    () => Math.floor(yValue.value).toString(),
  );
  const dateDisplay = useDerivedValue(
    () => xValue.value.split('T')[0],
  );

  const toolTipWidth = useDerivedValue(
    () =>
      font
        ?.getGlyphWidths?.(font.getGlyphIDs(dateDisplay.value))
        .reduce((sum, value) => sum + value, 0) || 0,
  );

  const dateX = useDerivedValue(
    () => xPosition.value - toolTipWidth.value / 2,
  );

  const dashEffect = Skia.PathEffect.MakeDash([10, 5], 0);
  const paint = Skia.Paint();
  paint.setPathEffect(dashEffect);

  return (
    <>
      <SkiaLine p1={start} p2={end} color={lineColor} strokeWidth={1} paint={paint} />
      <Circle cx={xPosition} cy={yPosition} r={10} color={indicatorColor} />
      <Circle
        cx={xPosition}
        cy={yPosition}
        r={8}
        color="hsla(0, 0, 100%, 0.25)"
      />
      <SkiaText
        color={textColor}
        font={font}
        text={dateDisplay}
        x={dateX}
        y={top + FONT_SIZE + topOffset}
      />
      <SkiaText
        color={textColor}
        font={font}
        text={tempoDisplay}
        x={dateX}
        y={top + 2 * FONT_SIZE + topOffset}
      />
    </>
  );
};
