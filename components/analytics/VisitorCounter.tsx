'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, Users, TrendingUp } from 'lucide-react';
import { getVisitorStats, trackPageView, formatCount } from '@/lib/analytics';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
}

function AnimatedNumber({ value, duration = 2000 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value === 0) return;

    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = displayValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (value - startValue) * easeOut);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span className={isAnimating ? 'text-primary-400' : ''}>
      {displayValue.toLocaleString()}
    </span>
  );
}

export default function VisitorCounter() {
  const [stats, setStats] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    lastVisit: '',
    firstVisit: '',
  });
  const [isClient, setIsClient] = useState(false);
  const hasTracked = useRef(false);

  useEffect(() => {
    setIsClient(true);

    // Track page view only once
    if (!hasTracked.current) {
      const newStats = trackPageView('/');
      setStats(newStats);
      hasTracked.current = true;
    }
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center gap-6 flex-wrap justify-center">
      {/* Total Visits */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2"
      >
        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
          <Eye className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <div className="text-lg font-bold">
            <AnimatedNumber value={stats.totalVisits} />
          </div>
          <div className="text-xs text-dark-600">Total Visits</div>
        </div>
      </motion.div>

      {/* Unique Visitors */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-2"
      >
        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
          <Users className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <div className="text-lg font-bold">
            <AnimatedNumber value={stats.uniqueVisitors} />
          </div>
          <div className="text-xs text-dark-600">Unique Visitors</div>
        </div>
      </motion.div>

      {/* Growth Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center gap-2"
      >
        <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
          <TrendingUp className="w-4 h-4 text-green-400" />
        </div>
        <div>
          <div className="text-lg font-bold text-green-400">+12%</div>
          <div className="text-xs text-dark-600">This Week</div>
        </div>
      </motion.div>
    </div>
  );
}
