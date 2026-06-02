// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  server: {
    port: 1234,
    headers: [
      {
        key: 'Access-Control-Allow-Private-Network',
        value: 'true'
      }
    ]
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});
