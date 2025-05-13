import { Platform } from 'react-native';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import colors from 'tailwindcss/colors';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolves a Tailwind color token like "red-500" or "slate-300" to its hex value.
 * Supports direct hex codes as passthrough.
 */
export function getTailwindColor(colorToken: string): string | undefined {
  // Lazily handle the easy ones
  if (colorToken === 'white' || colorToken === 'black') {
    return colorToken;
  }

  if (Platform.OS === 'web') {
    // On web, just return the Tailwind class name as a string
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
