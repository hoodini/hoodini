import { google } from 'googleapis';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || ''; // Set your channel ID here or via env variable
const MAX_VIDEOS = 5; // Number of videos to display
const README_PATH = join(__dirname, '../README.md');

// Markers for video section in README
const START_MARKER = '<!-- YOUTUBE:START -->';
const END_MARKER = '<!-- YOUTUBE:END -->';

interface Video {
  title: string;
  url: string;
  thumbnail: string;
  publishedAt: string;
}

async function getLatestVideos(): Promise<Video[]> {
  if (!API_KEY) {
    throw new Error('YOUTUBE_API_KEY environment variable is not set');
  }

  if (!CHANNEL_ID) {
    console.error('❌ CHANNEL_ID is not set!');
    console.error('Please set your YouTube Channel ID in one of these ways:');
    console.error('  1. Set YOUTUBE_CHANNEL_ID environment variable');
    console.error('  2. Edit scripts/update-readme.ts and set CHANNEL_ID constant');
    console.error('\nTo find your Channel ID:');
    console.error('  - Go to YouTube Studio (https://studio.youtube.com/)');
    console.error('  - Click Settings → Channel → Advanced settings');
    console.error('  - Copy your Channel ID (starts with UC...)');
    throw new Error('YOUTUBE_CHANNEL_ID is not configured');
  }

  const youtube = google.youtube({
    version: 'v3',
    auth: API_KEY,
  });

  try {
    // Get latest videos from the specified channel
    const channelResponse = await youtube.search.list({
      part: ['snippet'],
      channelId: CHANNEL_ID,
      type: ['video'],
      order: 'date',
      maxResults: MAX_VIDEOS,
    });

    const videos: Video[] = [];
    
    if (channelResponse.data.items) {
      for (const item of channelResponse.data.items) {
        if (item.snippet && item.id?.videoId) {
          videos.push({
            title: item.snippet.title || 'Untitled',
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            thumbnail: item.snippet.thumbnails?.medium?.url || '',
            publishedAt: item.snippet.publishedAt || '',
          });
        }
      }
    }

    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    throw error;
  }
}

function formatVideosAsMarkdown(videos: Video[]): string {
  if (videos.length === 0) {
    return '<!-- No videos found -->\n';
  }

  let markdown = '\n';
  
  for (const video of videos) {
    const date = new Date(video.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    
    markdown += `### [${video.title}](${video.url})\n`;
    markdown += `[![${video.title}](${video.thumbnail})](${video.url})\n`;
    markdown += `*Published on ${date}*\n\n`;
  }

  return markdown;
}

async function updateReadme(): Promise<void> {
  try {
    console.log('🎬 YouTube README Updater');
    console.log('========================');
    console.log(`Channel ID: ${CHANNEL_ID || '(not set)'}`);
    console.log(`Max Videos: ${MAX_VIDEOS}`);
    console.log('');
    
    console.log('Fetching latest YouTube videos...');
    const videos = await getLatestVideos();
    console.log(`✓ Found ${videos.length} videos`);

    // Read current README
    const readmeContent = readFileSync(README_PATH, 'utf-8');

    // Check if markers exist
    if (!readmeContent.includes(START_MARKER) || !readmeContent.includes(END_MARKER)) {
      console.error('README markers not found. Please add the following to your README.md:');
      console.error(START_MARKER);
      console.error(END_MARKER);
      process.exit(1);
    }

    // Generate new video section
    const videoSection = formatVideosAsMarkdown(videos);

    // Replace content between markers
    const startIndex = readmeContent.indexOf(START_MARKER) + START_MARKER.length;
    const endIndex = readmeContent.indexOf(END_MARKER);
    
    const newContent = 
      readmeContent.substring(0, startIndex) +
      '\n' + videoSection +
      readmeContent.substring(endIndex);

    // Write updated README
    writeFileSync(README_PATH, newContent, 'utf-8');
    console.log('✓ README updated successfully!');

  } catch (error) {
    console.error('Failed to update README:', error);
    process.exit(1);
  }
}

// Run the update
updateReadme();
