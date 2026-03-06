'use client';

import { motion } from 'framer-motion';
import { Code2, Database, Cloud, Wrench, Layers } from 'lucide-react';

interface Technologies {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  infrastructure?: string[];
  tools?: string[];
}

interface TechStackSectionProps {
  technologies: Technologies;
}

export default function TechStackSection({ technologies }: TechStackSectionProps) {
  const techCategories = [
    {
      title: 'Frontend',
      icon: Code2,
      items: technologies.frontend || [],
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Backend',
      icon: Layers,
      items: technologies.backend || [],
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Database',
      icon: Database,
      items: technologies.database || [],
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Infrastructure',
      icon: Cloud,
      items: technologies.infrastructure || [],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Tools',
      icon: Wrench,
      items: technologies.tools || [],
      color: 'from-yellow-500 to-orange-500',
    },
  ].filter((category) => category.items.length > 0);

  return (
    <section className="section bg-dark-100/50">
      <div className="container-custom">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Technology <span className="gradient-text">Stack</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{category.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.items.map((tech, techIndex) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + techIndex * 0.05 }}
                      className="px-3 py-1 glass rounded-full text-sm hover:bg-white/10 transition-colors"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
