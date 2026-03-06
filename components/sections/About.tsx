'use client';

import { motion } from 'framer-motion';
import { User, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { usePersonalData } from '@/app/data-provider';

export default function About() {
  const data = usePersonalData();

  const stats = [
    {
      icon: Briefcase,
      label: 'Experience',
      value: data.experience?.[0]?.company || 'Mediware Inc',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: data.location,
    },
    {
      icon: GraduationCap,
      label: 'Education',
      value: data.education?.[0]?.degree || 'B.Tech CS',
    },
  ];

  return (
    <section id="about" className="section">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="mb-4">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              Get to know more about my background, skills, and what drives me
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Stats */}
            <div>
              <div className="glass rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary-500/20 rounded-lg">
                    <User className="w-6 h-6 text-primary-400" />
                  </div>
                  <h3 className="text-2xl font-bold">Professional Profile</h3>
                </div>

                <p className="text-dark-700 leading-relaxed mb-6">
                  {data.bio}
                </p>

                <div className="grid grid-cols-1 gap-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="flex items-center gap-4 p-4 glass rounded-lg">
                        <Icon className="w-5 h-5 text-primary-400" />
                        <div>
                          <p className="text-sm text-dark-600">{stat.label}</p>
                          <p className="font-semibold">{stat.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Additional info */}
            <div>
              <h3 className="text-2xl font-bold mb-6">What I Do</h3>

              <div className="space-y-6">
                <div className="glass rounded-xl p-6">
                  <h4 className="text-xl font-semibold mb-3 text-primary-400">Full-Stack Development</h4>
                  <p className="text-dark-700">
                    Building modern, responsive web applications using cutting-edge technologies like React, Next.js, and TypeScript.
                  </p>
                </div>

                <div className="glass rounded-xl p-6">
                  <h4 className="text-xl font-semibold mb-3 text-primary-400">Data Integration</h4>
                  <p className="text-dark-700">
                    Designing and implementing robust data integration solutions that connect disparate systems and enable seamless data flow.
                  </p>
                </div>

                <div className="glass rounded-xl p-6">
                  <h4 className="text-xl font-semibold mb-3 text-primary-400">Cloud Solutions</h4>
                  <p className="text-dark-700">
                    Architecting scalable cloud infrastructure and deploying applications on AWS, Azure, and other cloud platforms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
