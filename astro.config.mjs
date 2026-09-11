// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Set to your GitHub Pages domain
  site: 'https://property360-2.github.io', 
  base: '/quick-portfolio',
  integrations: [
    sitemap({
      // Exclude the human-readable HTML sitemap page itself
      filter: (page) => !page.endsWith('/sitemap/'),
    }),
  ],
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: 'favicon-base-fix',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/favicon.ico') {
              req.url = '/quick-portfolio/favicon.ico';
            }
            next();
          });
        },
      },
    ],
  },
});