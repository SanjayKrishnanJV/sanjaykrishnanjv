'use client';

import { motion } from 'framer-motion';
import { Trophy, ExternalLink, Calendar } from 'lucide-react';
import { usePersonalData } from '@/app/data-provider';

export default function Achievements() {
  const data = usePersonalData();
  const achievements = data.achievements || [];

  if (achievements.length === 0) {
    return null;
  }

  return (
    <section id="achievements" className="section">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="mb-4">
              Achievements & <span className="gradient-text">Recognition</span>
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              Notable accomplishments and recognitions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="p-3 bg-primary-500/20 rounded-lg w-fit mb-4 group-hover:bg-primary-500/30 transition-colors">
                  <Trophy className="w-6 h-6 text-primary-400" />
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">
                  {achievement.title}
                </h3>

                {achievement.description && (
                  <p className="text-dark-700 mb-4">{achievement.description}</p>
                )}

                {achievement.date && (
                  <div className="flex items-center gap-2 text-sm text-dark-600 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{achievement.date}</span>
                  </div>
                )}

                {achievement.url && (
                  <a
                    href={achievement.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
                  >
                    <span>View More</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
