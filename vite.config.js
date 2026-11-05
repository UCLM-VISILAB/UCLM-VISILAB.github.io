import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  // Rutas relativas: la web funciona igual en la raíz del dominio o en una subcarpeta.
  base: './',
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 3000,
    host: true
  }
});

