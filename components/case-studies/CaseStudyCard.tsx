'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { CaseStudy } from '@/lib/case-studies';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  index: number;
}

export default function CaseStudyCard({ caseStudy, index }: CaseStudyCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 group flex flex-col h-full"
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={caseStudy.coverImage}
          alt={caseStudy.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 glass rounded-full text-xs font-medium">
            {caseStudy.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">
          {caseStudy.title}
        </h3>

        {/* Tagline */}
        <p className="text-primary-400 mb-3">{caseStudy.tagline}</p>

        {/* Description */}
        <p className="text-dark-700 mb-4 flex-grow line-clamp-3">{caseStudy.description}</p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-dark-600 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {caseStudy.timeline.duration}
          </span>
          {caseStudy.team && (
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {caseStudy.team.size} people
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {caseStudy.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-1 glass rounded text-xs">
              {tag}
            </span>
          ))}
          {caseStudy.tags.length > 3 && (
            <span className="px-2 py-1 glass rounded text-xs">+{caseStudy.tags.length - 3}</span>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/case-studies/${caseStudy.id}`}
          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors group/link"
        >
          <span>View Case Study</span>
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.article>
  );
}
