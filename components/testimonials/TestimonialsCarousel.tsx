'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star, Linkedin, Pause, Play } from 'lucide-react';
import type { Testimonial } from '@/lib/testimonials';

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  autoRotate?: boolean;
  interval?: number;
}

export default function TestimonialsCarousel({
  testimonials,
  autoRotate = true,
  interval = 5000,
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!autoRotate || isPaused || testimonials.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoRotate, isPaused, interval, testimonials.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative">
      {/* Main Testimonial */}
      <div className="relative min-h-[400px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="glass rounded-xl p-8 md:p-12">
              {/* Quote Icon */}
              <Quote className="w-16 h-16 text-primary-400 opacity-30 mb-6" />

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < currentTestimonial.rating
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-dark-600'
                    }`}
                  />
                ))}
              </div>

              {/* Quote Text */}
              <blockquote className="text-xl md:text-2xl text-dark-800 mb-8 leading-relaxed">
                "{currentTestimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                {currentTestimonial.image ? (
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                    {currentTestimonial.name.charAt(0)}
                  </div>
                )}

                <div className="flex-1">
                  <p className="text-lg font-bold">{currentTestimonial.name}</p>
                  <p className="text-dark-600">
                    {currentTestimonial.position} at {currentTestimonial.company}
                  </p>
                  <p className="text-sm text-dark-600 mt-1">
                    {currentTestimonial.relationship}
                  </p>
                </div>

                {currentTestimonial.linkedInUrl && (
                  <a
                    href={currentTestimonial.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 glass hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Linkedin className="w-6 h-6 text-blue-500" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {testimonials.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 p-3 glass hover:bg-white/20 rounded-full transition-all z-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 p-3 glass hover:bg-white/20 rounded-full transition-all z-10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-8">
        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-primary-400'
                  : 'w-2 bg-dark-600 hover:bg-dark-500'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Play/Pause */}
        {autoRotate && testimonials.length > 1 && (
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 glass hover:bg-white/20 rounded-lg transition-colors"
            aria-label={isPaused ? 'Resume auto-rotation' : 'Pause auto-rotation'}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
