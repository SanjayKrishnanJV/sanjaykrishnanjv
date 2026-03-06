// Client-side cached data
// This gets populated at build time and doesn't need fs

let cachedPersonalData: any = null;
let cachedGitHubData: any = null;
let cachedCertifications: any = null;

export function setDataCache(personal: any, github: any, certifications: any) {
  cachedPersonalData = personal;
  cachedGitHubData = github;
  cachedCertifications = certifications;
}

export function getPersonalData() {
  if (typeof window !== 'undefined' && cachedPersonalData) {
    return cachedPersonalData;
  }
  // Fallback for client-side - import from public JSON
  return cachedPersonalData || {};
}

export function getGitHubData() {
  if (typeof window !== 'undefined' && cachedGitHubData) {
    return cachedGitHubData;
  }
  return cachedGitHubData || { stats: {}, repositories: [], pinnedRepos: [] };
}

export function getCertifications() {
  if (typeof window !== 'undefined' && cachedCertifications) {
    return cachedCertifications;
  }
  return cachedCertifications || [];
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
