// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://astro.jesspete.shop',
  output: 'static',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Poppins',
      cssVariable: '--font-poppins',
      weights: ['500', '600', '700'],
      styles: ['normal'],
    },
    {
      provider: fontProviders.google(),
      name: 'Newsreader',
      cssVariable: '--font-newsreader',
      weights: ['300', '400', '600'],
      styles: ['normal', 'italic'],
    },
  ],
});
