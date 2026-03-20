// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://property360-2.github.io',
  base: '/quick-portfolio',
  integrations: [tailwind()]
});