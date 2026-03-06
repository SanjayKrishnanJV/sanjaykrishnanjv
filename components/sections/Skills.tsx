'use client';

import { motion } from 'framer-motion';
import { Code, Database, Cloud, Wrench } from 'lucide-react';
import { usePersonalData } from '@/app/data-provider';

export default function Skills() {
  const data = usePersonalData();

  // Add proficiency levels (you can customize these based on your expertise)
  const getSkillLevel = (skill: string): number => {
    const expertSkills = ['PowerShell', 'Microsoft Azure', 'Azure', 'GCP'];
    const advancedSkills = ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js'];
    const intermediateSkills = ['Vue.js', 'Express', 'MongoDB', 'PostgreSQL'];

    if (expertSkills.some((s: string) => skill.includes(s))) return 95;
    if (advancedSkills.some((s: string) => skill.includes(s))) return 85;
    if (intermediateSkills.some((s: string) => skill.includes(s))) return 75;
    return 70;
  };

  interface Skill {
    name: string;
    level: number;
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
      skills: data.skills.languages.map((s: string) => ({ name: s, level: getSkillLevel(s) })),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Frontend',
      icon: Code,
      skills: data.skills.frontend.map((s: string) => ({ name: s, level: getSkillLevel(s) })),
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Backend',
      icon: Database,
      skills: data.skills.backend.map((s: string) => ({ name: s, level: getSkillLevel(s) })),
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Databases',
      icon: Database,
      skills: data.skills.databases.map((s: string) => ({ name: s, level: getSkillLevel(s) })),
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Cloud & DevOps',
      icon: Cloud,
      skills: data.skills.cloud.map((s: string) => ({ name: s, level: getSkillLevel(s) })),
      color: 'from-indigo-500 to-blue-500',
    },
    {
      title: 'Tools',
      icon: Wrench,
      skills: data.skills.tools.map((s: string) => ({ name: s, level: getSkillLevel(s) })),
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  return (
    <section id="skills" className="section bg-dark-100/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="mb-4">
              Skills & <span className="gradient-text">Technologies</span>
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category: SkillCategory, index: number) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} bg-opacity-20`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{category.title}</h3>
                  </div>

                  <div className="space-y-4">
                    {category.skills.map((skill: Skill, skillIndex: number) => (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-sm text-dark-600">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-dark-200/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + skillIndex * 0.05, duration: 1, ease: 'easeOut' }}
                            className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
