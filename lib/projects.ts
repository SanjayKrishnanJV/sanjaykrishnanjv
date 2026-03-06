import 'server-only';
import { getGitHubData } from './data';

export function getAllProjects() {
  const githubData = getGitHubData();
  const projects = githubData.pinnedRepos || githubData.repositories?.slice(0, 6) || [];

  return projects.map((project: any) => ({
    id: project.name,
    title: project.name,
    description: project.description || 'No description available',
    technologies: project.topics || [],
    githubUrl: project.html_url || `https://github.com/SanjayKrishnanJV/${project.name}`,
    stars: project.stargazers_count || 0,
    forks: project.forks_count || 0,
  }));
}

export function getProjectById(id: string) {
  const projects = getAllProjects();
  return projects.find((project: any) => project.id === id);
}
