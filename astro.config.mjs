// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Set to your GitHub Pages domain
  site: 'https://property360-2.github.io', 
  base: '/quick-portfolio',
  vite: {
    plugins: [tailwindcss()],
  },
});