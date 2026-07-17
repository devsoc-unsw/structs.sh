import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import { pigment, type PigmentOptions } from '@pigment-css/vite-plugin';
import { structsTheme } from './src/structsThemes';

const pigmentConfig: PigmentOptions = {
  transformLibraries: ['@mui/material'],
  theme: structsTheme,
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    ...(mode === 'production' ? [pigment(pigmentConfig)] : []),
    react(),
    checker({ typescript: true }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: { outDir: 'build' },
  server: { port: 3000 },
}));
