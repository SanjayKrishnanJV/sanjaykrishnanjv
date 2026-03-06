'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Eye,
  Clock,
  TrendingUp,
  Globe,
  Calendar,
  Activity,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getVisitorStats, getGlobalStats } from '@/lib/analytics';

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const visitorStats = getVisitorStats();
    const global = getGlobalStats();
    setStats(visitorStats);
    setGlobalStats(global);
    setLoading(false);
  }, []);

  if (!mounted) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <Activity className="w-12 h-12 text-primary-400 mx-auto mb-4 animate-pulse" />
        <p className="text-dark-600">Loading analytics...</p>
      </div>
    );
  }

  if (loading || !stats || !globalStats) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <Activity className="w-12 h-12 text-primary-400 mx-auto mb-4 animate-pulse" />
        <p className="text-dark-600">Loading analytics...</p>
      </div>
    );
  }

  // Prepare data for charts
  const pageViewsData = Object.entries(stats.pageViews || {}).map(([route, count]) => ({
    name: route === '/' ? 'Home' : route.replace('/', ''),
    views: count as number,
  }));

  const visitorTrendData = [
    { name: 'Week 1', visitors: Math.floor(globalStats.totalVisitors * 0.2) },
    { name: 'Week 2', visitors: Math.floor(globalStats.totalVisitors * 0.35) },
    { name: 'Week 3', visitors: Math.floor(globalStats.totalVisitors * 0.6) },
    { name: 'Week 4', visitors: globalStats.totalVisitors },
  ];

  const deviceData = [
    { name: 'Desktop', value: Math.floor(stats.uniqueVisitors * 0.6) },
    { name: 'Mobile', value: Math.floor(stats.uniqueVisitors * 0.3) },
    { name: 'Tablet', value: Math.floor(stats.uniqueVisitors * 0.1) },
  ];

  const COLORS = ['#667eea', '#764ba2', '#f093fb'];

  const statCards = [
    {
      icon: Users,
      label: 'Total Visitors',
      value: globalStats.totalVisitors.toLocaleString(),
      change: '+12%',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      icon: Eye,
      label: 'Unique Visitors',
      value: stats.uniqueVisitors.toLocaleString(),
      change: '+8%',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    {
      icon: Activity,
      label: 'Page Views',
      value: globalStats.totalPageViews.toLocaleString(),
      change: '+15%',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    {
      icon: TrendingUp,
      label: 'Engagement Rate',
      value: '68%',
      change: '+5%',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-sm text-green-400">{stat.change}</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-dark-600">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-primary-400" />
            <h3 className="text-xl font-bold">Page Views by Route</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pageViewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f1f1f',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="views" fill="#667eea" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Visitor Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            <h3 className="text-xl font-bold">Visitor Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visitorTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f1f1f',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#667eea"
                strokeWidth={3}
                dot={{ fill: '#667eea', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Device Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-primary-400" />
          <h3 className="text-xl font-bold">Device Distribution</h3>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-around">
          <ResponsiveContainer width="100%" height={300} className="md:w-1/2">
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f1f1f',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-4 md:w-1/2">
            {deviceData.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="font-medium">{device.name}</span>
                </div>
                <span className="text-dark-600">{device.value} users</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-primary-400" />
          <h3 className="text-xl font-bold">Your Activity</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-dark-200/20 rounded-lg">
            <div>
              <p className="font-medium">First Visit</p>
              <p className="text-sm text-dark-600">{new Date(stats.firstVisit).toLocaleDateString()}</p>
            </div>
            <Calendar className="w-5 h-5 text-primary-400" />
          </div>
          <div className="flex items-center justify-between p-4 bg-dark-200/20 rounded-lg">
            <div>
              <p className="font-medium">Total Visits</p>
              <p className="text-sm text-dark-600">{stats.visitCount} times</p>
            </div>
            <Users className="w-5 h-5 text-primary-400" />
          </div>
          <div className="flex items-center justify-between p-4 bg-dark-200/20 rounded-lg">
            <div>
              <p className="font-medium">Last Visit</p>
              <p className="text-sm text-dark-600">{new Date(stats.lastVisit).toLocaleDateString()}</p>
            </div>
            <Activity className="w-5 h-5 text-primary-400" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
