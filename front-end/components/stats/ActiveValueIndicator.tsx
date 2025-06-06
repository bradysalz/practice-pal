import { Circle, Skia, Line as SkiaLine, Text as SkiaText, useFont, vec } from "@shopify/react-native-skia";
import React from "react";
import { useDerivedValue, type SharedValue } from "react-native-reanimated";

interface ActiveValueIndicatorProps {
  xPosition: SharedValue<number>;
  yPosition: SharedValue<number>;
  xValue: SharedValue<string>;
  yValue: SharedValue<number>;
  bottom: number;
  top: number;
  textColor: string;
  lineColor: string;
  indicatorColor: string;
  label: string;
  topOffset?: number;
}

export const ActiveValueIndicator = ({
  xPosition,
  yPosition,
  top,
  bottom,
  xValue,
  yValue,
  textColor,
  lineColor,
  indicatorColor,
  label,
  topOffset = 0,
}: ActiveValueIndicatorProps) => {
  const FONT_SIZE = 16;
  const font = useFont(require("@/assets/fonts/Inter-VariableFont_opsz,wght.ttf"), FONT_SIZE);
  const start = useDerivedValue(() => vec(xPosition.value, bottom));
  const end = useDerivedValue(() =>
    vec(xPosition.value, top + 1.5 * FONT_SIZE + topOffset),
  );

  // Text label
  const valueDisplay = useDerivedValue(
    () => `${label}: ${Math.floor(yValue.value)}`,
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
        text={valueDisplay}
        x={dateX}
        y={top + 2 * FONT_SIZE + topOffset}
      />
    </>
  );
};
