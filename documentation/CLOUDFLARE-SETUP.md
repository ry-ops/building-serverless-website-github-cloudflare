# Cloudflare Pages Setup Guide

Complete guide to configuring and deploying your site on Cloudflare Pages.

## Table of Contents

- [Introduction](#introduction)
- [Account Setup](#account-setup)
- [Project Configuration](#project-configuration)
- [Environment Variables](#environment-variables)
- [Custom Domains](#custom-domains)
- [Functions](#functions)
- [Analytics](#analytics)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)

## Introduction

Cloudflare Pages is a JAMstack platform for deploying static sites and serverless functions. Benefits include:

- **Global CDN** - Deploy to 275+ cities worldwide
- **Zero configuration** - Works out of the box
- **Automatic SSL** - Free SSL certificates
- **Unlimited bandwidth** - No limits on traffic
- **DDoS protection** - Built-in security
- **Preview deployments** - Every PR gets a preview URL
- **Edge functions** - Run serverless code at the edge

## Account Setup

### 1. Create Cloudflare Account

1. Go to [cloudflare.com](https://cloudflare.com)
2. Click "Sign Up"
3. Enter your email and create a password
4. Verify your email address

### 2. Access Dashboard

1. Log in to your account
2. Navigate to the dashboard
3. Note your Account ID (needed for deployment)

### 3. Get Account ID

**Method 1: Via Dashboard**
- Click on your account name (top right)
- Select "Account Home"
- Account ID is displayed on the right

**Method 2: Via URL**
- Your dashboard URL contains your account ID:
- `https://dash.cloudflare.com/[ACCOUNT_ID]`

### 4. Create API Token

1. Go to Profile > API Tokens
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template
4. Configure permissions:
   - Account > Cloudflare Pages > Edit
5. Set account resources:
   - Include > Specific account > Your account
6. Set IP filtering (optional but recommended)
7. Set TTL (token expiration)
8. Click "Continue to summary"
9. Review and create token
10. **Copy the token immediately** (shown only once)

## Project Configuration

### Create New Project

**Via Dashboard:**

1. Go to Pages in your Cloudflare Dashboard
2. Click "Create a project"
3. Select "Direct Upload" for GitHub Actions
4. Enter project name (e.g., `my-website`)
5. Click "Create project"

**Via Wrangler CLI:**

```bash
npm install -g wrangler
wrangler login
wrangler pages project create my-website
```

### Build Settings

Configure in your GitHub Actions workflow:

```yaml
- uses: cloudflare/pages-action@v1
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    projectName: my-website
    directory: dist
    gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### Build Configuration

For Astro projects:

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node version**: 20 (configured in workflow)

### Branch Configuration

**Production branch**: `main`
- Deploys to production URL: `my-website.pages.dev`

**Preview branches**: Any other branch
- Deploys to preview URL: `[branch].my-website.pages.dev`

## Environment Variables

### Types of Variables

1. **Production** - Used in production deployments
2. **Preview** - Used in preview deployments

### Adding Variables via Dashboard

1. Go to your Pages project
2. Click "Settings" > "Environment variables"
3. Click "Add variable"
4. Enter name and value
5. Select environment (Production/Preview)
6. Click "Save"

### Common Variables

```bash
# Public variables (available in browser)
PUBLIC_API_URL=https://api.example.com
PUBLIC_SITE_URL=https://mysite.com

# Private variables (server-only)
DATABASE_URL=postgresql://...
API_SECRET_KEY=abc123
STRIPE_SECRET_KEY=sk_live_...
```

### Accessing Variables

In Astro components:

```astro
---
// Public variables (browser-safe)
const apiUrl = import.meta.env.PUBLIC_API_URL;

// Private variables (server-only)
const dbUrl = import.meta.env.DATABASE_URL;
---
```

In API routes:

```javascript
export async function GET() {
  const apiKey = process.env.API_SECRET_KEY;
  // Use the API key...
}
```

### Best Practices

1. **Never commit secrets** to version control
2. **Use PUBLIC_ prefix** for client-safe variables
3. **Rotate keys regularly** for security
4. **Use different values** for preview and production
5. **Document required variables** in README

## Custom Domains

### Add Custom Domain

1. Go to your Pages project
2. Click "Custom domains"
3. Click "Set up a custom domain"
4. Enter your domain (e.g., `example.com`)
5. Follow DNS configuration steps

### DNS Configuration

**If domain is on Cloudflare:**

1. Cloudflare automatically adds required records
2. SSL certificate is provisioned automatically
3. Wait a few minutes for activation

**If domain is elsewhere:**

1. Add CNAME record:
   - Name: `@` or `www`
   - Value: `your-project.pages.dev`
2. Wait for DNS propagation (up to 48 hours)
3. Return to Cloudflare to verify

### SSL/TLS Configuration

1. Go to SSL/TLS settings
2. Select encryption mode:
   - **Full (strict)** - Recommended for Pages
3. Enable "Always Use HTTPS"
4. Enable "Automatic HTTPS Rewrites"

### Subdomains

Add multiple subdomains:

```
www.example.com → your-project.pages.dev
blog.example.com → your-project.pages.dev
app.example.com → your-project.pages.dev
```

### Apex Domain vs WWW

Configure redirects:

1. Add both `example.com` and `www.example.com`
2. Set primary domain in Pages settings
3. Enable automatic redirects

## Functions

### What are Pages Functions?

Serverless functions that run on Cloudflare's edge network. Perfect for:

- API endpoints
- Form submissions
- Authentication
- Data fetching
- Server-side rendering

### Creating Functions

Place functions in `/functions` directory:

```
/functions
├── api/
│   ├── hello.js
│   └── users/
│       └── [id].js
└── _middleware.js
```

### Basic Function

```javascript
// functions/api/hello.js
export async function onRequest(context) {
  return new Response(JSON.stringify({
    message: 'Hello from Cloudflare Pages!',
    timestamp: new Date().toISOString(),
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
```

### HTTP Methods

```javascript
// Handle different methods
export async function onRequestGet(context) {
  return new Response('GET request');
}

export async function onRequestPost(context) {
  const data = await context.request.json();
  return new Response(JSON.stringify(data));
}
```

### Dynamic Routes

```javascript
// functions/api/users/[id].js
export async function onRequest(context) {
  const userId = context.params.id;
  return new Response(`User ID: ${userId}`);
}
```

### Middleware

```javascript
// functions/_middleware.js
export async function onRequest(context) {
  // Add custom headers
  const response = await context.next();
  response.headers.set('X-Custom-Header', 'Value');
  return response;
}
```

### Environment Variables in Functions

```javascript
export async function onRequest(context) {
  const apiKey = context.env.API_KEY;
  // Use the API key...
}
```

### Limitations

- **Max execution time**: 15 seconds
- **Max request size**: 100 MB
- **No persistent storage**: Use external services
- **Cold starts**: First request may be slower

## Analytics

### Web Analytics

**Setup:**

1. Go to Analytics > Web Analytics
2. Click "Add a site"
3. Enter your site URL
4. Copy the beacon script
5. Add to your site's `<head>`

```astro
---
// src/layouts/Layout.astro
---

<head>
  <!-- Cloudflare Web Analytics -->
  <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
          data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
</head>
```

**Features:**

- Page views and unique visitors
- Geographic distribution
- Traffic sources
- Device and browser stats
- Privacy-focused (no cookies)
- Free and unlimited

### Performance Metrics

View in Dashboard:

- **Requests** - Total requests served
- **Bandwidth** - Data transferred
- **Cache hit ratio** - Percentage served from cache
- **Response time** - Average latency

## Performance

### Caching

**Automatic caching:**

- Static assets cached by default
- HTML cached with smart invalidation
- API responses can be cached with headers

**Custom cache headers:**

```javascript
export async function GET() {
  return new Response(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
```

### Asset Optimization

**Automatic optimizations:**

- Brotli compression
- HTTP/2 and HTTP/3
- Early hints
- Auto minify (HTML, CSS, JS)

**Enable in Cloudflare:**

1. Go to Speed > Optimization
2. Enable:
   - Auto Minify (CSS, JavaScript, HTML)
   - Brotli compression
   - Early Hints

### Image Optimization

Use Cloudflare Images or Astro's built-in optimization:

```astro
---
import { Image } from 'astro:assets';
import myImage from '../images/photo.jpg';
---

<Image src={myImage} alt="Photo" />
```

### CDN Configuration

**Already optimized:**

- Global distribution to 275+ cities
- Anycast network routing
- DDoS protection
- Web Application Firewall (WAF)

### Performance Tips

1. **Enable caching** for static assets
2. **Optimize images** before upload
3. **Minimize JavaScript** shipped to browser
4. **Use Astro islands** for interactive components
5. **Enable compression** in Cloudflare settings
6. **Leverage edge functions** for dynamic content
7. **Monitor analytics** for bottlenecks

## Troubleshooting

### Build Failures

**Check build logs:**

1. Go to GitHub Actions
2. View workflow run
3. Check build step output

**Common issues:**

```bash
# Missing dependencies
npm ci --legacy-peer-deps

# Out of memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build

# Wrong Node version
# Update workflow to use Node 20
```

### Deployment Failures

**Invalid API token:**

- Regenerate token with correct permissions
- Update GitHub secret

**Project not found:**

- Verify project name in workflow
- Check account ID is correct

**Permission denied:**

- Ensure API token has "Edit" permission
- Check token hasn't expired

### DNS Issues

**Domain not resolving:**

- Wait up to 48 hours for propagation
- Verify CNAME record is correct
- Clear DNS cache locally

**SSL certificate errors:**

- Wait for certificate provisioning (5-10 minutes)
- Verify SSL/TLS mode is set to "Full (strict)"
- Check domain is verified in Cloudflare

### Function Errors

**500 Internal Server Error:**

- Check function code for errors
- Review function logs in dashboard
- Verify environment variables are set

**Timeout:**

- Optimize function to run under 15 seconds
- Move heavy processing to external service
- Use caching to reduce computation

## Advanced Features

### Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# List projects
wrangler pages project list

# View deployment
wrangler pages deployment list

# Tail logs
wrangler pages deployment tail
```

### Redirects

Create `_redirects` file in `/public`:

```
/old-page  /new-page  301
/blog/*    /posts/:splat  302
```

### Headers

Create `_headers` file in `/public`:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer-when-downgrade

/api/*
  Access-Control-Allow-Origin: *
```

### Access Control

Protect your site with Cloudflare Access:

1. Go to Access
2. Create application
3. Add access policies
4. Require authentication

## Best Practices

1. **Use environment variables** for configuration
2. **Enable analytics** to monitor traffic
3. **Set up custom domain** with SSL
4. **Configure caching** for optimal performance
5. **Test preview deployments** before production
6. **Monitor function logs** for errors
7. **Keep dependencies updated** regularly
8. **Use Wrangler CLI** for advanced workflows
9. **Document your setup** for team members
10. **Set up alerts** for deployment failures

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Community](https://community.cloudflare.com/)
- [Status Page](https://www.cloudflarestatus.com/)
