import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
    },
    plugins: [react()],
    build: {
      sourcemap: false, // Disable sourcemaps for production
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            icons: ['lucide-react'],
            charts: ['recharts'],
            ai: ['@google/generative-ai']
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    }
  };
});
