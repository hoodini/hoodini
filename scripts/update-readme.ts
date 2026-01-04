import { google } from 'googleapis';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const API_KEY = process.env.YOUTUBE_API_KEY;
const PLAYLIST_ID = 'PLzJ4Crvb4v-FQ8Mj1bzGfil7dTNWk0XBx'; // English playlist
const MAX_VIDEOS = 6; // Number of videos to display (6 for 3x2 grid)
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

  const youtube = google.youtube({
    version: 'v3',
    auth: API_KEY,
  });

  try {
    // Get latest videos from the English playlist
    const playlistResponse = await youtube.playlistItems.list({
      part: ['snippet'],
      playlistId: PLAYLIST_ID,
      maxResults: MAX_VIDEOS,
    });

    const videos: Video[] = [];

    if (playlistResponse.data.items) {
      for (const item of playlistResponse.data.items) {
        if (item.snippet) {
          videos.push({
            title: item.snippet.title || 'Untitled',
            url: `https://www.youtube.com/watch?v=${item.snippet.resourceId?.videoId}`,
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

  let markdown = '\n<table>\n';

  // Display videos in rows of 2
  for (let i = 0; i < videos.length; i += 2) {
    markdown += '<tr>\n';

    for (let j = i; j < Math.min(i + 2, videos.length); j++) {
      const video = videos[j];
      markdown += '<td width="50%" align="center">\n';
      markdown += `  <a href="${video.url}">\n`;
      markdown += `    <img src="${video.thumbnail}" alt="${video.title}" style="width:100%; max-width:400px;">\n`;
      markdown += `  </a>\n`;
      markdown += `  <br>\n`;
      markdown += `  <a href="${video.url}"><strong>${video.title}</strong></a>\n`;
      markdown += '</td>\n';
    }

    markdown += '</tr>\n';
  }

  markdown += '</table>\n\n';
  return markdown;
}

async function updateReadme(): Promise<void> {
  try {
    console.log('🎬 YouTube README Updater');
    console.log('========================');
    console.log(`Playlist ID: ${PLAYLIST_ID}`);
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
      videoSection +
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
