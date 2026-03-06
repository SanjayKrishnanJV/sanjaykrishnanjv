'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Flame, TrendingUp, Calendar, GitCommit } from 'lucide-react';

interface ContributionDay {
  date: string;
  count: number;
}

interface ContributionCalendarProps {
  username?: string;
}

export default function ContributionCalendar({ username = 'SanjayKrishnanJV' }: ContributionCalendarProps) {
  const [isClient, setIsClient] = useState(false);
  const [contributionData, setContributionData] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch real GitHub contribution data
  useEffect(() => {
    if (!isClient) return;

    const fetchContributions = async () => {
      try {
        const response = await fetch(`/api/github/contributions?username=${username}`);
        const result = await response.json();

        if (result.success && result.data.length > 0) {
          setContributionData(result.data);
        } else {
          // Fallback to mock data if API fails
          setContributionData(generateMockData());
        }
      } catch (error) {
        console.error('Error fetching contributions:', error);
        setContributionData(generateMockData());
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [isClient, username]);

  // Generate mock data as fallback
  const generateMockData = () => {
    const data: ContributionDay[] = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      const isWeekday = dayOfWeek !== 0 && dayOfWeek !== 6;
      const dateStr = d.toISOString().split('T')[0];
      const seed = dateStr.split('-').reduce((acc, num) => acc + parseInt(num), 0);
      const seededRandom = (s: number) => {
        const x = Math.sin(s) * 10000;
        return x - Math.floor(x);
      };
      const randomValue = seededRandom(seed);
      const baseCount = isWeekday ? randomValue * 15 : randomValue * 5;
      const count = Math.floor(baseCount);

      data.push({
        date: dateStr,
        count: count,
      });
    }

    return data;
  };

  // Calculate stats
  const stats = useMemo(() => {
    if (!isClient || contributionData.length === 0) {
      return {
        total: 0,
        activeDays: 0,
        currentStreak: 0,
        longestStreak: 0,
      };
    }

    const totalContributions = contributionData.reduce((sum, day) => sum + day.count, 0);
    const daysWithContributions = contributionData.filter(day => day.count > 0).length;

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    for (let i = contributionData.length - 1; i >= 0; i--) {
      if (contributionData[i].count > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    contributionData.forEach(day => {
      if (day.count > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });

    return {
      total: totalContributions,
      activeDays: daysWithContributions,
      currentStreak,
      longestStreak,
    };
  }, [contributionData, isClient]);

  const getContributionLevel = (count: number) => {
    if (count === 0) return 'level-0';
    if (count < 3) return 'level-1';
    if (count < 6) return 'level-2';
    if (count < 9) return 'level-3';
    return 'level-4';
  };

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  if (!isClient) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl p-6"
    >
      <h3 className="text-2xl font-bold mb-6">
        <span className="gradient-text">Contribution Activity</span>
        {loading && <span className="text-sm text-dark-600 ml-2">(Loading...)</span>}
      </h3>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GitCommit className="w-4 h-4 text-primary-400" />
            <span className="text-2xl font-bold">{stats.total.toLocaleString()}</span>
          </div>
          <p className="text-xs text-dark-600">Total Contributions</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-green-400" />
            <span className="text-2xl font-bold">{stats.activeDays}</span>
          </div>
          <p className="text-xs text-dark-600">Active Days</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-2xl font-bold">{stats.currentStreak}</span>
          </div>
          <p className="text-xs text-dark-600">Current Streak</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-2xl font-bold">{stats.longestStreak}</span>
          </div>
          <p className="text-xs text-dark-600">Longest Streak</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="contribution-calendar">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={contributionData}
          classForValue={(value) => {
            if (!value) {
              return 'color-empty';
            }
            return `color-scale-${getContributionLevel(value.count).split('-')[1]}`;
          }}
          showWeekdayLabels
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-dark-600">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-dark-200/20" />
          <div className="w-3 h-3 rounded-sm contribution-level-1" />
          <div className="w-3 h-3 rounded-sm contribution-level-2" />
          <div className="w-3 h-3 rounded-sm contribution-level-3" />
          <div className="w-3 h-3 rounded-sm contribution-level-4" />
        </div>
        <span>More</span>
      </div>

      <style jsx global>{`
        .contribution-calendar .react-calendar-heatmap {
          width: 100%;
        }

        .contribution-calendar .react-calendar-heatmap text {
          fill: #71717a;
          font-size: 10px;
        }

        .contribution-calendar .react-calendar-heatmap .color-empty {
          fill: rgba(255, 255, 255, 0.05);
        }

        .contribution-calendar .react-calendar-heatmap .color-scale-1 {
          fill: #0e4429;
        }

        .contribution-calendar .react-calendar-heatmap .color-scale-2 {
          fill: #006d32;
        }

        .contribution-calendar .react-calendar-heatmap .color-scale-3 {
          fill: #26a641;
        }

        .contribution-calendar .react-calendar-heatmap .color-scale-4 {
          fill: #39d353;
        }

        .contribution-calendar .react-calendar-heatmap rect:hover {
          stroke: #38bdf8;
          stroke-width: 2;
        }

        .contribution-level-1 {
          background-color: #0e4429;
        }

        .contribution-level-2 {
          background-color: #006d32;
        }

        .contribution-level-3 {
          background-color: #26a641;
        }

        .contribution-level-4 {
          background-color: #39d353;
        }
      `}</style>
    </motion.div>
  );
}
