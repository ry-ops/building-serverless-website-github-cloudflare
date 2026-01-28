# Blog Setup Example

This example demonstrates how to set up a blog with dynamic routes in Astro.

## Overview

The blog uses Astro's dynamic routing feature with the `[slug].astro` file pattern. This allows you to create multiple blog posts from a single template.

## File Structure

```
src/pages/blog/
└── [slug].astro    # Dynamic route for blog posts
```

## How It Works

### 1. Dynamic Route File

The `[slug].astro` file uses square brackets to indicate a dynamic parameter. Astro will generate a page for each value returned by `getStaticPaths()`.

### 2. getStaticPaths() Function

This function tells Astro which pages to generate:

```javascript
export function getStaticPaths() {
  return [
    {
      params: { slug: 'my-first-post' },
      props: {
        title: 'My First Post',
        date: '2026-01-27',
        content: '<p>Post content here</p>',
      },
    },
    // More posts...
  ];
}
```

### 3. Accessing Props

Inside your component, access the props like this:

```javascript
const { title, date, content } = Astro.props;
```

## Adding a New Blog Post

To add a new blog post, add another object to the array returned by `getStaticPaths()`:

```javascript
{
  params: { slug: 'new-post' },
  props: {
    title: 'New Post Title',
    date: '2026-01-28',
    content: '<p>Your content here</p>',
  },
}
```

This will generate a page at `/blog/new-post`.

## Using Markdown Files

For a more scalable approach, you can store blog posts in markdown files:

### Step 1: Create Content Directory

```
src/content/
└── blog/
    ├── post-1.md
    └── post-2.md
```

### Step 2: Update getStaticPaths()

```javascript
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
```

### Step 3: Configure Content Collections

Create `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
  }),
});

export const collections = { blog };
```

## Best Practices

1. **Use descriptive slugs** - Make URLs readable and SEO-friendly
2. **Include metadata** - Add title, date, description, and tags
3. **Validate content** - Use content collections with schemas
4. **Organize files** - Keep blog posts in a dedicated directory
5. **Add pagination** - For blogs with many posts

## Resources

- [Astro Dynamic Routes](https://docs.astro.build/en/core-concepts/routing/#dynamic-routes)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Markdown in Astro](https://docs.astro.build/en/guides/markdown-content/)
