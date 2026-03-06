import GlobalSearch from './GlobalSearch';
import { getAllPosts } from '@/lib/blog';
import { getAllProjects } from '@/lib/projects';
import { getSkillsData } from '@/lib/skills';

export default function GlobalSearchWrapper() {
  // Fetch data server-side
  const posts = getAllPosts();
  const projects = getAllProjects();
  const skills = getSkillsData();

  // Format data for search
  const blogPosts = posts.map((post: any) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    tags: post.tags,
  }));

  const projectsData = projects.map((project: any) => ({
    id: project.id.toString(),
    title: project.title,
    description: project.description,
  }));

  const skillsData = skills.flatMap((category: any) =>
    category.skills.map((skill: any) => ({
      name: skill.name,
      category: category.category,
    }))
  );

  return (
    <GlobalSearch
      blogPosts={blogPosts}
      projects={projectsData}
      skills={skillsData}
    />
  );
}
