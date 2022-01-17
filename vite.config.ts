import path from 'path';
import { Options, Output, transform } from '@swc/core';
import vue from '@vitejs/plugin-vue';
import { defineConfig, PluginOption } from 'vite';
import WindiCSS from 'vite-plugin-windicss';
import svgLoader from 'vite-svg-loader';

const swc = (options?: Options): PluginOption[] => [
  {
    name: 'vite-plugin-swc',
    enforce: 'pre',
    transform: async (code, id): Promise<Output> => {
      if (/\.(js|[tj]sx?)$/.test(id)) {
        return await transform(code, options);
      } else {
        return { code };
      }
    },
  },
];

export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    WindiCSS(),
    swc({
      jsc: {
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        target: 'es2022',
        transform: {
          decoratorMetadata: true,
        },
      },
    }),
  ],
  esbuild: false,
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
