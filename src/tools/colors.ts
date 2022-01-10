import { COLORS } from '@/vars/colors';

const toHexColor = (value: number): string => {
  const parsed = value.toString(16);
  const diff = 6 - parsed.length;
  return `#${'0'.repeat(diff)}${parsed}`;
};

export const makeColors = (): string => {
  const entries = Object.entries(COLORS);
  const variables = entries.map(([name, value]) => {
    return `--color-${name.toLowerCase()}: ${toHexColor(value)};`;
  });

  const styles = [':root {', ...variables.map(item => '\t' + item), '}'];
  return styles.join('\n') + '\n';
};
