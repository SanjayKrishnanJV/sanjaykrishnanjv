#!/usr/bin/env tsx
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

const GITHUB_USERNAME = 'SanjayKrishnanJV';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const DATA_DIR = path.join(process.cwd(), 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'github.json');

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  open_issues_count: number;
}

interface GitHubProfile {
  login: string;
  name: string;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  blog: string;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

interface LanguageStats {
  [key: string]: number;
}

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

async function fetchGitHub(endpoint: string): Promise<any> {
  const url = `https://api.github.com${endpoint}`;
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-Sync-Script',
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function getProfile(): Promise<GitHubProfile> {
  console.log('📥 Fetching GitHub profile...');
  return fetchGitHub(`/users/${GITHUB_USERNAME}`);
}

async function getRepositories(): Promise<GitHubRepo[]> {
  console.log('📦 Fetching repositories...');
  const repos = await fetchGitHub(`/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);

  // Filter out forks and sort by stars
  const ownRepos = repos.filter((repo: any) => !repo.fork);

  return ownRepos.sort((a: GitHubRepo, b: GitHubRepo) =>
    b.stargazers_count - a.stargazers_count
  );
}

async function getLanguageStats(repos: GitHubRepo[]): Promise<LanguageStats> {
  console.log('💻 Calculating language statistics...');
  const stats: LanguageStats = {};

  for (const repo of repos) {
    try {
      const languages = await fetchGitHub(`/repos/${repo.full_name}/languages`);

      for (const [lang, bytes] of Object.entries(languages)) {
        stats[lang] = (stats[lang] || 0) + (bytes as number);
      }

      // Rate limiting: wait 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.warn(`⚠️  Failed to fetch languages for ${repo.name}`);
    }
  }

  return stats;
}

async function getPinnedRepos(repos: GitHubRepo[]): Promise<GitHubRepo[]> {
  // Since GitHub doesn't provide a direct API for pinned repos,
  // we'll return the top 6 repos by stars
  return repos.slice(0, 6);
}

async function getContributionStats(): Promise<{
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
}> {
  // Note: Contribution graph data requires GraphQL API or scraping
  // For now, return placeholder data
  // In production, you might want to use GitHub GraphQL API
  console.log('📊 Contribution stats require GraphQL API (placeholder data)...');

  return {
    totalContributions: 0,
    currentStreak: 0,
    longestStreak: 0,
  };
}

async function main() {
  console.log('🚀 Starting GitHub data sync...\n');

  try {
    // Fetch all data
    const profile = await getProfile();
    const repositories = await getRepositories();
    const pinnedRepos = await getPinnedRepos(repositories);
    const languageStats = await getLanguageStats(repositories);
    const contributionStats = await getContributionStats();

    // Calculate total stars
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);

    // Prepare output data
    const data = {
      profile: {
        username: profile.login,
        name: profile.name,
        avatar: profile.avatar_url,
        bio: profile.bio,
        company: profile.company,
        location: profile.location,
        email: profile.email,
        website: profile.blog,
        twitter: profile.twitter_username,
        publicRepos: profile.public_repos,
        publicGists: profile.public_gists,
        followers: profile.followers,
        following: profile.following,
        createdAt: profile.created_at,
      },
      repositories: repositories.map(repo => ({
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        topics: repo.topics,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        size: repo.size,
        openIssues: repo.open_issues_count,
      })),
      pinnedRepos: pinnedRepos.map(repo => ({
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        topics: repo.topics,
      })),
      stats: {
        totalRepos: profile.public_repos,
        totalStars,
        totalForks,
        followers: profile.followers,
        following: profile.following,
        languages: languageStats,
        contributions: contributionStats,
      },
      lastUpdated: new Date().toISOString(),
    };

    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf-8');

    console.log('\n✅ GitHub data synced successfully!');
    console.log(`📄 Data saved to: ${OUTPUT_FILE}`);
    console.log(`\n📊 Stats:`);
    console.log(`   - Repositories: ${data.stats.totalRepos}`);
    console.log(`   - Total Stars: ${data.stats.totalStars}`);
    console.log(`   - Total Forks: ${data.stats.totalForks}`);
    console.log(`   - Followers: ${data.stats.followers}`);
    console.log(`   - Top Languages: ${Object.keys(languageStats).slice(0, 5).join(', ')}`);

  } catch (error) {
    console.error('❌ Error syncing GitHub data:', error);
    process.exit(1);
  }
}

main();
