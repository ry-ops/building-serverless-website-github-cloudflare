# Deployment Guide

Complete guide to deploying your Astro site to Cloudflare Pages using GitHub Actions.

## Prerequisites

Before deploying, ensure you have:

- A GitHub account and repository
- A Cloudflare account (free tier works)
- Your site built and tested locally
- Git installed on your machine

## Step 1: Prepare Your Repository

### 1.1 Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository
3. Don't initialize with README (you already have files)
4. Copy the remote URL

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up Cloudflare Pages

### 2.1 Get Cloudflare Account ID

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on your account name in the top right
3. Go to "Account Home"
4. Your Account ID is displayed on the right side
5. Copy this ID

### 2.2 Create Cloudflare API Token

1. Go to [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use the "Edit Cloudflare Workers" template
4. Set permissions:
   - Account > Cloudflare Pages > Edit
5. Click "Continue to summary"
6. Click "Create Token"
7. Copy the token (you won't see it again!)

### 2.3 Create Cloudflare Pages Project

1. Go to Pages in your Cloudflare Dashboard
2. Click "Create a project"
3. Select "Direct Upload" (we'll use GitHub Actions)
4. Name your project (e.g., `building-serverless-website`)
5. Note the project name for later

## Step 3: Configure GitHub Secrets

### 3.1 Add Secrets to GitHub

1. Go to your GitHub repository
2. Click "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add these secrets:

**CLOUDFLARE_API_TOKEN**
```
The API token you created in step 2.2
```

**CLOUDFLARE_ACCOUNT_ID**
```
Your account ID from step 2.1
```

### 3.2 Verify Secrets

Ensure both secrets are listed in your repository settings. They should be masked and not visible after creation.

## Step 4: Configure Deployment Workflow

The repository already includes `.github/workflows/deploy.yml`. Verify the configuration:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: building-serverless-website
          directory: dist
```

**Important:** Update `projectName` to match your Cloudflare Pages project name.

## Step 5: Deploy

### 5.1 Trigger Deployment

Push to the main branch to trigger deployment:

```bash
git add .
git commit -m "Deploy to Cloudflare Pages"
git push origin main
```

### 5.2 Monitor Deployment

1. Go to your GitHub repository
2. Click the "Actions" tab
3. Watch the deployment progress
4. Check for any errors

### 5.3 Verify Deployment

1. Once successful, go to Cloudflare Dashboard
2. Navigate to Pages > Your Project
3. Click on the latest deployment
4. Visit the deployment URL

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain

1. In Cloudflare Pages, go to your project
2. Click "Custom domains"
3. Click "Set up a custom domain"
4. Enter your domain name
5. Follow the DNS configuration instructions

### 6.2 Configure DNS

If your domain is on Cloudflare:
- CNAME record is automatically created

If your domain is elsewhere:
- Add a CNAME record pointing to your Pages URL

### 6.3 SSL/TLS

Cloudflare automatically provisions SSL certificates for your custom domain. This may take a few minutes.

## Troubleshooting

### Build Failures

**Error: Module not found**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error: Out of memory**
```bash
# Increase Node memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Deployment Failures

**Error: Invalid API token**
- Verify your API token has correct permissions
- Regenerate token if needed
- Update GitHub secret

**Error: Project not found**
- Verify project name in `deploy.yml` matches Cloudflare
- Check account ID is correct

### DNS Issues

**Domain not resolving**
- Wait up to 24-48 hours for DNS propagation
- Use [DNS Checker](https://dnschecker.org) to verify
- Clear your DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

## Continuous Deployment

Every push to `main` automatically:

1. Triggers GitHub Actions workflow
2. Installs dependencies
3. Builds the Astro site
4. Deploys to Cloudflare Pages
5. Invalidates CDN cache
6. Makes the site live globally

## Branch Previews

Deploy preview branches:

```yaml
on:
  push:
    branches:
      - main
      - develop
  pull_request:
```

Each PR gets a unique preview URL automatically.

## Environment Variables

### Set in Cloudflare

1. Go to Settings > Environment variables
2. Add variables for production/preview
3. Access in code: `import.meta.env.VARIABLE_NAME`

### Example

```javascript
const apiUrl = import.meta.env.PUBLIC_API_URL || 'https://api.example.com';
```

Note: Variables prefixed with `PUBLIC_` are available in the browser.

## Rollback

### Via Cloudflare Dashboard

1. Go to your Pages project
2. Click "Deployments"
3. Find a previous deployment
4. Click "Rollback to this deployment"

### Via Git

```bash
git revert HEAD
git push origin main
```

This creates a new deployment with the previous code.

## Performance Optimization

### Enable Build Cache

Already configured in `deploy.yml`:

```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

### Optimize Assets

```javascript
// astro.config.mjs
export default defineConfig({
  build: {
    assets: '_assets',
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild',
    },
  },
});
```

## Monitoring

### View Deployment Logs

- GitHub Actions: Check workflow run logs
- Cloudflare: View function logs in dashboard

### Analytics

Enable Cloudflare Web Analytics:
1. Go to Analytics > Web Analytics
2. Add your site
3. Copy the beacon script
4. Add to your layout

## Best Practices

1. **Test locally first** - Always run `npm run build` before pushing
2. **Use environment variables** - Never commit secrets
3. **Enable branch previews** - Review changes before merging
4. **Monitor deployments** - Check Actions tab after each push
5. **Set up alerts** - Configure GitHub notifications for failed builds
6. **Document changes** - Use descriptive commit messages
7. **Regular updates** - Keep dependencies updated

## Next Steps

- Set up custom domain
- Configure environment variables
- Enable Web Analytics
- Add more GitHub Actions workflows
- Implement branch protection rules

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/)
