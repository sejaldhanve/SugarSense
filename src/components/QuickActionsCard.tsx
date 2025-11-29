import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  MessageCircle, 
  Pill, 
  BarChart3, 
  Zap
} from 'lucide-react';

interface QuickActionsCardProps {
  className?: string;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'log-blood-sugar',
      title: 'Log Blood Sugar',
      description: 'Record your current glucose level',
      icon: Activity,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
    },
    {
      id: 'chat-ai',
      title: 'Healthcare AI',
      description: 'Get personalized health advice',
      icon: MessageCircle,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400',
    },
    {
      id: 'add-medication',
      title: 'Add Medication',
      description: 'Set up a new medication reminder',
      icon: Pill,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400',
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      description: 'Check your health analytics',
      icon: BarChart3,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-400',
    },
  ];

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'log-blood-sugar':
        navigate('/log-blood-sugar');
        break;
      case 'chat-ai':
        navigate('/ai-chat');
        break;
      case 'add-medication':
        navigate('/medications');
        break;
      case 'view-reports':
        navigate('/reports');
        break;
      default:
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`theme-bg-card backdrop-blur-lg theme-border border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-section-title theme-text-primary">Quick Actions</h3>
          <p className="text-body theme-text-secondary">Manage your diabetes care</p>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction(action.id)}
              className={`flex items-center gap-4 p-4 rounded-xl ${action.bgColor} border border-transparent theme-border hover:shadow-md transition-all duration-200 text-left group focus:outline-none focus:ring-2 focus:ring-emerald-400`}
            >
              <div className={`p-2 bg-gradient-to-br ${action.color} rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${action.textColor} transition-colors`}>
                  {action.title}
                </h4>
                <p className="text-xs theme-text-muted mt-1">
                  {action.description}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
              </div>
            </motion.button>
          );
        })}
      </div>

    </motion.div>
  );
};

export default QuickActionsCard;