'use client';

import { motion } from 'framer-motion';
import { Star, Quote, Linkedin } from 'lucide-react';
import type { Testimonial } from '@/lib/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

export default function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-xl p-8 hover:bg-white/10 transition-all duration-300 group h-full flex flex-col"
    >
      {/* Quote Icon */}
      <div className="mb-6">
        <Quote className="w-10 h-10 text-primary-400 opacity-50" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + i * 0.05 }}
          >
            <Star
              className={`w-5 h-5 ${
                i < testimonial.rating
                  ? 'fill-yellow-500 text-yellow-500'
                  : 'text-dark-600'
              }`}
            />
          </motion.div>
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-dark-700 mb-6 flex-grow">
        "{testimonial.quote}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4 pt-6 border-t border-white/10">
        {/* Avatar */}
        <div className="relative">
          {testimonial.image ? (
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {testimonial.name.charAt(0)}
            </div>
          )}
          {testimonial.linkedInUrl && (
            <a
              href={testimonial.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -bottom-1 -right-1 p-1 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
            >
              <Linkedin className="w-3 h-3 text-white" />
            </a>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="font-semibold">{testimonial.name}</p>
          <p className="text-sm text-dark-600">
            {testimonial.position} at {testimonial.company}
          </p>
          <p className="text-xs text-dark-600 mt-1">{testimonial.relationship}</p>
        </div>
      </div>
    </motion.div>
  );
}
