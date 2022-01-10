import path from 'path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import WindiCSS from 'vite-plugin-windicss';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    WindiCSS(),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  define: {
    __IS_DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
});
