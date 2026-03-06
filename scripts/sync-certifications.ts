#!/usr/bin/env tsx
import * as fs from 'fs';
import * as path from 'path';
import puppeteer, { Browser, Page } from 'puppeteer';
import 'dotenv/config';

const LINKEDIN_EMAIL = process.env.LINKEDIN_EMAIL || '';
const LINKEDIN_PASSWORD = process.env.LINKEDIN_PASSWORD || '';
const DATA_DIR = path.join(process.cwd(), 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'certifications.json');

interface Certification {
  name: string;
  organization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  logo?: string;
  certificateImage?: string;
}

async function loginToLinkedIn(page: Page): Promise<void> {
  console.log('🔐 Logging into LinkedIn...');

  await page.goto('https://www.linkedin.com/login', {
    waitUntil: 'networkidle2',
  });

  // Enter email
  await page.type('#username', LINKEDIN_EMAIL);
  await page.type('#password', LINKEDIN_PASSWORD);

  // Click sign in button
  await Promise.all([
    page.click('[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {}),
  ]);

  // Check if 2FA/checkpoint is required
  const url = page.url();
  if (url.includes('/checkpoint')) {
    console.log('🔒 2FA detected! Please complete the verification in the browser window.');
    console.log('⏳ Waiting for you to complete 2FA (up to 2 minutes)...');

    // Wait for user to complete 2FA - wait for navigation away from checkpoint
    await page.waitForFunction(
      () => !window.location.href.includes('/checkpoint'),
      { timeout: 120000 } // 2 minutes timeout
    ).catch(() => {
      throw new Error('2FA timeout - please complete verification faster next time');
    });

    console.log('✅ 2FA completed!');
  } else if (url.includes('/login')) {
    throw new Error('Login failed. Please check your credentials.');
  }

  console.log('✅ Logged in successfully');
}

async function scrapeCertifications(page: Page): Promise<Certification[]> {
  console.log('📜 Navigating to certifications section...');

  // Navigate to profile
  await page.goto(`https://www.linkedin.com/in/sanjaykrishnanjv/details/certifications/`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  // Wait a bit for dynamic content to load
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Wait for certifications to load
  await page.waitForSelector('.pvs-list__paged-list-item', { timeout: 15000 }).catch(() => {
    console.log('⚠️  No certifications found or selector changed');
  });

  console.log('🔍 Extracting certification data...');

  // Extract certification data
  const certifications = await page.evaluate(() => {
    const certs: Certification[] = [];
    const items = document.querySelectorAll('.pvs-list__paged-list-item');

    items.forEach((item) => {
      try {
        // Certification name
        const nameElement = item.querySelector('.mr1.t-bold span[aria-hidden="true"]');
        const name = nameElement?.textContent?.trim() || '';

        // Organization
        const orgElement = item.querySelector('.t-14.t-normal span[aria-hidden="true"]');
        const organization = orgElement?.textContent?.trim() || '';

        // Date and credential info
        const metaElements = item.querySelectorAll('.t-14.t-normal.t-black--light span[aria-hidden="true"]');
        let issueDate = '';
        let credentialId = '';

        metaElements.forEach((el) => {
          const text = el.textContent?.trim() || '';
          if (text.includes('Issued')) {
            issueDate = text.replace('Issued', '').trim();
          }
          if (text.includes('Credential ID')) {
            credentialId = text.replace('Credential ID', '').trim();
          }
        });

        // Credential URL
        const linkElement = item.querySelector('a[href*="credential"]') as HTMLAnchorElement;
        const credentialUrl = linkElement?.href || '';

        // Organization logo (first image, usually small)
        const logoElement = item.querySelector('img') as HTMLImageElement;
        const logo = logoElement?.src || '';

        // Certificate image (try to find it on the list page first)
        let certificateImage = '';
        const allImages = item.querySelectorAll('img');

        // Look for larger certificate images
        allImages.forEach((img) => {
          const imgSrc = img.src || '';
          const imgAlt = img.alt || '';
          // Certificate images are usually larger or in specific containers
          if (imgSrc && !certificateImage && (
            imgAlt.toLowerCase().includes('certificate') ||
            imgAlt.toLowerCase().includes(name.toLowerCase()) ||
            img.closest('.pv-certifications__media') ||
            img.closest('.certifications-media') ||
            img.width > 100 ||
            img.naturalWidth > 100
          )) {
            certificateImage = imgSrc;
          }
        });

        // If no specific certificate image found, fall back to second image if exists
        if (!certificateImage && allImages.length > 1) {
          certificateImage = (allImages[1] as HTMLImageElement).src || '';
        }

        if (name && organization) {
          certs.push({
            name,
            organization,
            issueDate,
            credentialId: credentialId || undefined,
            credentialUrl: credentialUrl || undefined,
            logo: logo || undefined,
            certificateImage: certificateImage || undefined,
          });
        }
      } catch (error) {
        console.error('Error parsing certification item:', error);
      }
    });

    return certs;
  });

  // Note: Individual credential page scraping disabled -
  // LinkedIn Learning certificates require manual image upload to LinkedIn
  const certsWithoutImages = certifications.filter(c => !c.certificateImage);
  if (certsWithoutImages.length > 0) {
    console.log(`\n📝 Note: ${certsWithoutImages.length} certifications don't have images.`);
    console.log('   To add images, upload them directly on LinkedIn for each certificate.');
  }

  return certifications;
}

async function main() {
  console.log('🚀 Starting LinkedIn certification sync...\n');

  if (!LINKEDIN_EMAIL || !LINKEDIN_PASSWORD) {
    console.error('❌ Error: LinkedIn credentials not found in .env file');
    console.log('\nPlease create a .env file with:');
    console.log('LINKEDIN_EMAIL=your_email@example.com');
    console.log('LINKEDIN_PASSWORD=your_password');
    process.exit(1);
  }

  let browser: Browser | null = null;

  try {
    // Launch browser
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({
      headless: false, // Set to true for production
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Set user agent to avoid detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    // Login to LinkedIn
    await loginToLinkedIn(page);

    // Scrape certifications
    const certifications = await scrapeCertifications(page);

    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(certifications, null, 2), 'utf-8');

    console.log(`\n✅ Successfully scraped ${certifications.length} certifications!`);
    console.log(`📄 Data saved to: ${OUTPUT_FILE}`);

    if (certifications.length > 0) {
      console.log('\n📜 Certifications found:');
      certifications.forEach((cert, index) => {
        console.log(`   ${index + 1}. ${cert.name} - ${cert.organization}`);
      });
    }

  } catch (error) {
    console.error('❌ Error syncing certifications:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main();
