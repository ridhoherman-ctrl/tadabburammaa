import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // This allows the app to access process.env.API_KEY even in the browser
      // Vercel injects env vars at build time
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    server: {
      port: 3000
    }
  };
});