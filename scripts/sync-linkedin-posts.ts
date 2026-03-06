#!/usr/bin/env tsx
import * as fs from 'fs';
import * as path from 'path';
import puppeteer, { Browser, Page } from 'puppeteer';
import 'dotenv/config';

const LINKEDIN_EMAIL = process.env.LINKEDIN_EMAIL || '';
const LINKEDIN_PASSWORD = process.env.LINKEDIN_PASSWORD || '';
const DATA_DIR = path.join(process.cwd(), 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'linkedin-posts.json');

interface LinkedInPost {
  id: string;
  title: string;
  content: string;
  url: string;
  publishedAt: string;
  image?: string;
  likes?: number;
  comments?: number;
  reposts?: number;
}

async function loginToLinkedIn(page: Page): Promise<void> {
  console.log('🔐 Logging into LinkedIn...');

  await page.goto('https://www.linkedin.com/login', {
    waitUntil: 'networkidle2',
  });

  await page.type('#username', LINKEDIN_EMAIL);
  await page.type('#password', LINKEDIN_PASSWORD);

  await Promise.all([
    page.click('[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {}),
  ]);

  const url = page.url();
  if (url.includes('/checkpoint')) {
    console.log('🔒 2FA detected! Please complete the verification in the browser window.');
    console.log('⏳ Waiting for you to complete 2FA (up to 5 minutes)...');

    await page.waitForFunction(
      () => !window.location.href.includes('/checkpoint'),
      { timeout: 300000 }
    ).catch(() => {
      throw new Error('2FA timeout - please complete verification within 5 minutes');
    });

    console.log('✅ 2FA completed!');
  } else if (url.includes('/login')) {
    throw new Error('Login failed. Please check your credentials.');
  }

  console.log('✅ Logged in successfully');
}

async function scrapePosts(page: Page): Promise<LinkedInPost[]> {
  console.log('📝 Navigating to your LinkedIn posts...');

  await page.goto('https://www.linkedin.com/in/sanjaykrishnanjv/recent-activity/all/', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  await new Promise(resolve => setTimeout(resolve, 3000));

  // Scroll to load more posts
  console.log('📜 Scrolling to load posts...');
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('🔍 Extracting post data...');

  // Take a screenshot to help debug
  await page.screenshot({ path: path.join(DATA_DIR, 'linkedin-posts-debug.png') });

  // Debug: Log all possible class names on the page
  const debugInfo = await page.evaluate(() => {
    const allElements = document.querySelectorAll('*');
    const classSet = new Set<string>();

    allElements.forEach(el => {
      el.classList.forEach(className => {
        if (className.includes('feed') || className.includes('post') || className.includes('update') || className.includes('activity')) {
          classSet.add(className);
        }
      });
    });

    // Try to find any list items
    const listItems = document.querySelectorAll('li, article, div[data-urn]');

    return {
      relevantClasses: Array.from(classSet),
      listItemsCount: listItems.length,
      sampleHTML: document.body.innerHTML.substring(0, 5000) // First 5000 chars
    };
  });

  console.log('📊 Debug Info:');
  console.log('Relevant classes found:', debugInfo.relevantClasses);
  console.log('List items count:', debugInfo.listItemsCount);

  // Save debug info to file
  fs.writeFileSync(
    path.join(DATA_DIR, 'linkedin-debug-classes.json'),
    JSON.stringify(debugInfo, null, 2)
  );

  const posts = await page.evaluate(() => {
    const postList: LinkedInPost[] = [];

    // Try multiple selectors for posts
    let postElements = document.querySelectorAll('.feed-shared-update-v2, .profile-creator-shared-feed-update__container, li.profile-creator-shared-feed-update__container, li, article');

    console.log(`Found ${postElements.length} post elements`);

    postElements.forEach((post, index) => {
      // Only process .feed-shared-update-v2 elements
      if (!post.classList.contains('feed-shared-update-v2')) {
        return;
      }

      try {
        // Get post content - try multiple selectors
        let content = '';
        const contentSelectors = [
          '.update-components-text',
          '.feed-shared-update-v2__description',
          '.feed-shared-inline-show-more-text',
          '.break-words'
        ];

        for (const selector of contentSelectors) {
          const el = post.querySelector(selector);
          if (el?.textContent) {
            content = el.textContent.trim();
            break;
          }
        }

        // Extract first line as title (or first 100 chars)
        const lines = content.split('\n').filter(line => line.trim());
        const title = lines[0]?.substring(0, 100) || 'LinkedIn Post';

        // Get post URL - use the profile-creator anchor
        let url = '';
        const anchorEl = post.querySelector('.profile-creator-shared-feed-update__anchor') as HTMLAnchorElement;
        if (anchorEl?.href) {
          url = anchorEl.href;
        }

        // Fallback: try other selectors
        if (!url) {
          const linkSelectors = [
            'a[href*="/feed/update/"]',
            'a[href*="/posts/"]',
            '.app-aware-link[href*="activity"]'
          ];

          for (const selector of linkSelectors) {
            const linkEl = post.querySelector(selector) as HTMLAnchorElement;
            if (linkEl?.href) {
              url = linkEl.href;
              break;
            }
          }
        }

        // Extract post ID from URL or element
        let id = `post-${index}`;
        if (url) {
          const idMatch = url.match(/urn:li:activity:(\d+)/) || url.match(/posts\/[^-]+-(\d+)/) || url.match(/activity-(\d+)/);
          if (idMatch) id = idMatch[1];
        }

        // Get image if exists - exclude profile pictures
        let image: string | undefined;
        const imageSelectors = [
          '.update-components-image__image',
          '.feed-shared-image__image-link img',
          '.update-components-image img',
          '.feed-shared-celebration-image__image',
          '.update-components-article__image--rounded-corners',
          'img[src*="feedshare"]'
        ];

        for (const selector of imageSelectors) {
          const imgEl = post.querySelector(selector) as HTMLImageElement;
          if (imgEl?.src &&
              !imgEl.src.includes('static') &&
              !imgEl.src.includes('avatar') &&
              !imgEl.src.includes('profile-displayphoto') &&
              !imgEl.src.includes('ghost-person')) {
            image = imgEl.src;
            break;
          }
        }

        // Mark post for screenshot if no image found
        if (!image) {
          post.setAttribute('data-needs-screenshot', 'true');
          post.setAttribute('data-post-index', index.toString());
        }

        // Get engagement metrics
        let likes = 0;
        const likesSelectors = [
          '.social-details-social-counts__reactions-count',
          '[aria-label*="reaction"]',
          '.feed-shared-social-action-bar__action-button[aria-label*="react"]'
        ];

        for (const selector of likesSelectors) {
          const el = post.querySelector(selector);
          if (el?.textContent) {
            const likesText = el.textContent.trim();
            const match = likesText.match(/\d+/);
            if (match) likes = parseInt(match[0]);
            if (likes > 0) break;
          }
        }

        let comments = 0;
        const commentsSelectors = [
          '.social-details-social-counts__comments',
          '[aria-label*="comment"]',
          '.feed-shared-social-action-bar__action-button[aria-label*="comment"]'
        ];

        for (const selector of commentsSelectors) {
          const el = post.querySelector(selector);
          if (el?.textContent) {
            const commentsText = el.textContent.trim();
            const match = commentsText.match(/\d+/);
            if (match) comments = parseInt(match[0]);
            if (comments > 0) break;
          }
        }

        // Get publish date - try multiple approaches
        let publishedAt = new Date().toISOString();

        // Try to find time element with datetime attribute first
        const timeEl = post.querySelector('time[datetime]');
        if (timeEl) {
          const datetime = timeEl.getAttribute('datetime');
          if (datetime) {
            publishedAt = datetime;
          }
        }

        // If no datetime attribute, try to find relative time text (e.g., "4mo", "1w", "2d")
        if (publishedAt === new Date().toISOString()) {
          const actorDescriptionSelectors = [
            '.update-components-actor__sub-description',
            '.feed-shared-actor__sub-description',
            '.update-components-actor__description'
          ];

          for (const selector of actorDescriptionSelectors) {
            const descEl = post.querySelector(selector);
            if (descEl?.textContent) {
              const timeText = descEl.textContent.trim();
              console.log(`Checking time text: "${timeText}"`);

              // Look for patterns like "4mo", "1w", "2d", "3h", etc.
              const relativeTimeMatch = timeText.match(/(\d+)(mo|w|d|h|m)(?:\s|•|$)/);
              if (relativeTimeMatch) {
                const [, amount, unit] = relativeTimeMatch;
                const now = new Date();
                const value = parseInt(amount);

                switch (unit) {
                  case 'mo':
                    now.setMonth(now.getMonth() - value);
                    break;
                  case 'w':
                    now.setDate(now.getDate() - (value * 7));
                    break;
                  case 'd':
                    now.setDate(now.getDate() - value);
                    break;
                  case 'h':
                    now.setHours(now.getHours() - value);
                    break;
                  case 'm':
                    now.setMinutes(now.getMinutes() - value);
                    break;
                }

                publishedAt = now.toISOString();
                console.log(`Parsed relative time "${timeText}" to ${publishedAt}`);
                break;
              }
            }
          }
        }

        console.log(`Post ${index}: content="${content.substring(0, 50)}...", url="${url}", date="${publishedAt}", has_image=${!!image}`);

        if (content || url) {
          postList.push({
            id,
            title,
            content: content || 'No content available',
            url: url || '#',
            publishedAt,
            image,
            likes,
            comments,
          });
        }
      } catch (error) {
        console.error('Error parsing post:', error);
      }
    });

    return postList;
  });

  // Take screenshots for posts without images
  console.log('📸 Taking screenshots for posts without images...');
  const postsNeedingScreenshots = await page.$$('[data-needs-screenshot="true"]');

  for (const postElement of postsNeedingScreenshots) {
    try {
      const postIndex = await postElement.evaluate(el => el.getAttribute('data-post-index'));
      const post = posts.find(p => p.id.includes(postIndex || ''));

      if (post) {
        const screenshotDir = path.join(process.cwd(), 'public', 'post-screenshots');
        if (!fs.existsSync(screenshotDir)) {
          fs.mkdirSync(screenshotDir, { recursive: true });
        }

        const screenshotPath = path.join(screenshotDir, `${post.id}.png`);

        // Scroll element into view and take screenshot
        await postElement.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        await new Promise(resolve => setTimeout(resolve, 500));

        await postElement.screenshot({ path: screenshotPath });
        post.image = `/post-screenshots/${post.id}.png`;

        console.log(`   📸 Screenshot saved for post ${post.id}`);
      }
    } catch (error) {
      console.error('Error taking screenshot:', error);
    }
  }

  return posts;
}

async function main() {
  console.log('🚀 Starting LinkedIn posts sync...\n');

  if (!LINKEDIN_EMAIL || !LINKEDIN_PASSWORD) {
    console.error('❌ Error: LinkedIn credentials not found in .env file');
    console.log('\nPlease create a .env file with:');
    console.log('LINKEDIN_EMAIL=your_email@example.com');
    console.log('LINKEDIN_PASSWORD=your_password');
    process.exit(1);
  }

  let browser: Browser | null = null;

  try {
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    await loginToLinkedIn(page);
    const posts = await scrapePosts(page);

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Final pass: Check if screenshots exist for posts without images
    posts.forEach(post => {
      if (!post.image) {
        const screenshotPath = path.join(process.cwd(), 'public', 'post-screenshots', `${post.id}.png`);
        if (fs.existsSync(screenshotPath)) {
          post.image = `/post-screenshots/${post.id}.png`;
          console.log(`📸 Using existing screenshot for post ${post.id}`);
        }
      }
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2), 'utf-8');

    console.log(`\n✅ Successfully scraped ${posts.length} posts!`);
    console.log(`📄 Data saved to: ${OUTPUT_FILE}`);

    if (posts.length > 0) {
      console.log('\n📝 Posts found:');
      posts.forEach((post, index) => {
        console.log(`   ${index + 1}. ${post.title}`);
      });
    }

  } catch (error) {
    console.error('❌ Error syncing posts:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main();
