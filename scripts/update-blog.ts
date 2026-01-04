/**
 * Updated update-blog.ts for hoodini/hoodini repository
 * 
 * This script fetches blog posts from both:
 * 1. English blog (eng.yuv.ai) - displayed FIRST
 * 2. Hebrew blog (blog.yuv.ai via Ghost) - displayed SECOND
 * 
 * To use this script:
 * 1. Replace the existing scripts/update-blog.ts in hoodini/hoodini repo with this file
 * 2. The English blog API is public, no additional secrets needed
 * 3. Keep your existing GHOST_API_KEY secret for Hebrew posts
 * 
 * The output will have two sections:
 * - 🇺🇸 English Posts (from eng.yuv.ai)
 * - 🇮🇱 Hebrew Posts (from blog.yuv.ai)
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const GHOST_API_URL = 'https://yuv-ai.ghost.io';
const GHOST_API_KEY = process.env.GHOST_API_KEY;
const ENG_BLOG_API_URL = 'https://eng.yuv.ai/api/posts'; // English blog API
const MAX_POSTS = 5; // Posts per section
const README_PATH = join(__dirname, '../README.md');

// Markers for blog section in README
const START_MARKER = '<!-- BLOG:START -->';
const END_MARKER = '<!-- BLOG:END -->';

interface BlogPost {
  title: string;
  url: string;
  description: string;
  pubDate: string;
  imageUrl?: string;
}

// Fetch English posts from eng.yuv.ai
async function getEnglishPosts(): Promise<BlogPost[]> {
  try {
    console.log('Fetching English posts from eng.yuv.ai...');
    const response = await fetch(`${ENG_BLOG_API_URL}?limit=${MAX_POSTS}`);

    if (!response.ok) {
      console.warn(`English blog API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();

    if (!data.posts || !Array.isArray(data.posts)) {
      console.warn('Invalid response from English blog API');
      return [];
    }

    const posts: BlogPost[] = data.posts.map((post: any) => ({
      title: post.title || 'Untitled',
      url: post.url || '',
      description: post.excerpt || '',
      pubDate: post.date || new Date().toISOString(),
      imageUrl: post.coverImage || undefined,
    }));

    console.log(`✓ Found ${posts.length} English posts`);
    return posts;

  } catch (error) {
    console.warn('Error fetching English blog posts:', error);
    return [];
  }
}

// Fetch Hebrew posts from Ghost blog
async function getHebrewPosts(): Promise<BlogPost[]> {
  if (!GHOST_API_KEY) {
    throw new Error('GHOST_API_KEY environment variable is not set');
  }

  try {
    const apiUrl = `${GHOST_API_URL}/ghost/api/content/posts/?key=${GHOST_API_KEY}&limit=${MAX_POSTS}&include=tags,authors&fields=title,url,excerpt,published_at,feature_image`;

    console.log(`Fetching Hebrew posts from: ${GHOST_API_URL}`);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Ghost API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.posts || !Array.isArray(data.posts)) {
      throw new Error('Invalid response from Ghost API');
    }

    const posts: BlogPost[] = data.posts.map((post: any) => ({
      title: post.title || 'Untitled',
      url: post.url || '',
      description: post.excerpt || '',
      pubDate: post.published_at || new Date().toISOString(),
      imageUrl: post.feature_image || undefined,
    }));

    console.log(`✓ Found ${posts.length} Hebrew posts`);
    return posts;

  } catch (error) {
    console.error('Error fetching Hebrew blog posts:', error);
    throw error;
  }
}

function formatPostsSection(posts: BlogPost[], sectionTitle: string, emoji: string): string {
  if (posts.length === 0) {
    return '';
  }

  let markdown = `\n### ${emoji} ${sectionTitle}\n\n<table>\n`;

  // Display posts in rows of 2
  for (let i = 0; i < posts.length; i += 2) {
    markdown += '<tr>\n';

    for (let j = i; j < Math.min(i + 2, posts.length); j++) {
      const post = posts[j];
      const date = new Date(post.pubDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      markdown += '<td width="50%" valign="top">\n';

      if (post.imageUrl) {
        markdown += `  <a href="${post.url}">\n`;
        markdown += `    <img src="${post.imageUrl}" alt="${post.title}" style="width:100%; border-radius:8px;">\n`;
        markdown += `  </a>\n`;
      }

      markdown += `  <h3><a href="${post.url}">${post.title}</a></h3>\n`;

      // Limit description to 150 characters
      const shortDesc = post.description.length > 150
        ? post.description.substring(0, 150) + '...'
        : post.description;
      markdown += `  <p>${shortDesc}</p>\n`;
      markdown += `  <sub>📅 ${date}</sub>\n`;
      markdown += '</td>\n';
    }

    markdown += '</tr>\n';
  }

  markdown += '</table>\n';
  return markdown;
}

function formatAllPostsAsMarkdown(englishPosts: BlogPost[], hebrewPosts: BlogPost[]): string {
  let markdown = '\n';

  // English posts section (above Hebrew)
  if (englishPosts.length > 0) {
    markdown += formatPostsSection(englishPosts, 'English Posts', '🇺🇸');
  }

  // Hebrew posts section
  if (hebrewPosts.length > 0) {
    markdown += formatPostsSection(hebrewPosts, 'Hebrew Posts (עברית)', '🇮🇱');
  }

  if (englishPosts.length === 0 && hebrewPosts.length === 0) {
    return '<!-- No posts found -->\n';
  }

  markdown += '\n';
  return markdown;
}

async function updateReadme(): Promise<void> {
  try {
    console.log('📝 Blog Updater (English + Hebrew)');
    console.log('===================================');
    console.log(`English Blog: ${ENG_BLOG_API_URL}`);
    console.log(`Hebrew Blog (Ghost): ${GHOST_API_URL}`);
    console.log(`Max Posts per section: ${MAX_POSTS}`);
    console.log('');

    // Fetch both English and Hebrew posts
    const [englishPosts, hebrewPosts] = await Promise.all([
      getEnglishPosts(),
      getHebrewPosts(),
    ]);

    console.log('');
    console.log(`Total: ${englishPosts.length} English + ${hebrewPosts.length} Hebrew posts`);

    // Read current README
    const readmeContent = readFileSync(README_PATH, 'utf-8');

    // Check if markers exist
    if (!readmeContent.includes(START_MARKER) || !readmeContent.includes(END_MARKER)) {
      console.error('README markers not found. Please add the following to your README.md:');
      console.error(START_MARKER);
      console.error(END_MARKER);
      process.exit(1);
    }

    // Generate new blog section with both languages
    const blogSection = formatAllPostsAsMarkdown(englishPosts, hebrewPosts);

    // Replace content between markers
    const startIndex = readmeContent.indexOf(START_MARKER) + START_MARKER.length;
    const endIndex = readmeContent.indexOf(END_MARKER);

    const newContent =
      readmeContent.substring(0, startIndex) +
      blogSection +
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
