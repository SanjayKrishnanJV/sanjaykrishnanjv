'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface SkillData {
  category: string;
  proficiency: number;
  fullMark: number;
}

interface SkillsRadarChartProps {
  data: SkillData[];
}

export default function SkillsRadarChart({ data }: SkillsRadarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg p-3 border border-white/20">
          <p className="text-sm font-semibold">{payload[0].payload.category}</p>
          <p className="text-xs text-primary-400">
            Proficiency: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-6"
    >
      <h3 className="text-xl font-bold mb-6 text-center">
        Skills <span className="gradient-text">Overview</span>
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: '#d4d4d8', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#71717a', fontSize: 10 }}
          />
          <Radar
            name="Proficiency"
            dataKey="proficiency"
            stroke="#38bdf8"
            fill="#38bdf8"
            fillOpacity={0.6}
            strokeWidth={2}
            onMouseEnter={(_, index) => setActiveIndex(index as unknown as number)}
            onMouseLeave={() => setActiveIndex(null)}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
