import { readdirSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// El navegador no puede listar carpetas en GitHub Pages, así que la lista de
// public/media se genera al compilar. src/data/presentations.js la usa como fuente.
function mediaFiles() {
  const id = 'virtual:media-files';
  const resolvedId = `\0${id}`;

  return {
    name: 'media-files',
    resolveId(source) {
      if (source === id) return resolvedId;
    },
    load(loadedId) {
      if (loadedId !== resolvedId) return;
      const files = readdirSync('public/media', { recursive: true })
        .map((file) => file.replaceAll('\\', '/'))
        .sort();
      return `export default ${JSON.stringify(files)};`;
    },
    // En desarrollo, recarga la página al añadir o quitar archivos.
    configureServer(server) {
      const handleChange = (file) => {
        if (!file.includes('public/media/')) return;
        const module = server.moduleGraph.getModuleById(resolvedId);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', handleChange);
      server.watcher.on('unlink', handleChange);
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  // Rutas relativas: la web funciona igual en la raíz del dominio o en una subcarpeta.
  base: './',
  plugins: [
    mediaFiles(),
    react(),
    tailwindcss()
  ],
  server: {
    port: 3000,
    host: true
  }
});

