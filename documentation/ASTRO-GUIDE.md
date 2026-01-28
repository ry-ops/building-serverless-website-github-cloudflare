# Astro Framework Guide

Complete guide to working with Astro for building fast, modern websites.

## Table of Contents

- [What is Astro?](#what-is-astro)
- [Project Structure](#project-structure)
- [Pages and Routing](#pages-and-routing)
- [Components](#components)
- [Layouts](#layouts)
- [Styling](#styling)
- [Content Collections](#content-collections)
- [API Routes](#api-routes)
- [Best Practices](#best-practices)

## What is Astro?

Astro is a modern web framework designed for building fast, content-focused websites. Key features:

- **Zero JS by default** - Ships only the JavaScript you need
- **Component islands** - Hydrate interactive components selectively
- **Framework agnostic** - Use React, Vue, Svelte, or plain HTML
- **Static-first** - Generates static HTML for best performance
- **Built-in optimizations** - Automatic image optimization, CSS bundling

## Project Structure

```
/
├── public/              # Static assets (images, fonts, etc.)
│   └── favicon.svg
├── src/
│   ├── components/      # Reusable components
│   │   ├── Header.astro
│   │   └── Footer.astro
│   ├── layouts/         # Page layouts
│   │   └── Layout.astro
│   ├── pages/           # File-based routing
│   │   ├── index.astro
│   │   ├── about.astro
│   │   └── blog/
│   │       └── [slug].astro
│   ├── content/         # Content collections (optional)
│   │   └── blog/
│   ├── styles/          # Global styles
│   └── env.d.ts         # TypeScript environment types
├── astro.config.mjs     # Astro configuration
├── package.json
└── tsconfig.json
```

## Pages and Routing

### File-Based Routing

Astro uses file-based routing. Files in `src/pages/` become routes:

```
src/pages/
├── index.astro          → /
├── about.astro          → /about
├── blog/
│   ├── index.astro      → /blog
│   └── post-1.astro     → /blog/post-1
└── api/
    └── hello.js         → /api/hello
```

### Creating a Page

```astro
---
// src/pages/about.astro
import Layout from '../layouts/Layout.astro';

const pageTitle = "About Us";
---

<Layout title={pageTitle}>
  <h1>About Our Site</h1>
  <p>This is the about page.</p>
</Layout>
```

### Dynamic Routes

Use square brackets for dynamic parameters:

```astro
---
// src/pages/blog/[slug].astro
export function getStaticPaths() {
  return [
    { params: { slug: 'first-post' } },
    { params: { slug: 'second-post' } },
  ];
}

const { slug } = Astro.params;
---

<h1>Post: {slug}</h1>
```

### Nested Dynamic Routes

```
src/pages/
└── [lang]/
    └── [category]/
        └── [slug].astro
```

Access all parameters:

```astro
---
const { lang, category, slug } = Astro.params;
---
```

## Components

### Basic Component

```astro
---
// src/components/Card.astro
interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<div class="card">
  <h3>{title}</h3>
  <p>{description}</p>
</div>

<style>
  .card {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
</style>
```

### Using Components

```astro
---
import Card from '../components/Card.astro';
---

<Card
  title="Hello"
  description="This is a card component"
/>
```

### Component Slots

```astro
---
// src/components/Container.astro
---

<div class="container">
  <slot /> <!-- Default slot -->
</div>
```

Named slots:

```astro
---
// src/components/Layout.astro
---

<div>
  <header>
    <slot name="header" />
  </header>
  <main>
    <slot /> <!-- Default slot -->
  </main>
  <footer>
    <slot name="footer" />
  </footer>
</div>
```

Usage:

```astro
<Layout>
  <h1 slot="header">Page Title</h1>
  <p>Main content</p>
  <p slot="footer">Footer content</p>
</Layout>
```

## Layouts

### Creating a Layout

```astro
---
// src/layouts/Layout.astro
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Nested Layouts

```astro
---
// src/layouts/BlogLayout.astro
import Layout from './Layout.astro';

interface Props {
  title: string;
  date: string;
}

const { title, date } = Astro.props;
---

<Layout title={title}>
  <article>
    <header>
      <h1>{title}</h1>
      <time>{date}</time>
    </header>
    <slot />
  </article>
</Layout>
```

## Styling

### Component Styles

Scoped by default:

```astro
<div class="card">
  <h2>Title</h2>
</div>

<style>
  .card {
    /* Scoped to this component */
    padding: 1rem;
  }
</style>
```

### Global Styles

Use `is:global`:

```astro
<style is:global>
  body {
    margin: 0;
    font-family: system-ui;
  }
</style>
```

### Tailwind CSS

Already configured in this project:

```astro
<div class="bg-blue-500 text-white p-4 rounded">
  Tailwind works!
</div>
```

### CSS Imports

```astro
---
import '../styles/global.css';
---
```

## Content Collections

### Define Collections

Create `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
```

### Add Content

Create `src/content/blog/first-post.md`:

```markdown
---
title: "My First Post"
description: "This is my first blog post"
publishDate: 2026-01-27
tags: ["astro", "blogging"]
---

# My First Post

Content goes here...
```

### Query Collections

```astro
---
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
---

<ul>
  {posts.map(post => (
    <li>
      <a href={`/blog/${post.slug}`}>
        {post.data.title}
      </a>
    </li>
  ))}
</ul>
```

### Render Content

```astro
---
import { getEntry } from 'astro:content';

const post = await getEntry('blog', Astro.params.slug);
const { Content } = await post.render();
---

<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

## API Routes

### Creating Endpoints

```javascript
// src/pages/api/posts.json.js
export async function GET({ params, request }) {
  const posts = [
    { id: 1, title: 'First Post' },
    { id: 2, title: 'Second Post' },
  ];

  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
```

### Multiple HTTP Methods

```typescript
// src/pages/api/user.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  return new Response(JSON.stringify({ method: 'GET' }));
};

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  return new Response(JSON.stringify({ method: 'POST', data }));
};
```

## Data Fetching

### At Build Time

```astro
---
const response = await fetch('https://api.example.com/data');
const data = await response.json();
---

<div>{data.title}</div>
```

### With Environment Variables

```astro
---
const apiKey = import.meta.env.API_KEY;
const response = await fetch('https://api.example.com/data', {
  headers: {
    'Authorization': `Bearer ${apiKey}`,
  },
});
---
```

## Client-Side Interactivity

### Client Directives

Load JavaScript only when needed:

```astro
---
import Counter from './Counter.jsx';
---

<!-- Load immediately -->
<Counter client:load />

<!-- Load when visible -->
<Counter client:visible />

<!-- Load when idle -->
<Counter client:idle />

<!-- Only client-side -->
<Counter client:only="react" />
```

### Inline Scripts

```astro
<button id="btn">Click me</button>

<script>
  document.getElementById('btn').addEventListener('click', () => {
    alert('Clicked!');
  });
</script>
```

## Environment Variables

### Define Variables

Create `.env`:

```
PUBLIC_API_URL=https://api.example.com
SECRET_KEY=abc123
```

### Access Variables

```astro
---
// Available in browser (prefixed with PUBLIC_)
const apiUrl = import.meta.env.PUBLIC_API_URL;

// Server-only (no PUBLIC_ prefix)
const secretKey = import.meta.env.SECRET_KEY;
---
```

### TypeScript Types

Update `src/env.d.ts`:

```typescript
interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string;
  readonly SECRET_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## Best Practices

### 1. Component Organization

```
src/components/
├── ui/              # UI components
│   ├── Button.astro
│   └── Card.astro
├── layout/          # Layout components
│   ├── Header.astro
│   └── Footer.astro
└── sections/        # Page sections
    ├── Hero.astro
    └── Features.astro
```

### 2. Type Safety

Use TypeScript for props:

```astro
---
interface Props {
  title: string;
  count?: number;
}

const { title, count = 0 } = Astro.props;
---
```

### 3. Performance

- Keep JavaScript minimal
- Use `client:visible` for below-the-fold components
- Optimize images with Astro's image component
- Enable build caching

### 4. SEO

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout
  title="Page Title - Site Name"
  description="Page description for SEO"
>
  <h1>Content</h1>
</Layout>
```

### 5. Code Reusability

Extract repeated logic into utilities:

```typescript
// src/utils/formatDate.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
```

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview
npm run preview

# Type check
npm run astro check
```

## Configuration

### astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static', // or 'server' for SSR
  site: 'https://example.com',
  build: {
    format: 'file', // or 'directory'
  },
});
```

## Resources

- [Astro Documentation](https://docs.astro.build)
- [Astro Discord](https://astro.build/chat)
- [Astro GitHub](https://github.com/withastro/astro)
- [Astro Themes](https://astro.build/themes)
