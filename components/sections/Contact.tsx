'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Linkedin, Github, Send, MessageCircle, Paperclip, X, Loader2 } from 'lucide-react';
import { usePersonalData } from '@/app/data-provider';
import { useState } from 'react';

interface ContactInfo {
  icon: any;
  label: string;
  value: string;
  href: string | null;
}

export default function Contact() {
  const data = usePersonalData();
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setMessage(`File ${file.name} is too large. Maximum size is 5MB`);
        setFormState('error');
        setTimeout(() => setFormState('idle'), 3000);
        return false;
      }
      return true;
    });
    setAttachments(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('loading');
    setErrors({});

    const formData = new FormData(e.currentTarget);

    // Add attachments to form data
    attachments.forEach((file, index) => {
      formData.append(`attachment_${index}`, file);
    });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setFormState('success');
        setMessage(result.message);
        (e.target as HTMLFormElement).reset();
        setAttachments([]);
        setTimeout(() => setFormState('idle'), 5000);
      } else {
        setFormState('error');
        setMessage(result.message);
        setTimeout(() => setFormState('idle'), 5000);
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
                {contactInfo.map((item: ContactInfo, index: number) => {
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="input"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="input"
                      placeholder="Your company"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium mb-2">
                      Project Type (Optional)
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      className="input"
                    >
                      <option value="">Select type</option>
                      <option value="web-development">Web Development</option>
                      <option value="mobile-app">Mobile App</option>
                      <option value="cloud-architecture">Cloud Architecture</option>
                      <option value="consulting">Consulting</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium mb-2">
                      Budget (Optional)
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      className="input"
                    >
                      <option value="">Select budget</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-plus">$50,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="input resize-none"
                    placeholder="Tell me about your project..."
                    required
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Attachments (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="btn-secondary cursor-pointer">
                      <Paperclip className="w-5 h-5" />
                      <span>Add Files</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-dark-600">Max 5 files, 5MB each</span>
                  </div>

                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 glass rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Paperclip className="w-4 h-4 text-primary-400" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-dark-600">
                                {(file.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="p-1 hover:bg-red-500/20 rounded transition-colors"
                            aria-label={`Remove ${file.name}`}
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={formState === 'loading'}
                >
                  {formState === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
