import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // Listen on all interfaces
    port: 5173,      // Ensure the port matches
    https: false,    // Disable HTTPS and SSL verification
    proxy: {
      '/api': {
        target: 'https://women-safety-gwwe.onrender.com',
        changeOrigin:true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
