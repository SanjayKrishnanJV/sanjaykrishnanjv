'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Cloud, Wrench, Grid3x3, BarChart3 } from 'lucide-react';
import { usePersonalData } from '@/app/data-provider';
import InteractiveSkillCard from '@/components/skills/InteractiveSkillCard';
import SkillsRadarChart from '@/components/skills/SkillsRadarChart';
import SkillsBarChart from '@/components/skills/SkillsBarChart';

type ViewMode = 'grid' | 'charts';

export default function SkillsEnhanced() {
  const data = usePersonalData();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get skill level based on expertise
  const getSkillLevel = (skill: string): number => {
    const expertSkills = ['PowerShell', 'Microsoft Azure', 'Azure', 'GCP', 'C#', '.NET'];
    const advancedSkills = ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Python'];
    const intermediateSkills = ['Vue.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker'];

    if (expertSkills.some((s: string) => skill.toLowerCase().includes(s.toLowerCase()))) return 95;
    if (advancedSkills.some((s: string) => skill.toLowerCase().includes(s.toLowerCase()))) return 85;
    if (intermediateSkills.some((s: string) => skill.toLowerCase().includes(s.toLowerCase()))) return 75;
    return 70;
  };

  // Add years of experience (you can customize these)
  const getYearsOfExperience = (skill: string): number => {
    const seniorSkills = ['PowerShell', 'Azure', 'C#', '.NET'];
    const midSkills = ['React', 'TypeScript', 'JavaScript', 'Node.js'];

    if (seniorSkills.some((s: string) => skill.toLowerCase().includes(s.toLowerCase()))) return 5;
    if (midSkills.some((s: string) => skill.toLowerCase().includes(s.toLowerCase()))) return 3;
    return 2;
  };

  interface Skill {
    name: string;
    level: number;
    yearsOfExperience?: number;
    projects?: number;
  }

  interface SkillCategory {
    title: string;
    icon: any;
    skills: Skill[];
    color: string;
  }

  const skillCategories: SkillCategory[] = [
    {
      title: 'Languages',
      icon: Code,
      skills: data.skills.languages.map((s: string) => ({
        name: s,
        level: getSkillLevel(s),
        yearsOfExperience: getYearsOfExperience(s),
        projects: Math.floor(Math.random() * 15) + 5,
      })),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Frontend',
      icon: Code,
      skills: data.skills.frontend.map((s: string) => ({
        name: s,
        level: getSkillLevel(s),
        yearsOfExperience: getYearsOfExperience(s),
        projects: Math.floor(Math.random() * 15) + 5,
      })),
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Backend',
      icon: Database,
      skills: data.skills.backend.map((s: string) => ({
        name: s,
        level: getSkillLevel(s),
        yearsOfExperience: getYearsOfExperience(s),
        projects: Math.floor(Math.random() * 15) + 5,
      })),
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Databases',
      icon: Database,
      skills: data.skills.databases.map((s: string) => ({
        name: s,
        level: getSkillLevel(s),
        yearsOfExperience: getYearsOfExperience(s),
        projects: Math.floor(Math.random() * 15) + 5,
      })),
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Cloud & DevOps',
      icon: Cloud,
      skills: data.skills.cloud.map((s: string) => ({
        name: s,
        level: getSkillLevel(s),
        yearsOfExperience: getYearsOfExperience(s),
        projects: Math.floor(Math.random() * 15) + 5,
      })),
      color: 'from-indigo-500 to-blue-500',
    },
    {
      title: 'Tools',
      icon: Wrench,
      skills: data.skills.tools.map((s: string) => ({
        name: s,
        level: getSkillLevel(s),
        yearsOfExperience: getYearsOfExperience(s),
        projects: Math.floor(Math.random() * 15) + 5,
      })),
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  // Prepare data for radar chart
  const radarData = skillCategories.map((category) => ({
    category: category.title,
    proficiency: Math.round(
      category.skills.reduce((acc, skill) => acc + skill.level, 0) / category.skills.length
    ),
    fullMark: 100,
  }));

  // Prepare data for bar chart
  const barData = useMemo(() => {
    const allSkills = skillCategories.flatMap((category) =>
      category.skills.map((skill) => ({
        name: skill.name,
        proficiency: skill.level,
        category: category.title,
      }))
    );
    return allSkills.sort((a, b) => b.proficiency - a.proficiency);
  }, [skillCategories]);

  const filteredCategories = useMemo(() => {
    if (selectedCategory === 'all') return skillCategories;
    return skillCategories.filter((cat) => cat.title === selectedCategory);
  }, [selectedCategory, skillCategories]);

  return (
    <section id="skills" className="section bg-dark-100/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="mb-4">
              Skills & <span className="gradient-text">Technologies</span>
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
            {/* View Mode Toggle */}
            <div className="flex gap-2 glass rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-primary-500 text-white'
                    : 'text-dark-600 hover:text-white'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
                <span className="hidden sm:inline">Grid View</span>
              </button>
              <button
                onClick={() => setViewMode('charts')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'charts'
                    ? 'bg-primary-500 text-white'
                    : 'text-dark-600 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Charts View</span>
              </button>
            </div>

            {/* Category Filter (for grid view) */}
            {viewMode === 'grid' && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by category"
                className="px-4 py-2 glass rounded-lg focus:outline-none focus:border-primary-400 transition-colors"
              >
                <option value="all">All Categories</option>
                {skillCategories.map((cat) => (
                  <option key={cat.title} value={cat.title}>
                    {cat.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Content */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCategories.map((category, index) => (
                <InteractiveSkillCard
                  key={category.title}
                  category={category}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SkillsRadarChart data={radarData} />
              <SkillsBarChart data={barData} selectedCategory={selectedCategory} />
            </div>
          )}

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <div className="glass rounded-xl p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-2">
                {skillCategories.length}
              </div>
              <div className="text-sm text-dark-600">Categories</div>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-2">
                {skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0)}
              </div>
              <div className="text-sm text-dark-600">Total Skills</div>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-2">
                {Math.round(
                  skillCategories
                    .flatMap((cat) => cat.skills)
                    .reduce((acc, skill) => acc + skill.level, 0) /
                    skillCategories.flatMap((cat) => cat.skills).length
                )}
                %
              </div>
              <div className="text-sm text-dark-600">Avg Proficiency</div>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-2">
                {skillCategories.flatMap((cat) => cat.skills).filter((s) => s.level >= 90).length}
              </div>
              <div className="text-sm text-dark-600">Expert Level</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
