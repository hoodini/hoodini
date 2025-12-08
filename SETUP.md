# Setup Instructions for Automated YouTube Videos

This repository is configured to automatically update the README with the latest YouTube videos from the @yuv-ai channel.

## Completing the Setup

To complete the setup, you need to find and add the correct YouTube channel ID:

### Step 1: Find the YouTube Channel ID

1. Visit [https://www.youtube.com/@yuv-ai](https://www.youtube.com/@yuv-ai)
2. Right-click on the page and select "View Page Source" (or press Ctrl+U / Cmd+Option+U)
3. Search for "channelId" in the page source (Ctrl+F / Cmd+F)
4. Copy the channel ID (it will look like: `UCxxxxxxxxxxxxxxxxxx`)

Alternatively, you can:
- Visit [https://www.youtube.com/@yuv-ai/about](https://www.youtube.com/@yuv-ai/about) and look at the page source
- Use a third-party tool like [https://commentpicker.com/youtube-channel-id.php](https://commentpicker.com/youtube-channel-id.php)

### Step 2: Update the Workflow File

1. Open `.github/workflows/youtube-workflow.yml`
2. Find the line with `feed_list:` (around line 26)
3. Replace `REPLACE_WITH_ACTUAL_CHANNEL_ID` with the actual channel ID you found
4. Save and commit the changes

Example:
```yaml
feed_list: "https://www.youtube.com/feeds/videos.xml?channel_id=UCxxxxxxxxxxxxxxxxxxxx"
```
(where `UCxxxxxxxxxxxxxxxxxxxx` is your actual channel ID)

### Step 3: Test the Workflow

Once you've updated the channel ID:

1. Go to the "Actions" tab in your GitHub repository
2. Select the "Latest YouTube Videos" workflow
3. Click "Run workflow" to manually trigger it
4. Check if the README.md gets updated with your latest videos

## How It Works

- The workflow runs **daily at midnight UTC**
- It fetches the latest 5 videos from your YouTube channel
- Updates the section between `<!-- VIDEO-LIST:START -->` and `<!-- VIDEO-LIST:END -->` in README.md
- Commits the changes automatically

## Customization

You can customize the workflow by editing `.github/workflows/youtube-workflow.yml`:

- **Change frequency**: Modify the `cron` schedule
- **Number of videos**: Change `max_post_count` value
- **Video format**: Modify the `template` parameter

For more options, see the [blog-post-workflow documentation](https://github.com/gautamkrishnar/blog-post-workflow).
