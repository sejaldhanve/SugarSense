import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Activity, Calendar } from 'lucide-react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface BloodSugarChartProps {
  className?: string;
}

interface BloodSugarLog {
  glucose: number;
  timestamp: Date;
}

const BloodSugarChart: React.FC<BloodSugarChartProps> = ({ className = '' }) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [logs, setLogs] = useState<BloodSugarLog[]>([]);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setLogs([]);
      return;
    }

    const logsRef = collection(db, 'blood_sugar_logs');
    const q = query(
      logsRef,
      where('userId', '==', user.uid),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedLogs: BloodSugarLog[] = snapshot.docs.map((doc) => {
          const data = doc.data() as any;
          const rawTimestamp = data.timestamp;

          const timestampMs = typeof rawTimestamp === 'number'
            ? rawTimestamp
            : rawTimestamp?.toMillis?.() ?? Date.now();

          return {
            glucose: Number(data.glucose),
            timestamp: new Date(timestampMs),
          };
        });

        // Ensure logs are sorted by time (oldest first)
        fetchedLogs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        setLogs(fetchedLogs);
      },
      (error) => {
        console.error('Error fetching blood sugar logs:', error);
        setLogs([]);
      }
    );

    return () => unsubscribe();
  }, []);

  const { labels, values } = useMemo(() => {
    if (!logs.length) {
      // Fallback to static sample data when user has no logs yet
      const mockData = {
        '24h': {
          labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
          values: [95, 120, 145, 110, 125, 105],
        },
        '7d': {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          values: [118, 125, 108, 135, 142, 128, 115],
        },
        '30d': {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          values: [122, 118, 125, 115],
        },
      } as const;

      const currentData = mockData[timeRange];
      return { labels: currentData.labels, values: currentData.values };
    }

    const now = Date.now();
    const ranges: Record<'24h' | '7d' | '30d', number> = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };

    const cutoff = now - ranges[timeRange];
    const filtered = logs.filter((log) => log.timestamp.getTime() >= cutoff);
    const recent = filtered.length ? filtered : logs.slice(-Math.min(logs.length, 20));

    const derivedLabels = recent.map((log) => {
      if (timeRange === '24h') {
        return log.timestamp.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        });
      }

      if (timeRange === '7d') {
        return log.timestamp.toLocaleDateString([], {
          weekday: 'short',
        });
      }

      return log.timestamp.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      });
    });

    const derivedValues = recent.map((log) => Number(log.glucose));

    return { labels: derivedLabels, values: derivedValues };
  }, [logs, timeRange]);

  const hasData = values.length > 0;
  const currentValue = hasData ? values[values.length - 1] : 0;
  const previousValue = hasData && values.length > 1 ? values[values.length - 2] : currentValue;
  const trend = !hasData
    ? 'stable'
    : currentValue > previousValue
    ? 'up'
    : currentValue < previousValue
    ? 'down'
    : 'stable';
  const trendValue = !hasData ? 0 : Math.abs(currentValue - previousValue);

  const getStatus = (value: number) => {
    if (value < 80) return { status: 'Low', color: 'text-red-400', bgColor: 'bg-red-500/10' };
    if (value > 130) return { status: 'High', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' };
    return { status: 'Normal', color: 'text-green-400', bgColor: 'bg-green-500/10' };
  };

  const status = getStatus(currentValue);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#10b981',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) => `${context.parsed.y} mg/dL`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
          },
        },
      },
      y: {
        min: 60,
        max: 180,
        grid: {
          color: 'rgba(100, 116, 139, 0.1)',
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
          },
          callback: (value: any) => `${value}`,
        },
      },
    },
    elements: {
      point: {
        radius: 6,
        hoverRadius: 8,
        backgroundColor: '#10b981',
        borderColor: '#ffffff',
        borderWidth: 2,
      },
      line: {
        tension: 0.4,
        borderWidth: 3,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Blood Sugar',
        data: values,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
      },
      // Target range lines (use labels.length so we don't rely on mock-only currentData)
      {
        label: 'Target Range',
        data: new Array(labels.length).fill(130),
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
      {
        label: 'Target Range',
        data: new Array(labels.length).fill(80),
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`theme-bg-card backdrop-blur-lg theme-border border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-section-title theme-text-primary">Blood Sugar Trends</h3>
            <p className="text-body theme-text-secondary">Track your glucose levels over time</p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex bg-white/10 rounded-lg p-1">
          {(['24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                timeRange === range
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Current Value & Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold theme-text-primary mb-1">
            {hasData ? currentValue : '--'}
            <span className="text-lg theme-text-secondary ml-1">mg/dL</span>
          </div>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
            {status.status}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            {trend === 'up' && <TrendingUp className="w-4 h-4 text-red-400" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4 text-green-400" />}
            {trend === 'stable' && <div className="w-4 h-1 bg-yellow-400 rounded" />}
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {trend === 'stable' ? '0' : `${trend === 'up' ? '+' : '-'}${trendValue}`} mg/dL
            </span>
          </div>
          <p className="text-xs theme-text-muted">vs previous</p>
        </div>

        <div className="text-center">
          <div className="text-sm font-medium theme-text-primary mb-1">Target: 80-130</div>
          <p className="text-xs theme-text-muted">mg/dL range</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-4">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Insights */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
          <span className="text-emerald-400 font-medium text-sm">AI Insight</span>
        </div>
        <p className="text-sm theme-text-secondary">
          {currentValue <= 130 && currentValue >= 80
            ? "Great job! Your blood sugar is within the target range. Keep up the good work with your current routine."
            : currentValue > 130
            ? "Your blood sugar is slightly elevated. Consider reviewing your recent meals and consider light exercise."
            : "Your blood sugar is below target. Have a small healthy snack and monitor closely."}
        </p>
      </div>
    </motion.div>
  );
};

export default BloodSugarChart;