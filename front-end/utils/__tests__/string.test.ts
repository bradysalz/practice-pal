import { toRomanNumeral } from '@/utils/string';
import { maybeTrimString } from '../string';

describe('maybeTrimString', () => {
  test('truncates string longer than maxLength', () => {
    expect(maybeTrimString('Hello World', 5)).toBe('Hello...');
  });

  test('returns original string if shorter than maxLength', () => {
    expect(maybeTrimString('Hi', 5)).toBe('Hi');
  });

  test('returns original string if equal to maxLength', () => {
    expect(maybeTrimString('Hello', 5)).toBe('Hello');
  });

  test('handles null and undefined', () => {
    expect(maybeTrimString(null)).toBeUndefined();
    expect(maybeTrimString(undefined)).toBeUndefined();
  });
});

describe('toRomanNumeral', () => {
  test('converts basic numbers to roman numerals', () => {
    expect(toRomanNumeral(1)).toBe('I');
    expect(toRomanNumeral(5)).toBe('V');
    expect(toRomanNumeral(10)).toBe('X');
    expect(toRomanNumeral(50)).toBe('L');
    expect(toRomanNumeral(100)).toBe('C');
    expect(toRomanNumeral(500)).toBe('D');
    expect(toRomanNumeral(1000)).toBe('M');
  });

  test('converts compound numbers to roman numerals', () => {
    expect(toRomanNumeral(2)).toBe('II');
    expect(toRomanNumeral(3)).toBe('III');
    expect(toRomanNumeral(4)).toBe('IV');
    expect(toRomanNumeral(6)).toBe('VI');
    expect(toRomanNumeral(7)).toBe('VII');
    expect(toRomanNumeral(8)).toBe('VIII');
    expect(toRomanNumeral(9)).toBe('IX');
  });

  test('converts larger numbers to roman numerals', () => {
    expect(toRomanNumeral(15)).toBe('XV');
    expect(toRomanNumeral(20)).toBe('XX');
    expect(toRomanNumeral(25)).toBe('XXV');
    expect(toRomanNumeral(30)).toBe('XXX');
    expect(toRomanNumeral(40)).toBe('XL');
    expect(toRomanNumeral(45)).toBe('XLV');
    expect(toRomanNumeral(49)).toBe('XLIX');
  });

  test('handles edge cases', () => {
    expect(toRomanNumeral(0)).toBe('0');
    expect(toRomanNumeral(-1)).toBe('-1');
    expect(toRomanNumeral(4000)).toBe('4000');
  });
});
