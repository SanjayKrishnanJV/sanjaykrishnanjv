import 'server-only';
import { getPersonalData } from './data';

export function getSkillsData() {
  const personal = getPersonalData();
  const skills = personal.skills;

  const categories = [
    {
      category: 'Programming Languages',
      skills: skills.languages?.map((name: string) => ({ name, level: 'Advanced' })) || [],
    },
    {
      category: 'Frontend Development',
      skills: skills.frontend?.map((name: string) => ({ name, level: 'Advanced' })) || [],
    },
    {
      category: 'Backend Development',
      skills: skills.backend?.map((name: string) => ({ name, level: 'Advanced' })) || [],
    },
    {
      category: 'Databases',
      skills: skills.databases?.map((name: string) => ({ name, level: 'Intermediate' })) || [],
    },
    {
      category: 'Cloud & Infrastructure',
      skills: skills.cloud?.map((name: string) => ({ name, level: 'Advanced' })) || [],
    },
    {
      category: 'DevOps & Tools',
      skills: skills.tools?.map((name: string) => ({ name, level: 'Intermediate' })) || [],
    },
  ];

  return categories.filter((category) => category.skills.length > 0);
}
