# Dynamic Profile Updates Setup

This repository uses GitHub Actions to automatically update the profile README with dynamic content from your GitHub account.

## How It Works

1. **GitHub Actions Workflow**: The `.github/workflows/update-profile.yml` workflow runs daily at midnight UTC (and can be triggered manually).

2. **Python Script**: The `update_profile.py` script:
   - Fetches your GitHub statistics (repos, followers, following)
   - Retrieves your recent GitHub activities (pushes, PRs, issues, stars, etc.)
   - Gets your recently updated repositories
   - Updates the README.md with formatted content

3. **Automatic Commits**: The workflow automatically commits and pushes changes to the README.md if there are updates.

## Features

- 📊 **GitHub Stats**: Displays public repository count, followers, and following count
- 🚀 **Recent Activity**: Shows your last 5 GitHub activities with emojis and dates
- 💻 **Recent Repositories**: Lists your 5 most recently updated repositories with descriptions and star counts
- ⏰ **Timestamp**: Includes the last update time

## Manual Trigger

You can manually trigger the workflow from the GitHub Actions tab:
1. Go to the "Actions" tab in your repository
2. Select "Update Profile README" workflow
3. Click "Run workflow"

## Customization

### Update Frequency

Edit `.github/workflows/update-profile.yml` to change the schedule:
```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Change this cron expression
```

### Content Customization

Edit `update_profile.py` to customize:
- Which statistics to display
- How activities are formatted
- Number of items to show
- Emoji mappings for languages
- Overall layout and styling

## Requirements

- Python 3.7+
- `requests` library (see `requirements.txt`)

## Testing Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Set your GitHub token (optional, for higher rate limits)
export GITHUB_TOKEN=your_token_here

# Run the update script
python update_profile.py
```

## Permissions

The workflow requires `contents: write` permission to commit changes back to the repository. This is configured in the workflow file.
