'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SkillBarData {
  name: string;
  proficiency: number;
  category: string;
}

interface SkillsBarChartProps {
  data: SkillBarData[];
  selectedCategory?: string;
}

const COLORS = {
  Languages: '#3b82f6',
  Frontend: '#a855f7',
  Backend: '#10b981',
  Databases: '#f97316',
  'Cloud & DevOps': '#6366f1',
  Tools: '#eab308',
};

export default function SkillsBarChart({ data, selectedCategory }: SkillsBarChartProps) {
  const filteredData = selectedCategory && selectedCategory !== 'all'
    ? data.filter(skill => skill.category === selectedCategory)
    : data;

  const getColor = (category: string) => {
    return COLORS[category as keyof typeof COLORS] || '#38bdf8';
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg p-3 border border-white/20">
          <p className="text-sm font-semibold">{payload[0].payload.name}</p>
          <p className="text-xs text-dark-600">{payload[0].payload.category}</p>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-6"
    >
      <h3 className="text-xl font-bold mb-6">
        Top <span className="gradient-text">Skills</span>
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={filteredData.slice(0, 10)}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: '#71717a', fontSize: 12 }}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fill: '#d4d4d8', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }} />
          <Bar
            dataKey="proficiency"
            radius={[0, 8, 8, 0]}
            animationDuration={1000}
          >
            {filteredData.slice(0, 10).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.category)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
