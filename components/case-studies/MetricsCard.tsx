'use client';

import { motion } from 'framer-motion';
import { TrendingDown, Activity, Zap, Target, Heart, CheckCircle } from 'lucide-react';

interface MetricsCardProps {
  label: string;
  value: string;
  iconName?: string;
  index: number;
}

const iconMap: Record<string, any> = {
  TrendingDown,
  Activity,
  Zap,
  Target,
  Heart,
  CheckCircle,
};

export default function MetricsCard({ label, value, iconName, index }: MetricsCardProps) {
  const Icon = iconName && iconMap[iconName] ? iconMap[iconName] : Activity;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-xl p-6 text-center group hover:bg-white/10 transition-all duration-300"
    >
      <motion.div
        className="inline-flex p-4 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 mb-4"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.div>
      <div className="text-3xl font-bold gradient-text mb-2">{value}</div>
      <div className="text-sm text-dark-600">{label}</div>
    </motion.div>
  );
}
