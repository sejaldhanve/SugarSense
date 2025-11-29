import React, { createContext, useContext, useState } from 'react';
import { geminiAI } from '../lib/gemini';
import { useUser } from './UserContext';

interface MealPlan {
  id: string;
  day: string;
  meals: {
    breakfast: { name: string; calories: number; carbs: number; gi: number };
    lunch: { name: string; calories: number; carbs: number; gi: number };
    dinner: { name: string; calories: number; carbs: number; gi: number };
    snacks: { name: string; calories: number; carbs: number; gi: number }[];
  };
  totalCalories: number;
  totalCarbs: number;
  averageGI: number;
}

interface AIRecommendation {
  id: string;
  type: 'meal' | 'exercise' | 'medication' | 'alert';
  title: string;
  description: string;
  rationale: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  actionable: boolean;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  context?: 'food-query' | 'recipe' | 'general';
}

interface AIContextType {
  weeklyMealPlan: MealPlan[];
  recommendations: AIRecommendation[];
  chatHistory: ChatMessage[];
  generateMealPlan: () => void;
  swapMeal: (dayId: string, mealType: string, newMeal: any) => void;
  addChatMessage: (message: string, type: 'user' | 'ai') => void;
  askAI: (question: string) => Promise<string>;
  getRiskAssessment: () => { level: 'low' | 'medium' | 'high'; factors: string[] };
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weeklyMealPlan, setWeeklyMealPlan] = useState<MealPlan[]>([
    {
      id: 'monday',
      day: 'Monday',
      meals: {
        breakfast: { name: 'Oats with Berries', calories: 320, carbs: 45, gi: 42 },
        lunch: { name: 'Quinoa Salad with Chickpeas', calories: 450, carbs: 55, gi: 35 },
        dinner: { name: 'Grilled Salmon with Vegetables', calories: 380, carbs: 25, gi: 30 },
        snacks: [
          { name: 'Apple with Almonds', calories: 180, carbs: 20, gi: 38 },
          { name: 'Greek Yogurt', calories: 120, carbs: 12, gi: 11 }
        ]
      },
      totalCalories: 1450,
      totalCarbs: 157,
      averageGI: 31
    },
    // Add more days...
  ]);

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([
    {
      id: '1',
      type: 'alert',
      title: 'Blood Sugar Trending High',
      description: 'Your recent readings show an upward trend. Consider reducing carb intake today.',
      rationale: 'Based on your last 3 glucose readings (140, 155, 148 mg/dL), there\'s a pattern of elevated levels.',
      priority: 'medium',
      timestamp: new Date(),
      actionable: true
    },
    {
      id: '2',
      type: 'meal',
      title: 'Perfect Lunch Choice',
      description: 'Your planned quinoa salad is excellent for stable blood sugar.',
      rationale: 'Low GI (35), high fiber content, and balanced protein will help maintain steady glucose levels.',
      priority: 'low',
      timestamp: new Date(),
      actionable: false
    }
  ]);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI health assistant. Ask me about foods, recipes, or your diabetes management.',
      timestamp: new Date(),
      context: 'general'
    }
  ]);

  const generateMealPlan = () => {
    // AI logic to generate personalized meal plan
    console.log('Generating new meal plan...');
  };

  const swapMeal = (dayId: string, mealType: string, newMeal: any) => {
    setWeeklyMealPlan(prev =>
      prev.map(day =>
        day.id === dayId
          ? {
              ...day,
              meals: {
                ...day.meals,
                [mealType]: newMeal
              }
            }
          : day
      )
    );
  };

  const addChatMessage = (content: string, type: 'user' | 'ai') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, newMessage]);
  };

  const askAI = async (question: string): Promise<string> => {
    try {
      // Get user profile for personalized responses
      const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      
      if (question.toLowerCase().includes('can i eat') || question.toLowerCase().includes('food')) {
        return await geminiAI.analyzeFood(question, userProfile);
      } else {
        return await geminiAI.generateDietRecommendation(userProfile, question);
      }
    } catch (error) {
      console.error('AI Error:', error);
      return 'I\'m here to help with your diabetes management. You can ask me about foods, recipes, glucose readings, or meal planning.';
    }
  };

  const getRiskAssessment = () => {
    // Analyze recent health data and return risk assessment
    return {
      level: 'medium' as const,
      factors: ['Recent glucose readings above target', 'Missed medication yesterday', 'Low fiber intake this week']
    };
  };

  return (
    <AIContext.Provider value={{
      weeklyMealPlan,
      recommendations,
      chatHistory,
      generateMealPlan,
      swapMeal,
      addChatMessage,
      askAI,
      getRiskAssessment
    }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};