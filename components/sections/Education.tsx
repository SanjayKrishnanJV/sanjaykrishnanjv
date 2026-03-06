'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Award } from 'lucide-react';
import { usePersonalData } from '@/app/data-provider';

export default function Education() {
  const data = usePersonalData();
  const education = data.education || [];

  return (
    <section id="education" className="section bg-dark-100/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="mb-4">
              <span className="gradient-text">Education</span>
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              Academic background and qualifications
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="p-4 bg-primary-500/20 rounded-xl flex-shrink-0">
                    <GraduationCap className="w-8 h-8 text-primary-400" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{edu.degree}</h3>
                    {edu.field && (
                      <p className="text-lg text-primary-400 font-semibold mb-2">
                        {edu.field}
                      </p>
                    )}
                    <p className="text-xl text-dark-700 mb-4">{edu.institution}</p>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 text-dark-700">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {edu.startDate} - {edu.endDate}
                        </span>
                      </div>
                      {edu.grade && (
                        <div className="flex items-center gap-2 text-dark-700">
                          <Award className="w-4 h-4" />
                          <span>{edu.grade}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
