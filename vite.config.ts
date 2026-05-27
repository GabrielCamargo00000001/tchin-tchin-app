import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Tchin Tchin — Vite config.
// The ported prototype lives in src/legacy as .jsx modules (allowJs); new
// scaffolding (entry, types) is TypeScript. The React plugin runs Babel so the
// classic React.* API used throughout the prototype keeps working.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
  preview: { port: 5173 },
  build: { outDir: 'dist', chunkSizeWarningLimit: 4000 },
});
