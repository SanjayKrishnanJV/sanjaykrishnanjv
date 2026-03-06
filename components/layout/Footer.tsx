'use client';

import { Github, Linkedin, Mail, Globe, ExternalLink, MessageCircle } from 'lucide-react';
import { usePersonalData } from '@/app/data-provider';

export default function Footer() {
  const data = usePersonalData();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      url: data.socialLinks.github,
      icon: Github,
    },
    {
      name: 'LinkedIn',
      url: data.socialLinks.linkedin,
      icon: Linkedin,
    },
    {
      name: 'Website',
      url: data.socialLinks.website,
      icon: Globe,
    },
    {
      name: 'Email',
      url: `mailto:${data.email}`,
      icon: Mail,
    },
    ...(data.socialLinks.whatsapp ? [{
      name: 'WhatsApp',
      url: `https://wa.me/${data.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`,
      icon: MessageCircle,
    }] : []),
  ];

  return (
    <footer className="glass border-t border-white/10 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">
              {data.name}
            </h3>
            <p className="text-dark-700 mb-4">{data.tagline}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <a href="#about" className="text-dark-700 hover:text-primary-400 transition-colors">
                About
              </a>
              <a href="#projects" className="text-dark-700 hover:text-primary-400 transition-colors">
                Projects
              </a>
              <a href="#certifications" className="text-dark-700 hover:text-primary-400 transition-colors">
                Certifications
              </a>
              <a href="#contact" className="text-dark-700 hover:text-primary-400 transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 glass glass-hover rounded-lg group"
                    aria-label={link.name}
                  >
                    <Icon className="w-5 h-5 text-dark-700 group-hover:text-primary-400 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-dark-700">
          <p>
            &copy; {currentYear} {data.name}. All rights reserved.
          </p>
          <p className="mt-2 text-sm">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
