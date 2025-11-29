import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Activity, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ViewReports: React.FC = () => {
  const navigate = useNavigate();

  const reportCards = [
    {
      title: 'Blood Glucose Trends',
      description: 'View your glucose patterns over time',
      icon: Activity,
      color: 'blue',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'HbA1c Progress',
      description: 'Track your long-term glucose control',
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Monthly Summary',
      description: 'Comprehensive monthly health report',
      icon: Calendar,
      color: 'purple',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Analytics Dashboard',
      description: 'Detailed insights and predictions',
      icon: BarChart3,
      color: 'orange',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 theme-text-secondary hover:theme-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <h1 className="text-title-lg theme-text-primary mb-2">Health Reports & Analytics</h1>
        <p className="text-body-lg theme-text-secondary">
          View comprehensive insights into your diabetes management
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {reportCards.map((report, index) => {
          const Icon = report.icon;
          return (
            <motion.div
              key={report.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="theme-bg-card rounded-2xl p-6 theme-border border hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 ${report.bgColor} rounded-xl`}>
                  <Icon className={`w-6 h-6 text-${report.color}-500`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-section-title theme-text-primary mb-2">{report.title}</h3>
                  <p className="text-body theme-text-secondary">{report.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="theme-bg-card rounded-2xl p-8 theme-border border"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-500/10 rounded-xl">
            <BarChart3 className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-section-title theme-text-primary">Quick Stats</h2>
            <p className="text-body theme-text-muted">Your health data at a glance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 theme-bg-card theme-border border rounded-xl">
            <p className="text-body theme-text-muted mb-2">Average Glucose</p>
            <p className="text-3xl font-bold theme-text-primary">125 <span className="text-lg theme-text-secondary">mg/dL</span></p>
            <p className="text-sm text-green-500 mt-2">↓ 5% from last month</p>
          </div>
          <div className="p-4 theme-bg-card theme-border border rounded-xl">
            <p className="text-body theme-text-muted mb-2">Readings This Month</p>
            <p className="text-3xl font-bold theme-text-primary">87</p>
            <p className="text-sm text-blue-500 mt-2">↑ 12 more than last month</p>
          </div>
          <div className="p-4 theme-bg-card theme-border border rounded-xl">
            <p className="text-body theme-text-muted mb-2">In-Range %</p>
            <p className="text-3xl font-bold theme-text-primary">78<span className="text-lg theme-text-secondary">%</span></p>
            <p className="text-sm text-green-500 mt-2">↑ 3% improvement</p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-500/10 rounded-xl theme-border border border-blue-500/20">
          <p className="text-body theme-text-secondary">
            <span className="font-semibold text-blue-500">💡 Insight:</span> Your glucose levels have been more stable in the past two weeks. Keep up with your current meal plan and medication schedule!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewReports;
