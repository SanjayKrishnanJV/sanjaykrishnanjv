'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface NewsletterFormProps {
  variant?: 'inline' | 'card' | 'minimal';
  showName?: boolean;
  tags?: string[];
  className?: string;
}

export default function NewsletterForm({
  variant = 'card',
  showName = false,
  tags,
  className = '',
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: showName ? name : undefined,
          tags,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
        setName('');
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'minimal') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <div className="flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            disabled={loading}
            className="w-full px-4 py-2 bg-dark-200/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary-400 transition-colors disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary whitespace-nowrap disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              Subscribe
            </>
          )}
        </button>
      </form>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={className}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          {showName && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-dark-200/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary-400 transition-colors disabled:opacity-50"
            />
          )}
          <div className="flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-dark-200/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary-400 transition-colors disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary whitespace-nowrap disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Subscribe
              </>
            )}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {status !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-3 p-3 rounded-lg flex items-start gap-2 ${
                status === 'success'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              {status === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm">{message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Card variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`glass rounded-xl p-8 ${className}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-r from-primary-500/20 to-purple-500/20">
          <Mail className="w-6 h-6 text-primary-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Subscribe to Newsletter</h3>
          <p className="text-sm text-dark-600">Get the latest updates and articles</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {showName && (
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled={loading}
              className="w-full px-4 py-3 bg-dark-200/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary-400 transition-colors disabled:opacity-50"
            />
          </div>
        )}

        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            disabled={loading}
            className="w-full px-4 py-3 bg-dark-200/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary-400 transition-colors disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Subscribing...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Subscribe Now
            </>
          )}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
              status === 'success'
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {status === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-dark-600 mt-4">
        By subscribing, you agree to receive emails from me. You can unsubscribe at any time.
      </p>
    </motion.div>
  );
}
