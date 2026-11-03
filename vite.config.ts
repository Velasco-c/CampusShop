import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this project from /CampusShop/; keep local dev at /.
  base: process.env.GITHUB_ACTIONS === 'true' ? '/CampusShop/' : '/',
  server: { port: 5501 },
});
