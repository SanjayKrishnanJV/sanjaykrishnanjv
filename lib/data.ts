import 'server-only';
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export function getPersonalData() {
  const filePath = path.join(DATA_DIR, 'personal.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

export function getGitHubData() {
  const filePath = path.join(DATA_DIR, 'github.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

export function getCertifications() {
  const filePath = path.join(DATA_DIR, 'certifications.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

export function getProjects() {
  const githubData = getGitHubData();
  return githubData.pinnedRepos || githubData.repositories?.slice(0, 6) || [];
}

export function getStats() {
  const githubData = getGitHubData();
  const certifications = getCertifications();

  return {
    github: githubData.stats || {},
    certifications: certifications.length,
  };
}
