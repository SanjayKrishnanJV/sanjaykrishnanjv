'use client';

import { motion } from 'framer-motion';
import { getFeaturedCaseStudies } from '@/lib/case-studies';
import CaseStudyCard from '@/components/case-studies/CaseStudyCard';
import { FolderOpen } from 'lucide-react';

export default function CaseStudies() {
  const featuredCaseStudies = getFeaturedCaseStudies(3);

  if (featuredCaseStudies.length === 0) {
    return null;
  }

  return (
    <section id="case-studies" className="section">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="mb-4">
              Featured <span className="gradient-text">Case Studies</span>
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              Deep dives into selected projects showcasing challenges, solutions, and measurable outcomes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCaseStudies.map((caseStudy, index) => (
              <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} index={index} />
            ))}
          </div>

          {/* View All Link */}
          <div className="text-center mt-12">
            <a href="#projects" className="btn-secondary">
              <FolderOpen className="w-5 h-5" />
              View All Projects
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
