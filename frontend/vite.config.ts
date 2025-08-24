import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
      '~backend/client': path.resolve(__dirname, './client'),
      '~backend': path.resolve(__dirname, '../backend'),
    },
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
  mode: "production",
  build: {
    minify: true,
    cssCodeSplit: true,
    sourcemap: false,
    target: "esnext",
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "@tanstack/react-query"],
    esbuildOptions: {
      keepNames: true,
    },
  },
})
