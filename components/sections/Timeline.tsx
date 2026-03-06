'use client';

import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Award, Calendar } from 'lucide-react';
import { usePersonalData } from '@/app/data-provider';
import { format } from 'date-fns';

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

interface Education {
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate: string;
  grade?: string;
}

export default function Timeline() {
  const data = usePersonalData();

  // Helper function to parse date strings to comparable values
  const parseDate = (dateStr: string | null): number => {
    if (!dateStr) return 9999999; // Future date for current positions

    // Handle "MMM YYYY" format
    const monthYearMatch = dateStr.match(/^([A-Za-z]+)\s+(\d{4})$/);
    if (monthYearMatch) {
      const [, month, year] = monthYearMatch;
      const monthMap: { [key: string]: number } = {
        jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
        jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
      };
      const monthNum = monthMap[month.toLowerCase()] || 1;
      return parseInt(year) * 100 + monthNum;
    }

    // Handle "YYYY" format
    const yearMatch = dateStr.match(/^\d{4}$/);
    if (yearMatch) {
      return parseInt(dateStr) * 100;
    }

    return 0;
  };

  const timelineItems = [
    ...data.experience.map((exp: Experience) => ({
      type: 'work' as const,
      title: exp.position,
      organization: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: exp.current,
      description: exp.description,
      icon: Briefcase,
    })),
    ...data.education.map((edu: Education) => ({
      type: 'education' as const,
      title: edu.degree,
      organization: edu.institution,
      location: edu.field,
      startDate: edu.startDate,
      endDate: edu.endDate,
      current: false,
      description: edu.grade,
      icon: GraduationCap,
    })),
  ].sort((a, b) => {
    const aDate = parseDate(a.endDate);
    const bDate = parseDate(b.endDate);
    return bDate - aDate; // Descending order (most recent first)
  });

  const getColor = (type: 'work' | 'education') => {
    return type === 'work'
      ? 'from-primary-500 to-blue-500'
      : 'from-purple-500 to-pink-500';
  };

  return (
    <section id="timeline" className="section bg-dark-100/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="mb-4">
              Career <span className="gradient-text">Timeline</span>
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              My professional journey at a glance
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500/50 to-purple-500/50" />

              {/* Timeline items */}
              <div className="space-y-12">
                {timelineItems.map((item, index) => {
                  const Icon = item.icon;
                  const isLeft = index % 2 === 0;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative flex items-center ${
                        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      {/* Content */}
                      <div className={`flex-1 ${isLeft ? 'md:pr-12' : 'md:pl-12'} pl-16 md:pl-0`}>
                        <div className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold">{item.title}</h3>
                            {item.current && (
                              <span className="px-2 py-1 text-xs glass rounded-full">
                                Current
                              </span>
                            )}
                          </div>

                          <p className="text-primary-400 font-medium mb-2">
                            {item.organization}
                          </p>

                          <div className="flex items-center gap-2 text-sm text-dark-600 mb-3">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {item.startDate} - {item.current ? 'Present' : item.endDate}
                            </span>
                            {item.location && (
                              <>
                                <span>•</span>
                                <span>{item.location}</span>
                              </>
                            )}
                          </div>

                          {item.description && (
                            <p className="text-dark-600 text-sm">{item.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Icon */}
                      <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2">
                        <div className={`p-3 rounded-full bg-gradient-to-r ${getColor(item.type)} shadow-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
