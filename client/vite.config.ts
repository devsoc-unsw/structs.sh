import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';
import { pigment } from '@pigment-css/vite-plugin';
import { structsTheme } from './src/structsThemes';

/**
 * @type {import('@pigment-css/vite-plugin').PigmentOptions}
 */
const pigmentConfig = {
  transformLibraries: ['@mui/material'],
  theme: structsTheme
};

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['@mui/material/Tooltip'],
  },
  plugins: [
    pigment(pigmentConfig),
    react(),
    tsconfigPaths(),
    checker({ typescript: true }),
  ],
  build: { outDir: 'build' },
  server: { port: 3000 },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
