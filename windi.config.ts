import { defineConfig } from 'windicss/helpers';
import { COLORS } from './src/vars/colors';

const colors = Object.keys(COLORS)
  .map(name => name.toLowerCase())
  .reduce((result, name) => ({
    ...result,
    [name]: `var(--color-${name})`,
  }), {});

export default defineConfig({
  theme: {
    colors,
    fontFamily: {
      cursive: ['Pacifico', 'cursive'],
      sans: ['Itim', 'sans-serif'],
    },
    extend: {
      spacing: {
        full: '100%',
      },
    },
  },
});
