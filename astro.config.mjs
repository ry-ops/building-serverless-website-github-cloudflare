import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://your-site.pages.dev',
  build: {
    format: 'file'
  }
});
