# API Routes Example

This example shows how to create serverless API endpoints in Astro.

## Overview

Astro supports API routes (also called endpoints) that can handle server-side logic and return JSON, XML, or other data formats. These run as serverless functions on Cloudflare Pages.

## Creating an API Route

Create a file in `src/pages/api/` with a `.js` or `.ts` extension:

```
src/pages/api/
├── hello.js
├── posts.json.js
└── contact.ts
```

## Basic Example

Create `src/pages/api/hello.js`:

```javascript
export async function GET({ params, request }) {
  return new Response(JSON.stringify({
    message: 'Hello from the API!',
    timestamp: new Date().toISOString(),
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
```

Access at: `https://yoursite.com/api/hello`

## HTTP Methods

Support different HTTP methods:

```javascript
// GET request
export async function GET({ request }) {
  return new Response(JSON.stringify({ method: 'GET' }));
}

// POST request
export async function POST({ request }) {
  const data = await request.json();
  return new Response(JSON.stringify({
    method: 'POST',
    received: data,
  }));
}

// PUT, DELETE, PATCH, etc.
export async function PUT({ request }) { /* ... */ }
export async function DELETE({ request }) { /* ... */ }
```

## Dynamic API Routes

Use dynamic parameters in API routes:

Create `src/pages/api/posts/[id].js`:

```javascript
const posts = {
  '1': { id: 1, title: 'First Post', content: 'Hello world' },
  '2': { id: 2, title: 'Second Post', content: 'Another post' },
};

export async function GET({ params }) {
  const post = posts[params.id];

  if (!post) {
    return new Response(JSON.stringify({ error: 'Post not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(post), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

Access at: `https://yoursite.com/api/posts/1`

## Form Handling Example

Create `src/pages/api/contact.js`:

```javascript
export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Validate input
    if (!name || !email || !message) {
      return new Response(JSON.stringify({
        error: 'All fields are required',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Process the form (send email, save to database, etc.)
    // For this example, we'll just return success

    return new Response(JSON.stringify({
      success: true,
      message: 'Thank you for your message!',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal server error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
```

## CORS Configuration

Enable CORS for cross-origin requests:

```javascript
export async function GET({ request }) {
  const data = { message: 'CORS enabled' };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

## Using Environment Variables

Access environment variables in API routes:

```javascript
export async function GET({ request }) {
  const apiKey = import.meta.env.API_KEY;

  // Use the API key for external service calls
  const response = await fetch('https://api.example.com/data', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

## Cloudflare Pages Considerations

When deploying to Cloudflare Pages:

1. **Functions are serverless** - Each request starts fresh
2. **Cold starts** - First request may be slower
3. **Execution limits** - Max 15-second execution time
4. **No persistent storage** - Use external services for data
5. **Environment variables** - Set in Cloudflare dashboard

## Best Practices

1. **Validate input** - Always validate and sanitize user input
2. **Error handling** - Use try-catch blocks and return appropriate status codes
3. **Security** - Never expose sensitive data or credentials
4. **Rate limiting** - Implement rate limiting for public APIs
5. **Caching** - Use appropriate cache headers for performance

## Example: Complete API Endpoint

```javascript
// src/pages/api/users/[id].ts
import type { APIRoute } from 'astro';

interface User {
  id: string;
  name: string;
  email: string;
}

const users: Record<string, User> = {
  '1': { id: '1', name: 'John Doe', email: 'john@example.com' },
  '2': { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
};

export const GET: APIRoute = async ({ params }) => {
  const user = users[params.id || ''];

  if (!user) {
    return new Response(JSON.stringify({
      error: 'User not found',
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=3600',
    },
  });
};
```

## Resources

- [Astro Endpoints](https://docs.astro.build/en/core-concepts/endpoints/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [Web APIs on MDN](https://developer.mozilla.org/en-US/docs/Web/API)
