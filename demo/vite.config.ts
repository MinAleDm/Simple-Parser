import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isCiBuild = process.env.GITHUB_ACTIONS === 'true';
const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: isCiBuild && repositoryName ? `/${repositoryName}/` : '/',
  resolve: {
    alias: {
      'simple-parser': path.resolve(rootDirectory, '../core/src/index.ts')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
