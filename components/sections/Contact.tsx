'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Linkedin, Github, Send, MessageCircle } from 'lucide-react';
import { usePersonalData } from '@/app/data-provider';
import { useState } from 'react';

export default function Contact() {
  const data = usePersonalData();
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('loading');

    const formData = new FormData(e.currentTarget);
    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

    try {
      // If Formspree is configured, use it
      if (formspreeId) {
        const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          setFormState('success');
          setMessage('Thanks for reaching out! I\'ll get back to you soon.');
          (e.target as HTMLFormElement).reset();
          setTimeout(() => setFormState('idle'), 5000);
        } else {
          throw new Error('Form submission failed');
        }
      } else {
        // Fallback to mailto
        const subject = formData.get('subject');
        const body = formData.get('body');
        const email = formData.get('email');
        const name = formData.get('name');
        window.location.href = `mailto:${data.email}?subject=${encodeURIComponent(String(subject))}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${body}`)}`;
        setFormState('success');
        setMessage('Opening your email client...');
        setTimeout(() => setFormState('idle'), 3000);
      }
    } catch (error) {
      setFormState('error');
      setMessage('Oops! Something went wrong. Please try again or email me directly.');
      setTimeout(() => setFormState('idle'), 5000);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: data.email,
      href: `mailto:${data.email}`,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: data.location,
      href: null,
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Connect on LinkedIn',
      href: data.socialLinks.linkedin,
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'Follow on GitHub',
      href: data.socialLinks.github,
    },
    ...(data.socialLinks.whatsapp ? [{
      icon: MessageCircle,
      label: 'WhatsApp',
      value: data.socialLinks.whatsapp,
      href: `https://wa.me/${data.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`,
    }] : []),
  ];

  return (
    <section id="contact" className="section">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="mb-4">
              Get In <span className="gradient-text">Touch</span>
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              Have a project in mind or want to collaborate? Let's connect!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-8">Contact Information</h3>

              <div className="space-y-6">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-start gap-4 p-4 glass rounded-xl hover:bg-white/10 transition-all duration-300 group">
                      <div className="p-3 bg-primary-500/20 rounded-lg group-hover:bg-primary-500/30 transition-colors">
                        <Icon className="w-6 h-6 text-primary-400" />
                      </div>
                      <div>
                        <p className="text-sm text-dark-600 mb-1">{item.label}</p>
                        <p className="font-semibold text-lg">{item.value}</p>
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <a
                      key={index}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={index}>{content}</div>
                  );
                })}
              </div>

              <div className="mt-8 p-6 glass rounded-xl">
                <p className="text-dark-700 leading-relaxed">
                  I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Feel free to reach out!
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold mb-8">Send a Message</h3>

              {formState === 'success' && (
                <div className="mb-6 p-4 glass rounded-lg border border-green-500/50 bg-green-500/10">
                  <p className="text-green-400">{message}</p>
                </div>
              )}

              {formState === 'error' && (
                <div className="mb-6 p-4 glass rounded-lg border border-red-500/50 bg-red-500/10">
                  <p className="text-red-400">{message}</p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="input"
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="body"
                    rows={5}
                    className="input resize-none"
                    placeholder="Your message..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={formState === 'loading'}
                >
                  <Send className="w-5 h-5" />
                  {formState === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
