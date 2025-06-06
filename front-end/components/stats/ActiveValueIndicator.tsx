import { Circle, Skia, Line as SkiaLine, Text as SkiaText, useFont, vec } from "@shopify/react-native-skia";
import React from "react";
import { useDerivedValue, type SharedValue } from "react-native-reanimated";

interface ActiveValueIndicatorProps {
  xPosition: SharedValue<number>;
  yPosition: SharedValue<number>;
  xValue: SharedValue<number>;
  yValue: SharedValue<number>;
  y2Position?: SharedValue<number>;
  y2Value?: SharedValue<number>;
  bottom: number;
  top: number;
  textColor: string;
  lineColor: string;
  indicatorColor: string;
  indicatorColor2?: string;
  label: string;
  label2?: string;
  topOffset?: number;
}

export const ActiveValueIndicator = ({
  xPosition,
  yPosition,
  top,
  bottom,
  xValue,
  yValue,
  y2Position,
  y2Value,
  textColor,
  lineColor,
  indicatorColor,
  indicatorColor2,
  label,
  label2,
  topOffset = 0,
}: ActiveValueIndicatorProps) => {
  const FONT_SIZE = 16;
  const font = useFont(require("@/assets/fonts/Inter-VariableFont_opsz,wght.ttf"), FONT_SIZE);
  const start = useDerivedValue(() => vec(xPosition.value, bottom));
  const end = useDerivedValue(() =>
    vec(xPosition.value, top + (y2Position ? 3.5 : 2.5) * FONT_SIZE + topOffset),
  );

  // Text label
  const valueDisplay = useDerivedValue(
    () => `${label}: ${Math.floor(yValue.value)}`,
  );
  const value2Display = useDerivedValue(
    () => y2Value ? `${label2}: ${Math.floor(y2Value.value)}` : "",
  );
  const dateDisplay = useDerivedValue(
    () => new Date(xValue.value).toLocaleDateString(),
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
      {y2Position && (
        <>
          <Circle cx={xPosition} cy={y2Position} r={10} color={indicatorColor2 || indicatorColor} />
          <Circle
            cx={xPosition}
            cy={y2Position}
            r={8}
            color="hsla(0, 0, 100%, 0.25)"
          />
        </>
      )}
      <SkiaText
        color={textColor}
        font={font}
        text={dateDisplay}
        x={dateX}
        y={top + FONT_SIZE + topOffset}
      />
      <SkiaText
        color={indicatorColor}
        font={font}
        text={valueDisplay}
        x={dateX}
        y={top + 2 * FONT_SIZE + topOffset}
      />
      {y2Value && (
        <SkiaText
          color={indicatorColor2 || indicatorColor}
          font={font}
          text={value2Display}
          x={dateX}
          y={top + 3 * FONT_SIZE + topOffset}
        />
      )}
    </>
  );
};
