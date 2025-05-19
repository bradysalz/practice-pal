import { getTailwindColor } from '@/lib/utils/tailwind-utils';
import { Platform } from 'react-native';
import colors from 'tailwindcss/colors';

describe('getTailwindColor', () => {
  const originalPlatform = Platform.OS;

  afterEach(() => {
    // Reset Platform after each test
    Object.defineProperty(Platform, 'OS', {
      value: originalPlatform,
    });
  });

  it('returns same hex value if already a hex code', () => {
    expect(getTailwindColor('#123456')).toBe('#123456');
  });

  it('returns direct string values for white/black', () => {
    expect(getTailwindColor('white')).toBe('white');
    expect(getTailwindColor('black')).toBe('black');
  });

  it('returns color token as-is on web', () => {
    Object.defineProperty(Platform, 'OS', { value: 'web' });
    expect(getTailwindColor('red-500')).toBe('red-500');
  });

  it('resolves known color tokens on native', () => {
    Object.defineProperty(Platform, 'OS', { value: 'ios' });
    expect(getTailwindColor('red-500')).toBe(colors.red['500']);
    expect(getTailwindColor('slate-300')).toBe(colors.slate['300']);
  });

  it('returns undefined for unknown tokens', () => {
    Object.defineProperty(Platform, 'OS', { value: 'android' });
    expect(getTailwindColor('wat-999')).toBeUndefined();
    expect(getTailwindColor('blurple')).toBeUndefined();
  });
});
