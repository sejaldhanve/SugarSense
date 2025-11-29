import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Send, ArrowLeft, Sparkles, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { geminiAI } from '../lib/gemini';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isRecipe?: boolean;
}

const ChatpataAI: React.FC = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Namaste! I'm Chatpata AI, your personal recipe creator! 🍳\n\nTell me what ingredients you have in your kitchen, and I'll create a delicious, diabetes-friendly recipe just for you.\n\nFor example: \"I have potatoes, onions, tomatoes, and some basic masalas\"", 
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim() || isLoading) return;
    
    const userIngredients = ingredients.trim();
    setMessages(prev => [...prev, { 
      text: userIngredients, 
      sender: 'user', 
      timestamp: new Date() 
    }]);
    setIngredients('');
    setIsLoading(true);
    
    try {
      const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const recipe = await geminiAI.generateRecipe(userIngredients, userProfile);
      setMessages(prev => [...prev, { 
        text: recipe, 
        sender: 'ai',
        timestamp: new Date(),
        isRecipe: true
      }]);
    } catch (error) {
      console.error('Recipe generation error:', error);
      setMessages(prev => [...prev, { 
        text: "Oops! I'm having trouble creating a recipe right now. Please try again in a moment.", 
        sender: 'ai',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickIngredients = [
    "Potato, onion, tomato, basic masalas",
    "Paneer, capsicum, onion",
    "Eggs, spinach, garlic",
    "Chicken, yogurt, ginger-garlic",
    "Dal, vegetables, cumin"
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-title-lg theme-text-primary">Chatpata AI</h1>
          <Sparkles className="w-6 h-6 text-orange-500" />
        </div>
        <p className="text-body-lg theme-text-secondary">
          Your personal diabetic-friendly recipe creator - just tell me what you have!
        </p>
      </motion.div>

      {/* Quick Ingredient Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex flex-wrap gap-2"
      >
        <span className="text-sm theme-text-muted">Try:</span>
        {quickIngredients.map((item, index) => (
          <button
            key={index}
            onClick={() => setIngredients(item)}
            className="text-xs px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-colors"
          >
            {item}
          </button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="theme-bg-card rounded-2xl theme-border border overflow-hidden flex flex-col h-[600px]"
      >
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-6 theme-border border-b bg-gradient-to-r from-orange-500/10 to-yellow-500/10">
          <div className="p-3 bg-orange-500/20 rounded-xl">
            <ChefHat className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-section-title theme-text-primary flex items-center gap-2">
              Chatpata AI
              <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-500 rounded-full">Recipe Creator</span>
            </h2>
            <p className="text-body theme-text-muted flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Ready to cook something healthy!
            </p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`p-2 rounded-full flex-shrink-0 ${msg.sender === 'user' ? 'bg-orange-500' : 'bg-orange-500/20'}`}>
                  {msg.sender === 'user' ? (
                    <UtensilsCrossed className="w-4 h-4 text-white" />
                  ) : (
                    <ChefHat className="w-4 h-4 text-orange-500" />
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-orange-500 text-white'
                      : msg.isRecipe 
                        ? 'theme-bg-card theme-border border-2 border-orange-500/30 theme-text-primary'
                        : 'theme-bg-card theme-border border theme-text-primary'
                  }`}
                >
                  {msg.isRecipe && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-orange-500/20">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-orange-500">Recipe Created!</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-3 px-4 py-3 theme-bg-card theme-border border rounded-2xl">
                <ChefHat className="w-5 h-5 text-orange-500 animate-bounce" />
                <span className="text-sm theme-text-secondary">Creating your recipe...</span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 theme-border border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="What ingredients do you have? (e.g., potato, onion, tomato...)"
              disabled={isLoading}
              className="flex-1 px-4 py-3 theme-bg-card theme-border border rounded-xl theme-text-primary focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !ingredients.trim()}
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ChatpataAI;
