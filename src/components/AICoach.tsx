import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Utensils, 
  Activity,
  Clock,
  Target,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAI } from '../context/AIContext';
import { useUser } from '../context/UserContext';

const AICoach: React.FC = () => {
  const { weeklyMealPlan, generateMealPlan, swapMeal } = useAI();
  const { userProfile } = useUser();
  const [expandedDay, setExpandedDay] = useState<string | null>('monday');
  const [showSwapOptions, setShowSwapOptions] = useState<string | null>(null);

  const mealAlternatives = {
    breakfast: [
      { name: 'Greek Yogurt with Nuts', calories: 280, carbs: 15, gi: 25 },
      { name: 'Vegetable Omelet', calories: 320, carbs: 8, gi: 15 },
      { name: 'Chia Pudding', calories: 250, carbs: 20, gi: 30 }
    ],
    lunch: [
      { name: 'Lentil Soup with Salad', calories: 380, carbs: 45, gi: 32 },
      { name: 'Grilled Chicken Bowl', calories: 420, carbs: 35, gi: 28 },
      { name: 'Vegetable Curry with Brown Rice', calories: 400, carbs: 50, gi: 38 }
    ],
    dinner: [
      { name: 'Baked Fish with Vegetables', calories: 350, carbs: 20, gi: 25 },
      { name: 'Tofu Stir-fry', calories: 320, carbs: 25, gi: 30 },
      { name: 'Grilled Paneer Salad', calories: 380, carbs: 15, gi: 20 }
    ]
  };

  const handleSwapMeal = (dayId: string, mealType: string, newMeal: any) => {
    swapMeal(dayId, mealType, newMeal);
    setShowSwapOptions(null);
  };

  const MealCard = ({ 
    meal, 
    mealType, 
    dayId 
  }: { 
    meal: any; 
    mealType: string; 
    dayId: string; 
  }) => (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-white capitalize">{mealType}</h4>
        <button
          onClick={() => setShowSwapOptions(`${dayId}-${mealType}`)}
          className="text-emerald-400 hover:text-emerald-300 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-slate-300 text-sm mb-3">{meal.name}</p>
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <p className="text-slate-400">Calories</p>
          <p className="text-white font-medium">{meal.calories}</p>
        </div>
        <div className="text-center">
          <p className="text-slate-400">Carbs</p>
          <p className="text-white font-medium">{meal.carbs}g</p>
        </div>
        <div className="text-center">
          <p className="text-slate-400">GI</p>
          <p className={`font-medium ${meal.gi <= 35 ? 'text-green-400' : meal.gi <= 55 ? 'text-yellow-400' : 'text-red-400'}`}>
            {meal.gi}
          </p>
        </div>
      </div>

      {/* Swap Options */}
      {showSwapOptions === `${dayId}-${mealType}` && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 space-y-2"
        >
          <p className="text-xs text-slate-400 mb-2">Choose alternative:</p>
          {mealAlternatives[mealType as keyof typeof mealAlternatives]?.map((alt, index) => (
            <button
              key={index}
              onClick={() => handleSwapMeal(dayId, mealType, alt)}
              className="w-full text-left p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors"
            >
              <p className="text-white text-sm">{alt.name}</p>
              <p className="text-slate-400 text-xs">
                {alt.calories} cal • {alt.carbs}g carbs • GI {alt.gi}
              </p>
            </button>
          ))}
          <button
            onClick={() => setShowSwapOptions(null)}
            className="text-slate-400 text-xs hover:text-slate-300"
          >
            Cancel
          </button>
        </motion.div>
      )}
    </div>
  );

  const WeeklyOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-emerald-400" />
          <h3 className="text-xl font-semibold text-white">Weekly Overview</h3>
        </div>
        <button
          onClick={generateMealPlan}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Utensils className="w-5 h-5 text-emerald-400" />
            <h4 className="font-medium text-white">Average Daily</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-slate-300">Calories:</span>
              <span className="text-white">1,450</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-slate-300">Carbs:</span>
              <span className="text-white">157g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-slate-300">Avg GI:</span>
              <span className="text-green-400">31</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h4 className="font-medium text-white">Progress</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-slate-300">Target HbA1c:</span>
              <span className="text-white">&lt; 7%</span>
            </div>
            {userProfile?.hba1c && (
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-slate-300">Current:</span>
                <span className="text-yellow-400">{userProfile.hba1c}%</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-slate-300">Compliance:</span>
              <span className="text-green-400">85%</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <h4 className="font-medium text-white">This Week</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-slate-300">Meals planned:</span>
              <span className="text-white">21</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-slate-300">Low-GI meals:</span>
              <span className="text-green-400">18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-slate-300">Budget used:</span>
              <span className="text-white">₹2,400</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">AI Health Coach</h1>
        <p className="text-gray-700 dark:text-slate-300">
          Personalized meal plans and health guidance tailored for you
        </p>
      </motion.div>

      {/* Weekly Overview */}
      <WeeklyOverview />

      {/* Weekly Meal Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-emerald-400" />
          <h3 className="text-xl font-semibold text-white">Chatpata AI Meal Plan</h3>
        </div>

        <div className="space-y-4">
          {weeklyMealPlan.map((day) => (
            <motion.div
              key={day.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <h4 className="font-semibold text-white">{day.day}</h4>
                    <p className="text-sm text-slate-300">
                      {day.totalCalories} cal • {day.totalCarbs}g carbs • Avg GI {day.averageGI}
                    </p>
                  </div>
                </div>
                {expandedDay === day.id ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {expandedDay === day.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-white/5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <MealCard meal={day.meals.breakfast} mealType="breakfast" dayId={day.id} />
                    <MealCard meal={day.meals.lunch} mealType="lunch" dayId={day.id} />
                    <MealCard meal={day.meals.dinner} mealType="dinner" dayId={day.id} />
                  </div>

                  {day.meals.snacks.length > 0 && (
                    <div>
                      <h5 className="font-medium text-white mb-2">Snacks</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {day.meals.snacks.map((snack, index) => (
                          <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <p className="text-slate-300 text-sm mb-2">{snack.name}</p>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <p className="text-slate-400">Calories</p>
                                <p className="text-white font-medium">{snack.calories}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-slate-400">Carbs</p>
                                <p className="text-white font-medium">{snack.carbs}g</p>
                              </div>
                              <div className="text-center">
                                <p className="text-slate-400">GI</p>
                                <p className={`font-medium ${snack.gi <= 35 ? 'text-green-400' : 'text-yellow-400'}`}>
                                  {snack.gi}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Day Summary */}
                  <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-medium text-sm">Why this plan works</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      This meal plan maintains your blood sugar within target range with an average GI of {day.averageGI}. 
                      The balanced protein and fiber content will help you feel satisfied while supporting stable glucose levels throughout the day.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AICoach;