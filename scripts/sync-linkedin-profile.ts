#!/usr/bin/env tsx
import * as fs from 'fs';
import * as path from 'path';
import puppeteer, { Browser, Page } from 'puppeteer';
import 'dotenv/config';

const LINKEDIN_EMAIL = process.env.LINKEDIN_EMAIL || '';
const LINKEDIN_PASSWORD = process.env.LINKEDIN_PASSWORD || '';
const LINKEDIN_USERNAME = process.env.LINKEDIN_USERNAME || 'sanjaykrishnanjv';
const DATA_DIR = path.join(process.cwd(), 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'personal.json');

interface PersonalData {
  name: string;
  title: string;
  email: string;
  location: string;
  timezone: string;
  bio: string;
  tagline: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    website?: string;
    orcid?: string;
    instagram?: string[];
  };
  skills: {
    languages: string[];
    frontend: string[];
    backend: string[];
    databases: string[];
    cloud: string[];
    tools: string[];
  };
  experience: Array<{
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string | null;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    grade?: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
    url?: string;
  }>;
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
    console.log('⏳ Waiting for you to complete 2FA (up to 2 minutes)...');

    await page.waitForFunction(
      () => !window.location.href.includes('/checkpoint'),
      { timeout: 120000 }
    ).catch(() => {
      throw new Error('2FA timeout - please complete verification faster next time');
    });

    console.log('✅ 2FA completed!');
  } else if (url.includes('/login')) {
    throw new Error('Login failed. Please check your credentials.');
  }

  console.log('✅ Logged in successfully');
}

async function scrapeBasicInfo(page: Page): Promise<Partial<PersonalData>> {
  console.log('📋 Scraping basic profile information...');

  await page.goto(`https://www.linkedin.com/in/${LINKEDIN_USERNAME}/`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  await new Promise(resolve => setTimeout(resolve, 3000));

  const basicInfo = await page.evaluate(() => {
    const data: any = {};

    // Name
    const nameElement = document.querySelector('h1.text-heading-xlarge');
    data.name = nameElement?.textContent?.trim() || '';

    // Title/Headline
    const titleElement = document.querySelector('.text-body-medium.break-words');
    data.title = titleElement?.textContent?.trim() || '';

    // Location
    const locationElement = document.querySelector('.text-body-small.inline.t-black--light.break-words');
    data.location = locationElement?.textContent?.trim() || '';

    return data;
  });

  console.log(`   ✓ Name: ${basicInfo.name}`);
  console.log(`   ✓ Title: ${basicInfo.title}`);
  console.log(`   ✓ Location: ${basicInfo.location}`);

  return basicInfo;
}

async function scrapeAbout(page: Page): Promise<string> {
  console.log('📝 Scraping About section...');

  await page.goto(`https://www.linkedin.com/in/${LINKEDIN_USERNAME}/details/about/`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  await new Promise(resolve => setTimeout(resolve, 3000));

  const about = await page.evaluate(() => {
    const aboutElement = document.querySelector('.pvs-header__title-text');
    const aboutText = aboutElement?.textContent?.trim() || '';

    // Try alternative selectors if first one doesn't work
    if (!aboutText) {
      const altElement = document.querySelector('.display-flex.ph5.pv3 span[aria-hidden="true"]');
      return altElement?.textContent?.trim() || '';
    }

    return aboutText;
  });

  console.log(`   ✓ About section scraped (${about.length} characters)`);
  return about;
}

async function scrapeExperience(page: Page): Promise<PersonalData['experience']> {
  console.log('💼 Scraping work experience...');

  await page.goto(`https://www.linkedin.com/in/${LINKEDIN_USERNAME}/details/experience/`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  await new Promise(resolve => setTimeout(resolve, 3000));

  const experience = await page.evaluate(() => {
    const experiences: any[] = [];
    const items = document.querySelectorAll('.pvs-list__paged-list-item');

    items.forEach((item) => {
      try {
        // Position
        const positionElement = item.querySelector('.mr1.t-bold span[aria-hidden="true"]');
        const position = positionElement?.textContent?.trim() || '';

        // Company (may have employment type after ·)
        const companyElement = item.querySelector('.t-14.t-normal span[aria-hidden="true"]');
        const companyText = companyElement?.textContent?.trim() || '';
        const company = companyText.split(' · ')[0] || '';

        // Get all meta text elements
        const metaElements = Array.from(item.querySelectorAll('.t-14.t-normal.t-black--light span[aria-hidden="true"]'));
        let duration = '';
        let location = '';

        // Parse each meta element
        metaElements.forEach((el, index) => {
          const text = el.textContent?.trim() || '';

          // Duration format: "Jul 2019 - Feb 2022" or "Jan 2023 - Present" or just date range
          if (text.match(/[A-Za-z]{3}\s+\d{4}/) || text.includes('Present')) {
            duration = text;
          }
          // Location is usually the last element that doesn't contain dates
          else if (!text.match(/\d+\s+(yr|mo)/) && text && index > 0) {
            location = text;
          }
        });

        // Description - look for longer text content
        const descElements = item.querySelectorAll('.pvs-list__outer-container .t-14 span[aria-hidden="true"]');
        let description = '';
        descElements.forEach((el) => {
          const text = el.textContent?.trim() || '';
          if (text.length > 50 && !text.includes(position) && !text.includes(company)) {
            description = text;
          }
        });

        if (position && company) {
          // Parse dates from duration
          const current = duration.toLowerCase().includes('present');
          let startDate = '';
          let endDate: string | null = '';

          if (duration) {
            const dateParts = duration.split(' - ');
            startDate = dateParts[0]?.trim() || '';
            endDate = current ? null : (dateParts[1]?.trim() || '');
          }

          experiences.push({
            company,
            position,
            location: location || 'Remote',
            startDate,
            endDate,
            current,
            description,
            achievements: []
          });
        }
      } catch (error) {
        console.error('Error parsing experience item:', error);
      }
    });

    return experiences;
  });

  console.log(`   ✓ Found ${experience.length} work experiences`);
  return experience;
}

async function scrapeEducation(page: Page): Promise<PersonalData['education']> {
  console.log('🎓 Scraping education...');

  await page.goto(`https://www.linkedin.com/in/${LINKEDIN_USERNAME}/details/education/`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  await new Promise(resolve => setTimeout(resolve, 3000));

  const education = await page.evaluate(() => {
    const educationList: any[] = [];
    const items = document.querySelectorAll('.pvs-list__paged-list-item');

    items.forEach((item) => {
      try {
        // Institution
        const institutionElement = item.querySelector('.mr1.t-bold span[aria-hidden="true"]');
        const institution = institutionElement?.textContent?.trim() || '';

        // Degree and field
        const degreeElement = item.querySelector('.t-14.t-normal span[aria-hidden="true"]');
        const degreeText = degreeElement?.textContent?.trim() || '';
        const [degree, field] = degreeText.split(',').map(s => s.trim());

        // Dates
        const dateElement = item.querySelector('.t-14.t-normal.t-black--light span[aria-hidden="true"]');
        const dateText = dateElement?.textContent?.trim() || '';
        const dateParts = dateText.split(' - ');
        const startDate = dateParts[0]?.trim() || '';
        const endDate = dateParts[1]?.trim() || '';

        // Grade
        const gradeElements = Array.from(item.querySelectorAll('.t-14.t-normal span[aria-hidden="true"]'));
        let grade = '';
        gradeElements.forEach((el) => {
          const text = el.textContent?.trim() || '';
          if (text.toLowerCase().includes('grade') || text.toLowerCase().includes('gpa')) {
            grade = text;
          }
        });

        if (institution) {
          educationList.push({
            institution,
            degree: degree || 'Degree',
            field: field || 'Field of Study',
            startDate,
            endDate,
            grade: grade || undefined
          });
        }
      } catch (error) {
        console.error('Error parsing education item:', error);
      }
    });

    return educationList;
  });

  console.log(`   ✓ Found ${education.length} education entries`);
  return education;
}

async function scrapeSkills(page: Page): Promise<string[]> {
  console.log('🔧 Scraping skills...');

  await page.goto(`https://www.linkedin.com/in/${LINKEDIN_USERNAME}/details/skills/`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  await new Promise(resolve => setTimeout(resolve, 3000));

  const skills = await page.evaluate(() => {
    const skillsList: string[] = [];
    const items = document.querySelectorAll('.pvs-list__paged-list-item');

    items.forEach((item) => {
      try {
        const skillElement = item.querySelector('.mr1.t-bold span[aria-hidden="true"]');
        const skill = skillElement?.textContent?.trim() || '';

        if (skill) {
          skillsList.push(skill);
        }
      } catch (error) {
        console.error('Error parsing skill item:', error);
      }
    });

    return skillsList;
  });

  console.log(`   ✓ Found ${skills.length} skills`);
  return skills;
}

async function main() {
  console.log('🚀 Starting LinkedIn profile sync...\n');

  if (!LINKEDIN_EMAIL || !LINKEDIN_PASSWORD) {
    console.error('❌ Error: LinkedIn credentials not found in .env file');
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

    // Read existing data to preserve fields we don't scrape
    let existingData: PersonalData = {} as PersonalData;
    if (fs.existsSync(OUTPUT_FILE)) {
      existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
    }

    // Scrape all sections
    const basicInfo = await scrapeBasicInfo(page);
    const about = await scrapeAbout(page);
    const experience = await scrapeExperience(page);
    const education = await scrapeEducation(page);
    const skillsList = await scrapeSkills(page);

    // Helper function to deduplicate and normalize skills
    const deduplicateSkills = (skills: string[]): string[] => {
      const seen = new Set<string>();
      return skills.filter(skill => {
        const normalized = skill.toLowerCase().trim();
        if (seen.has(normalized)) {
          return false;
        }
        seen.add(normalized);
        return true;
      });
    };

    // Categorize skills (you can customize this logic)
    const categorizedSkills = {
      languages: deduplicateSkills(skillsList.filter(s =>
        ['TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'PowerShell', 'Go', 'Rust'].some(lang =>
          s.toLowerCase().includes(lang.toLowerCase())
        )
      )),
      frontend: deduplicateSkills(skillsList.filter(s =>
        ['React', 'Next.js', 'Vue', 'Angular', 'HTML', 'CSS', 'Tailwind'].some(tech =>
          s.toLowerCase().includes(tech.toLowerCase())
        )
      )),
      backend: deduplicateSkills(skillsList.filter(s =>
        ['Node', 'Express', 'FastAPI', 'Django', '.NET', 'Spring'].some(tech =>
          s.toLowerCase().includes(tech.toLowerCase())
        )
      )),
      databases: deduplicateSkills(skillsList.filter(s =>
        ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'SQL'].some(db =>
          s.toLowerCase().includes(db.toLowerCase())
        )
      )),
      cloud: deduplicateSkills(skillsList.filter(s =>
        ['AWS', 'Azure', 'Google Cloud', 'GCP', 'Vercel', 'Netlify'].some(cloud =>
          s.toLowerCase().includes(cloud.toLowerCase())
        )
      )),
      tools: deduplicateSkills(skillsList.filter(s =>
        ['Git', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins'].some(tool =>
          s.toLowerCase().includes(tool.toLowerCase())
        )
      )),
    };

    // Merge with existing data
    const updatedData: PersonalData = {
      ...existingData,
      name: basicInfo.name || existingData.name || '',
      title: basicInfo.title || existingData.title || '',
      location: basicInfo.location || existingData.location || '',
      bio: about || existingData.bio || '',
      email: existingData.email || 'contact@example.com',
      timezone: existingData.timezone || 'UTC +00:00',
      tagline: existingData.tagline || 'Building the future, one line of code at a time',
      socialLinks: existingData.socialLinks || {},
      skills: {
        languages: categorizedSkills.languages.length > 0 ? categorizedSkills.languages : existingData.skills?.languages || [],
        frontend: categorizedSkills.frontend.length > 0 ? categorizedSkills.frontend : existingData.skills?.frontend || [],
        backend: categorizedSkills.backend.length > 0 ? categorizedSkills.backend : existingData.skills?.backend || [],
        databases: categorizedSkills.databases.length > 0 ? categorizedSkills.databases : existingData.skills?.databases || [],
        cloud: categorizedSkills.cloud.length > 0 ? categorizedSkills.cloud : existingData.skills?.cloud || [],
        tools: categorizedSkills.tools.length > 0 ? categorizedSkills.tools : existingData.skills?.tools || [],
      },
      experience: experience.length > 0 ? experience : existingData.experience || [],
      education: education.length > 0 ? education : existingData.education || [],
      achievements: existingData.achievements || [],
    };

    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(updatedData, null, 2), 'utf-8');

    console.log('\n✅ LinkedIn profile sync completed!');
    console.log(`📄 Data saved to: ${OUTPUT_FILE}`);
    console.log('\n📊 Summary:');
    console.log(`   • Name: ${updatedData.name}`);
    console.log(`   • Title: ${updatedData.title}`);
    console.log(`   • Experience: ${updatedData.experience.length} entries`);
    console.log(`   • Education: ${updatedData.education.length} entries`);
    console.log(`   • Skills: ${skillsList.length} total`);

  } catch (error) {
    console.error('❌ Error syncing LinkedIn profile:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main();
