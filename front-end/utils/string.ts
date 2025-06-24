/**
 * Trims a string to a maximum length and adds ellipsis if needed
 * @param str The string to potentially trim
 * @param maxLength The maximum length before trimming (default: 25)
 * @returns The original string if under maxLength, or trimmed string with ellipsis
 */
export function maybeTrimString(str?: string | null, maxLength = 25): string | undefined {
  if (!str) return undefined;
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}

export function toRomanNumeral(num: number): string {
  if (num <= 0 || num > 3999) {
    return num.toString();
  }

  const romanNumerals = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' },
  ];

  let result = '';
  let remaining = num;

  for (const { value, numeral } of romanNumerals) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }

  return result;
}
