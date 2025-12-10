import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      rollupOptions: {
        external: ['@google/genai'],
        output: {
          paths: {
            '@google/genai': 'https://esm.sh/@google/genai'
          }
        }
      }
    },
    server: {
      port: 3000
    }
  };
});