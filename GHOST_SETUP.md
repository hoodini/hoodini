# Ghost Blog Integration Setup

This guide will help you set up automatic blog post updates from your Ghost blog (blog.yuv.ai) to your GitHub profile.

## Step 1: Get Your Ghost Content API Key

1. Go to your Ghost Admin panel: https://blog.yuv.ai/ghost/
2. Navigate to **Settings** > **Integrations**
3. Click **+ Add custom integration**
4. Give it a name like "GitHub Profile"
5. Copy the **Content API Key** (starts with something like `abc123...`)

## Step 2: Add the API Key to GitHub Secrets

1. Go to your GitHub repository: https://github.com/hoodini/hoodini
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click on the **"copilot"** environment (same place where you added YouTube keys)
4. Click **Add environment secret**
5. Add:
   - Name: `GHOST_API_KEY`
   - Value: Your Content API Key from Step 1

## Step 3: Test the Integration

You can test the integration manually:

### Option A: Trigger the Workflow on GitHub
1. Go to **Actions** tab in your repository
2. Click on "Update Blog Posts" workflow
3. Click "Run workflow"
4. Wait for it to complete

### Option B: Test Locally (Optional)
```bash
cd scripts
npm install
export GHOST_API_KEY='your-api-key-here'
npm run update-blog
```

## How It Works

- The workflow runs automatically **every day at 2pm UTC**
- It fetches the latest **5 blog posts** from blog.yuv.ai
- Posts are displayed in a **2-column grid** with:
  - Featured image (if available)
  - Post title (clickable)
  - Excerpt
  - Publication date

## Customization

You can customize the blog integration by editing `scripts/update-blog.ts`:

- **Change number of posts**: Modify `MAX_POSTS` (currently 5)
- **Change blog URL**: Modify `GHOST_BLOG_URL` (currently https://blog.yuv.ai)
- **Change layout**: Modify `formatPostsAsMarkdown()` function
- **Change schedule**: Edit `.github/workflows/blog-workflow.yml` cron expression

## Troubleshooting

### API Key Issues
- Make sure the API key is the **Content API Key**, not Admin API Key
- Verify the key is correctly added to the "copilot" environment in GitHub Secrets
- Check that the integration is enabled in Ghost Admin

### No Posts Showing
- Verify your blog has published posts at blog.yuv.ai
- Check the GitHub Actions logs for error messages
- Make sure the Ghost blog is publicly accessible

### Permission Errors
- Ensure the workflow has `contents: write` permission
- Check that the `GITHUB_TOKEN` has proper permissions
