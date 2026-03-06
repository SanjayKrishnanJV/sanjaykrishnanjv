'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BarChart3, Github, ArrowRight, TrendingUp, Activity } from 'lucide-react';

const dashboards = [
  {
    title: 'Analytics Dashboard',
    description: 'Real-time visitor statistics and insights',
    icon: BarChart3,
    href: '/analytics',
    gradient: 'from-blue-500 to-purple-500',
    stats: ['Visitor Trends', 'Page Views', 'Device Distribution'],
  },
  {
    title: 'Project Statistics',
    description: 'Live GitHub repository analytics',
    icon: Github,
    href: '/projects-stats',
    gradient: 'from-green-500 to-teal-500',
    stats: ['Repository Stats', 'Top Languages', 'Stars & Forks'],
  },
];

export default function Dashboards() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Live <span className="gradient-text">Dashboards</span>
          </h2>
          <p className="text-lg text-dark-600 max-w-2xl mx-auto">
            Explore real-time analytics and project insights
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {dashboards.map((dashboard, index) => {
            const Icon = dashboard.icon;
            return (
              <motion.div
                key={dashboard.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={dashboard.href}>
                  <div className="glass rounded-2xl p-8 h-full hover:scale-105 transition-all duration-300 group cursor-pointer">
                    {/* Icon with gradient background */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${dashboard.gradient} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-full h-full text-white" />
                    </div>

                    {/* Title and description */}
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-400 transition-colors">
                      {dashboard.title}
                    </h3>
                    <p className="text-dark-600 mb-6">
                      {dashboard.description}
                    </p>

                    {/* Stats list */}
                    <ul className="space-y-2 mb-6">
                      {dashboard.stats.map((stat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-dark-700">
                          <TrendingUp className="w-4 h-4 text-primary-400" />
                          {stat}
                        </li>
                      ))}
                    </ul>

                    {/* View Dashboard link */}
                    <div className="flex items-center gap-2 text-primary-400 font-medium group-hover:gap-4 transition-all">
                      View Dashboard
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
