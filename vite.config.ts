import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Declare process for TS since this is a node file
declare const process: any;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode (development/production)
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    // Konfigurasi build standar, tidak perlu external paths karena kita install via npm
    build: {
      outDir: 'dist',
    },
    server: {
      port: 3000
    }
  };
});