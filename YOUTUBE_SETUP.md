# YouTube Video Integration Setup Guide

This guide will help you set up the automatic YouTube video updates for your GitHub profile README.

## Prerequisites

- A YouTube channel with videos
- A Google Cloud account
- Access to GitHub repository settings

## Step 1: Get Your YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click on it and press "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key (you'll need it in the next step)
   - (Optional but recommended) Click "Restrict Key" and limit it to YouTube Data API v3

## Step 2: Get Your YouTube Channel ID

1. Go to [YouTube Studio](https://studio.youtube.com/)
2. Click on "Settings" in the left sidebar
3. Click on "Channel" tab
4. Click on "Advanced settings"
5. Your Channel ID will be displayed
   - It looks like: `UCxxxxxxxxxxxxxxxxxx`
6. Copy this Channel ID

## Step 3: Add Secrets to GitHub

### Option A: Use GitHub Secrets (Recommended)

1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" > "Actions"
3. Add two secrets:

**Secret 1:**
- Name: `YOUTUBE_API_KEY`
- Value: Your API key from Step 1

**Secret 2:**
- Name: `YOUTUBE_CHANNEL_ID`
- Value: Your Channel ID from Step 2

### Option B: Edit the Script Directly

Alternatively, you can hardcode your Channel ID in the script:

Edit `scripts/update-readme.ts` and find this line:
```typescript
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || '';
```

Replace it with:
```typescript
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'YOUR_ACTUAL_CHANNEL_ID';
```

**Note:** Using GitHub Secrets (Option A) is more secure and recommended.

## Step 4: Verify Secrets Configuration (Skip if using Option B)

You should see both secrets listed:
- `YOUTUBE_API_KEY`
- `YOUTUBE_CHANNEL_ID`

## Step 5: Test the Workflow

You can test the workflow in two ways:

### Option A: Manual Trigger
1. Go to your repository on GitHub
2. Click on "Actions" tab
3. Select "Update readme videos" workflow
4. Click "Run workflow" button
5. Select the branch and click "Run workflow"

### Option B: Test Locally (Optional)
```bash
cd scripts
npm install
export YOUTUBE_API_KEY='your-api-key-here'
node --experimental-transform-types update-readme.ts
```

## Step 6: Verify the Setup

After running the workflow:
1. Check the "Actions" tab for any errors
2. Look at your README.md to see if videos were added
3. The workflow will automatically run every Monday at 1pm UTC

## Customization Options

### Change the Number of Videos
Edit `scripts/update-readme.ts` and change this line:
```typescript
const MAX_VIDEOS = 5; // Change this number
```

### Change the Schedule
Edit `.github/workflows/youtube-workflow.yml` and modify the cron expression:
```yaml
- cron: '0 13 * * 1'  # Currently: Every Monday at 1pm UTC
```

Common cron patterns:
- `0 0 * * *` - Every day at midnight
- `0 12 * * *` - Every day at noon
- `0 0 * * 0` - Every Sunday at midnight
- `0 0 1 * *` - First day of every month

### Change Video Display Format
Edit the `formatVideosAsMarkdown` function in `scripts/update-readme.ts` to customize how videos are displayed.

## Troubleshooting

### API Key Issues
- Make sure the API key is correctly added to GitHub Secrets
- Verify the YouTube Data API v3 is enabled in Google Cloud Console
- Check if there are any quota limits on your API key

### No Videos Showing
- Verify your channel ID is correct
- Make sure you have public videos on your channel
- Check the GitHub Actions logs for error messages

### Permission Errors
- Ensure the workflow has `contents: write` permission
- Check that the `GITHUB_TOKEN` has proper permissions

## Additional Resources

- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cron Expression Generator](https://crontab.guru/)
