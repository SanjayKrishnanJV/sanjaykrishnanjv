'use client';

import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import { usePersonalData } from '@/app/data-provider';

interface Experience {
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description?: string;
  achievements?: string[];
}

export default function Experience() {
  const data = usePersonalData();
  const experiences: Experience[] = data.experience || [];

  return (
    <section id="experience" className="section">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="mb-4">
              Work <span className="gradient-text">Experience</span>
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              Professional journey and career milestones
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {experiences.map((exp: Experience, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative pl-8 pb-12 last:pb-0"
              >
                {/* Timeline line */}
                {index !== experiences.length - 1 && (
                  <div className="absolute left-[15px] top-12 bottom-0 w-px bg-gradient-to-b from-primary-500 to-transparent" />
                )}

                {/* Timeline dot */}
                <div className="absolute left-0 top-2 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center ring-4 ring-dark-50">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>

                {/* Content */}
                <div className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{exp.position}</h3>
                      <p className="text-xl text-primary-400 font-semibold mb-2">
                        {exp.company}
                      </p>
                    </div>
                    {exp.current && (
                      <span className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium w-fit">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 mb-4 text-dark-700">
                    {exp.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </span>
                    </div>
                  </div>

                  {exp.description && (
                    <p className="text-dark-700 mb-4">{exp.description}</p>
                  )}

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Key Achievements:</h4>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement: string, i: number) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 flex-shrink-0" />
                            <span className="text-dark-700">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
