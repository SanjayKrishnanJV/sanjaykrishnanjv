'use client';

import { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, ArrowDown, Sparkles, Download, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePersonalData } from '@/app/data-provider';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const data = usePersonalData();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-dark-800">Available for opportunities</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            Hi, I'm <span className="gradient-text">{data.name}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-dark-700 mb-6 font-medium"
          >
            Senior System Engineer at WellSky
          </motion.p>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-dark-600 mb-8 max-w-2xl mx-auto"
          >
            Specializing in Azure, AVD & Cloud Infrastructure | ITIL V4 Certified | PowerShell Automation Expert
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <a href="#contact" className="btn-primary">
              <Mail className="w-5 h-5" />
              Get In Touch
            </a>
            <a href="/resume.pdf" download="Sanjay_Krishnan_JV_Resume.pdf" className="btn-secondary">
              <Download className="w-5 h-5" />
              Download Resume
            </a>
            <a href="#projects" className="btn-ghost">
              View Projects
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-4"
          >
            <a
              href={data.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass glass-hover rounded-lg group"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6 text-dark-700 group-hover:text-primary-400 transition-colors" />
            </a>
            <a
              href={data.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass glass-hover rounded-lg group"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6 text-dark-700 group-hover:text-primary-400 transition-colors" />
            </a>
            <a
              href={`mailto:${data.email}`}
              className="p-3 glass glass-hover rounded-lg group"
              aria-label="Email"
            >
              <Mail className="w-6 h-6 text-dark-700 group-hover:text-primary-400 transition-colors" />
            </a>
            {data.socialLinks.whatsapp && (
              <a
                href={`https://wa.me/${data.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 glass glass-hover rounded-lg group"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-6 h-6 text-dark-700 group-hover:text-primary-400 transition-colors" />
              </a>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a href="#about" className="flex flex-col items-center gap-2 text-dark-600 hover:text-primary-400 transition-colors">
            <span className="text-sm">Scroll to explore</span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
