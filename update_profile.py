#!/usr/bin/env python3
"""
Update GitHub profile README with dynamic content.
"""

import os
import re
from datetime import datetime
import requests


def get_github_stats(username):
    """Fetch GitHub statistics for the user."""
    token = os.environ.get('GITHUB_TOKEN', '')
    headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Profile-Updater'
    }
    if token:
        headers['Authorization'] = f'token {token}'
    
    try:
        # Get user data
        user_response = requests.get(
            f'https://api.github.com/users/{username}',
            headers=headers,
            timeout=10
        )
        user_response.raise_for_status()
        user_data = user_response.json()
        
        # Get recent activity (events)
        events_response = requests.get(
            f'https://api.github.com/users/{username}/events/public',
            headers=headers,
            timeout=10
        )
        events_response.raise_for_status()
        events = events_response.json()
        
        # Get repositories
        repos_response = requests.get(
            f'https://api.github.com/users/{username}/repos',
            headers=headers,
            params={'sort': 'updated', 'per_page': 5},
            timeout=10
        )
        repos_response.raise_for_status()
        repos = repos_response.json()
        
        return {
            'user': user_data,
            'events': events[:5],  # Last 5 events
            'repos': repos
        }
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 403:
            print(f"Rate limit reached or access forbidden. Response: {e.response.text}")
        else:
            print(f"HTTP Error fetching GitHub data: {e}")
        return None
    except Exception as e:
        print(f"Error fetching GitHub data: {e}")
        return None


def format_recent_activity(events):
    """Format recent GitHub activity."""
    if not events:
        return "No recent activity"
    
    activity_lines = []
    for event in events:
        event_type = event.get('type', '')
        repo = event.get('repo', {}).get('name', '')
        created_at = event.get('created_at', '')
        
        # Format date
        try:
            date_obj = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
            date_str = date_obj.strftime('%b %d')
        except:
            date_str = 'Recently'
        
        if event_type == 'PushEvent':
            commits = len(event.get('payload', {}).get('commits', []))
            activity_lines.append(f"- 📝 Pushed {commits} commit(s) to [{repo}](https://github.com/{repo}) - {date_str}")
        elif event_type == 'CreateEvent':
            ref_type = event.get('payload', {}).get('ref_type', 'repository')
            activity_lines.append(f"- ✨ Created {ref_type} in [{repo}](https://github.com/{repo}) - {date_str}")
        elif event_type == 'PullRequestEvent':
            action = event.get('payload', {}).get('action', '')
            activity_lines.append(f"- 🔀 {action.capitalize()} a pull request in [{repo}](https://github.com/{repo}) - {date_str}")
        elif event_type == 'IssuesEvent':
            action = event.get('payload', {}).get('action', '')
            activity_lines.append(f"- 🎯 {action.capitalize()} an issue in [{repo}](https://github.com/{repo}) - {date_str}")
        elif event_type == 'WatchEvent':
            activity_lines.append(f"- ⭐ Starred [{repo}](https://github.com/{repo}) - {date_str}")
        elif event_type == 'ForkEvent':
            activity_lines.append(f"- 🍴 Forked [{repo}](https://github.com/{repo}) - {date_str}")
    
    return '\n'.join(activity_lines[:5])  # Limit to 5 items


def format_recent_repos(repos):
    """Format recently updated repositories."""
    if not repos:
        return "No repositories"
    
    repo_lines = []
    for repo in repos[:5]:
        name = repo.get('name', '')
        full_name = repo.get('full_name', '')
        description = repo.get('description', 'No description')
        language = repo.get('language', '')
        stars = repo.get('stargazers_count', 0)
        
        lang_emoji = {
            'Python': '🐍',
            'JavaScript': '💛',
            'TypeScript': '💙',
            'Java': '☕',
            'Go': '🔷',
            'Rust': '🦀',
            'C++': '⚡',
            'C': '🔧',
            'Ruby': '💎',
            'PHP': '🐘',
        }.get(language, '📦')
        
        line = f"- {lang_emoji} **[{name}](https://github.com/{full_name})** - {description}"
        if stars > 0:
            line += f" ⭐ {stars}"
        repo_lines.append(line)
    
    return '\n'.join(repo_lines)


def update_readme(stats):
    """Update README.md with dynamic content."""
    readme_path = 'README.md'
    
    try:
        with open(readme_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: {readme_path} not found")
        return False
    
    # Extract stats
    user = stats['user']
    public_repos = user.get('public_repos', 0)
    followers = user.get('followers', 0)
    following = user.get('following', 0)
    
    # Format sections
    stats_section = f"""
### 📊 GitHub Stats

- 📦 **{public_repos}** Public Repositories
- 👥 **{followers}** Followers
- 🤝 **{following}** Following
"""
    
    activity_section = f"""
### 🚀 Recent Activity

{format_recent_activity(stats['events'])}
"""
    
    repos_section = f"""
### 💻 Recently Updated Repositories

{format_recent_repos(stats['repos'])}
"""
    
    try:
        # Python 3.11+
        timestamp = datetime.now(datetime.UTC).strftime('%Y-%m-%d %H:%M:%S UTC')
    except AttributeError:
        # Python < 3.11
        timestamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
    footer = f"\n---\n\n*Last updated: {timestamp}*\n"
    
    # Build new content
    new_content = f"""## Hi there 👋

I'm Hoodini! Welcome to my GitHub profile.

{stats_section}
{activity_section}
{repos_section}
{footer}"""
    
    # Write updated content
    try:
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("README.md updated successfully!")
        return True
    except Exception as e:
        print(f"Error writing to {readme_path}: {e}")
        return False


def main():
    """Main function."""
    username = 'hoodini'
    
    print(f"Fetching GitHub stats for {username}...")
    stats = get_github_stats(username)
    
    if stats:
        print("Updating README.md...")
        update_readme(stats)
    else:
        print("Failed to fetch GitHub stats")
        return 1
    
    return 0


if __name__ == '__main__':
    exit(main())
