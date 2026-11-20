import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'pdf-lib': path.resolve(__dirname, '../node_modules/pdf-lib/dist/pdf-lib.esm.js'),
    },
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-icons': ['lucide-react'],
          'vendor-pdf': ['pdf-lib'],
          'vendor-zip': ['jszip'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
