// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Palitan mo ito ng iyong totoong domain mamaya (hal. https://www.iyongdomain.com)
  site: 'https://quick-portfolio.vercel.app', 
  base: '/quick-portfolio',
  vite: {
    plugins: [tailwindcss()],
  },
});