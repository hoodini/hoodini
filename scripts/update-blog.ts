import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const GHOST_BLOG_RSS = 'https://blog.yuv.ai/rss/';
const MAX_POSTS = 5;
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

async function getLatestPosts(): Promise<BlogPost[]> {
  try {
    console.log(`Fetching from: ${GHOST_BLOG_RSS}`);

    const response = await fetch(GHOST_BLOG_RSS);

    if (!response.ok) {
      throw new Error(`RSS feed error: ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();
    
    // Parse RSS XML
    const posts: BlogPost[] = [];
    const itemMatches = xmlText.matchAll(/<item>(.*?)<\/item>/gs);

    for (const match of itemMatches) {
      if (posts.length >= MAX_POSTS) break;

      const itemXml = match[1];
      
      const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const descMatch = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);
      const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
      const imageMatch = itemXml.match(/<media:content url="(.*?)"/);

      if (titleMatch && linkMatch) {
        posts.push({
          title: titleMatch[1],
          url: linkMatch[1],
          description: descMatch ? descMatch[1] : '',
          pubDate: pubDateMatch ? pubDateMatch[1] : '',
          imageUrl: imageMatch ? imageMatch[1] : undefined
        });
      }
    }

    return posts;

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

function formatPostsAsMarkdown(posts: BlogPost[]): string {
  if (posts.length === 0) {
    return '<!-- No posts found -->\n';
  }

  let markdown = '\n<table>\n';

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

  markdown += '</table>\n\n';
  return markdown;
}

async function updateReadme(): Promise<void> {
  try {
    console.log('📝 Ghost Blog Updater (RSS)');
    console.log('===========================');
    console.log(`Blog RSS: ${GHOST_BLOG_RSS}`);
    console.log(`Max Posts: ${MAX_POSTS}`);
    console.log('');

    console.log('Fetching latest blog posts...');
    const posts = await getLatestPosts();
    console.log(`✓ Found ${posts.length} posts`);

    // Read current README
    const readmeContent = readFileSync(README_PATH, 'utf-8');

    // Check if markers exist
    if (!readmeContent.includes(START_MARKER) || !readmeContent.includes(END_MARKER)) {
      console.error('README markers not found. Please add the following to your README.md:');
      console.error(START_MARKER);
      console.error(END_MARKER);
      process.exit(1);
    }

    // Generate new blog section
    const blogSection = formatPostsAsMarkdown(posts);

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
