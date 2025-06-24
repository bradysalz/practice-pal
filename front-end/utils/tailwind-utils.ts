import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import colors from 'tailwindcss/colors';
import tailwindConfig from '../tailwind.config.js';

type TailwindConfig = {
  theme: {
    extend: {
      colors: {
        [key: string]:
          | {
              DEFAULT: string;
              foreground?: string;
            }
          | string;
      };
    };
  };
};

const config = tailwindConfig as TailwindConfig;

// Extract CSS variable names from tailwind config
const cssVariables = Object.keys(config.theme.extend.colors).filter(
  (key) =>
    typeof config.theme.extend.colors[key] === 'object' &&
    'DEFAULT' in config.theme.extend.colors[key]
);

// Helper function to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const r = Math.round(f(0) * 255);
  const g = Math.round(f(8) * 255);
  const b = Math.round(f(4) * 255);

  return `rgb(${r}, ${g}, ${b})`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolves a Tailwind color token like "red-500" or "slate-300" to its hex value.
 * Also supports CSS custom properties like "primary", "secondary", "accent".
 * Supports direct hex codes as passthrough.
 */
export function getTailwindColor(colorToken: string): string | undefined {
  // Handle CSS custom properties
  if (cssVariables.includes(colorToken)) {
    const colorValue = config.theme.extend.colors[colorToken];
    if (typeof colorValue === 'object' && 'DEFAULT' in colorValue) {
      const value = colorValue.DEFAULT;

      // If it's already a hex or rgb value, return it directly
      if (value.startsWith('#') || value.startsWith('rgb')) {
        return value;
      }

      // Try to parse HSL value
      const match = value.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
      if (match) {
        const [, h, s, l] = match;
        return hslToRgb(Number(h), Number(s), Number(l));
      }
    }
  }

  // Lazily handle the easy ones
  if (colorToken === 'white' || colorToken === 'black') {
    return colorToken;
  }

  if (colorToken.startsWith('#')) {
    return colorToken;
  }

  if (colorToken.includes('-')) {
    const [colorName, shadeStr] = colorToken.split('-');

    const colorGroup = colors[colorName as keyof typeof colors];

    if (colorGroup && typeof colorGroup === 'object' && shadeStr in colorGroup) {
      return colorGroup[shadeStr as keyof typeof colorGroup];
    } else if (typeof colorGroup === 'string') {
      // for colors like 'white', 'black', etc.
      return colorGroup;
    }
  }

  // fallback to undefined if invalid
  return undefined;
}
