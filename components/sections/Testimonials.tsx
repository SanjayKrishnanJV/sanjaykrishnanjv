'use client';

import { motion } from 'framer-motion';
import { MessageSquareQuote, Star, Users } from 'lucide-react';
import { getAllTestimonials, getAverageRating } from '@/lib/testimonials';
import TestimonialsCarousel from '@/components/testimonials/TestimonialsCarousel';
import TestimonialCard from '@/components/testimonials/TestimonialCard';

export default function Testimonials() {
  const testimonials = getAllTestimonials();
  const averageRating = getAverageRating();

  return (
    <section id="testimonials" className="section bg-dark-100/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="mb-4">
              Client <span className="gradient-text">Testimonials</span>
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto mb-8">
              What colleagues and clients say about working with me
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                <span className="text-dark-600">/ 5.0 Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-400" />
                <span className="text-2xl font-bold">{testimonials.length}</span>
                <span className="text-dark-600">Recommendations</span>
              </div>
            </div>
          </div>

          {/* Carousel */}
          <div className="mb-16">
            <TestimonialsCarousel testimonials={testimonials} autoRotate interval={7000} />
          </div>

          {/* All Testimonials Grid */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <MessageSquareQuote className="w-6 h-6 text-primary-400" />
              All Recommendations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center glass rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold mb-4">Worked with me?</h3>
            <p className="text-dark-600 mb-6">
              I'd love to hear your feedback! Leave a recommendation on LinkedIn.
            </p>
            <a
              href="https://linkedin.com/in/sanjaykrishnanjv"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <MessageSquareQuote className="w-5 h-5" />
              Leave a Recommendation
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
