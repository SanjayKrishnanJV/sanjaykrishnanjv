'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Award, Calendar } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  yearsOfExperience?: number;
  projects?: number;
}

interface InteractiveSkillCardProps {
  category: {
    title: string;
    icon: any;
    skills: Skill[];
    color: string;
  };
  index: number;
}

export default function InteractiveSkillCard({ category, index }: InteractiveSkillCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group"
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          className={`p-3 rounded-lg bg-gradient-to-r ${category.color}`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        <div className="flex-1">
          <h3 className="text-xl font-bold">{category.title}</h3>
          <p className="text-xs text-dark-600">
            {category.skills.length} skill{category.skills.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-4">
        {category.skills.map((skill, skillIndex) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + skillIndex * 0.05 }}
            onHoverStart={() => setHoveredSkill(skill.name)}
            onHoverEnd={() => setHoveredSkill(null)}
          >
            {/* Skill Name and Level */}
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">{skill.name}</span>
              <motion.span
                className="text-sm text-dark-600"
                animate={{
                  scale: hoveredSkill === skill.name ? 1.1 : 1,
                  color: hoveredSkill === skill.name ? '#38bdf8' : '#71717a',
                }}
              >
                {skill.level}%
              </motion.span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-dark-200/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1 + skillIndex * 0.05,
                  duration: 1,
                  ease: 'easeOut',
                }}
                className={`h-full bg-gradient-to-r ${category.color} rounded-full relative`}
                whileHover={{ opacity: 0.8 }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: 'linear',
                  }}
                />
              </motion.div>
            </div>

            {/* Additional Info on Hover */}
            <AnimatePresence>
              {hoveredSkill === skill.name && isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 flex gap-4 text-xs text-dark-600"
                >
                  {skill.yearsOfExperience && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{skill.yearsOfExperience}+ years</span>
                    </div>
                  )}
                  {skill.projects && (
                    <div className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>{skill.projects} projects</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>
                      {skill.level >= 90
                        ? 'Expert'
                        : skill.level >= 75
                        ? 'Advanced'
                        : skill.level >= 60
                        ? 'Intermediate'
                        : 'Beginner'}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Average Proficiency */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isExpanded ? 1 : 0 }}
        className="mt-6 pt-4 border-t border-white/10"
      >
        <div className="flex justify-between text-sm">
          <span className="text-dark-600">Average Proficiency</span>
          <span className="font-semibold text-primary-400">
            {Math.round(
              category.skills.reduce((acc, skill) => acc + skill.level, 0) /
                category.skills.length
            )}
            %
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
