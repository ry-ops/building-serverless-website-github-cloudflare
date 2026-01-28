# Building a Serverless Website with GitHub and Cloudflare

<p align="center">
  <img src="hero.svg" alt="Building a Serverless Website with GitHub and Cloudflare" width="100%">
</p>

A complete example of building and deploying a modern serverless website using Astro, GitHub Actions, and Cloudflare Pages.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/ry-ops/building-serverless-website-github-cloudflare.git
cd building-serverless-website-github-cloudflare

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see your site.

## Features

- **Astro Framework** - Fast, modern static site generator
- **Tailwind CSS** - Utility-first CSS framework
- **Blog Support** - Dynamic blog routes with markdown support
- **Cloudflare Pages** - Automatic deployment via GitHub Actions
- **TypeScript** - Type-safe development experience
- **Component-Based** - Reusable header, footer, and layout components

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       ├── index.astro
│       ├── about.astro
│       └── blog/
│           └── [slug].astro
├── examples/
│   ├── blog-setup/
│   └── api-routes/
├── documentation/
│   ├── DEPLOYMENT.md
│   ├── ASTRO-GUIDE.md
│   └── CLOUDFLARE-SETUP.md
├── .github/
│   └── workflows/
│       └── deploy.yml
└── package.json
```

## Deployment Steps

### 1. Setup Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to Pages
3. Create a new project connected to your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

### 2. Configure GitHub Secrets

Add the following secrets to your GitHub repository:

- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

### 3. Deploy

Push to the `main` branch, and GitHub Actions will automatically build and deploy your site.

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Documentation

- [Deployment Guide](documentation/DEPLOYMENT.md) - Complete deployment instructions
- [Astro Guide](documentation/ASTRO-GUIDE.md) - Working with Astro framework
- [Cloudflare Setup](documentation/CLOUDFLARE-SETUP.md) - Cloudflare Pages configuration

## Examples

- [Blog Setup](examples/blog-setup/) - Example blog configuration
- [API Routes](examples/api-routes/) - Serverless API route examples

## Tech Stack

- [Astro](https://astro.build/) - Web framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Cloudflare Pages](https://pages.cloudflare.com/) - Hosting platform
- [GitHub Actions](https://github.com/features/actions) - CI/CD pipeline

## License

MIT License - see [LICENSE](LICENSE) file for details

Copyright (c) 2026 ry-ops
