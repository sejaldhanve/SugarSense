import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Brain, Pill, BarChart3, Save, Plus } from 'lucide-react';
import { createPortal } from 'react-dom';

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ActivePanel = 'main' | 'blood-sugar' | 'chatpata' | 'medication' | 'reports';

const QuickActionsModal: React.FC<QuickActionsModalProps> = ({ isOpen, onClose }) => {
  const [activePanel, setActivePanel] = useState<ActivePanel>('main');
  const [bloodSugarValue, setBloodSugarValue] = useState('');
  const [bloodSugarUnit, setBloodSugarUnit] = useState('mg/dL');
  const [bloodSugarNotes, setBloodSugarNotes] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState('');
  const [medicationName, setMedicationName] = useState('');
  const [medicationDose, setMedicationDose] = useState('');
  const [medicationFrequency, setMedicationFrequency] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActivePanel('main');
      // Focus trap
      firstFocusableRef.current?.focus();
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  const showSuccessToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleLogBloodSugar = async () => {
    if (!bloodSugarValue) return;
    
    const entry = {
      value: parseFloat(bloodSugarValue),
      unit: bloodSugarUnit,
      timestamp: new Date().toISOString(),
      notes: bloodSugarNotes
    };

    try {
      // Try backend first
      const response = await fetch('/api/log-glucose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      
      if (!response.ok) throw new Error('Backend not available');
      
      showSuccessToast('Blood sugar logged successfully!');
    } catch (error) {
      // Fallback to localStorage
      const existing = JSON.parse(localStorage.getItem('ss_blood_sugar') || '[]');
      existing.push(entry);
      localStorage.setItem('ss_blood_sugar', JSON.stringify(existing));
      showSuccessToast('Blood sugar logged locally!');
    }
    
    // Reset form
    setBloodSugarValue('');
    setBloodSugarNotes('');
    setActivePanel('main');
  };

  const generateRecipe = async () => {
    if (!ingredients) return;
    
    const ingredientList = ingredients.split(',').map(i => i.trim()).filter(Boolean);
    
    try {
      const response = await fetch('/api/chatpata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: ingredientList })
      });
      
      if (!response.ok) throw new Error('Backend not available');
      
      const data = await response.json();
      setGeneratedRecipe(data.recipe);
    } catch (error) {
      // Fallback recipe generator
      const recipe = `
# Healthy ${ingredientList[0]} Recipe

## Ingredients:
${ingredientList.map(ing => `- ${ing}`).join('\n')}

## Instructions:
1. Wash and prepare all ingredients
2. Heat a non-stick pan with minimal oil
3. Add ${ingredientList[0]} and cook for 5-7 minutes
4. Season with herbs and spices (avoid excess salt/sugar)
5. Serve hot with a side of fresh vegetables

## Diabetic-Friendly Tips:
- Use minimal oil and avoid added sugars
- Pair with high-fiber vegetables
- Control portion sizes
- Monitor blood sugar 2 hours after eating

*This is a basic template. Consult your nutritionist for personalized advice.*
      `;
      setGeneratedRecipe(recipe);
    }
  };

  const saveRecipe = () => {
    if (!generatedRecipe) return;
    
    const recipe = {
      id: Date.now().toString(),
      title: `Recipe with ${ingredients}`,
      content: generatedRecipe,
      ingredients: ingredients.split(',').map(i => i.trim()),
      createdAt: new Date().toISOString()
    };
    
    const existing = JSON.parse(localStorage.getItem('saved_recipes') || '[]');
    existing.push(recipe);
    localStorage.setItem('saved_recipes', JSON.stringify(existing));
    
    showSuccessToast('Recipe saved successfully!');
  };

  const handleAddMedication = async () => {
    if (!medicationName || !medicationDose) return;
    
    const medication = {
      id: Date.now().toString(),
      name: medicationName,
      dose: medicationDose,
      frequency: medicationFrequency,
      startDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medication)
      });
      
      if (!response.ok) throw new Error('Backend not available');
      
      showSuccessToast('Medication added successfully!');
    } catch (error) {
      const existing = JSON.parse(localStorage.getItem('ss_medications') || '[]');
      existing.push(medication);
      localStorage.setItem('ss_medications', JSON.stringify(existing));
      showSuccessToast('Medication added locally!');
    }
    
    // Reset form
    setMedicationName('');
    setMedicationDose('');
    setMedicationFrequency('');
    setActivePanel('main');
  };

  const quickActions = [
    {
      id: 'blood-sugar',
      title: 'Log Blood Sugar',
      subtitle: 'Record your current glucose level',
      icon: Activity,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-500/10',
      panel: 'blood-sugar' as ActivePanel
    },
    {
      id: 'chatpata',
      title: 'Chatpata AI',
      subtitle: 'Give ingredients, get a healthy recipe',
      icon: Brain,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-500/10',
      panel: 'chatpata' as ActivePanel
    },
    {
      id: 'medication',
      title: 'Add Medication',
      subtitle: 'Set up a new medication reminder',
      icon: Pill,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      panel: 'medication' as ActivePanel
    },
    {
      id: 'reports',
      title: 'View Reports',
      subtitle: 'Check your health analytics',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      panel: 'reports' as ActivePanel
    }
  ];

  const renderMainPanel = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActivePanel(action.panel)}
            className={`p-6 rounded-xl ${action.bgColor} border border-white/20 hover:border-white/30 transition-all duration-200 text-left group`}
          >
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${action.color} mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
            <p className="text-sm text-slate-300">{action.subtitle}</p>
          </motion.button>
        );
      })}
    </div>
  );

  const renderBloodSugarPanel = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Blood Sugar Level</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={bloodSugarValue}
            onChange={(e) => setBloodSugarValue(e.target.value)}
            placeholder="Enter value"
            className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={bloodSugarUnit}
            onChange={(e) => setBloodSugarUnit(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="mg/dL">mg/dL</option>
            <option value="mmol/L">mmol/L</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white mb-2">Notes (Optional)</label>
        <textarea
          value={bloodSugarNotes}
          onChange={(e) => setBloodSugarNotes(e.target.value)}
          placeholder="Before/after meal, exercise, etc."
          rows={3}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={handleLogBloodSugar}
          disabled={!bloodSugarValue}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Log Reading
        </button>
        <button
          onClick={() => setActivePanel('main')}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );

  const renderChatpataPanel = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Ingredients</label>
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="tomatoes, onions, spinach, chicken..."
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <p className="text-xs text-slate-400 mt-1">Separate ingredients with commas</p>
      </div>
      
      <button
        onClick={generateRecipe}
        disabled={!ingredients}
        className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-slate-600 text-white py-3 px-6 rounded-xl font-medium transition-colors"
      >
        Generate Healthy Recipe
      </button>
      
      {generatedRecipe && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-white">Generated Recipe</h4>
            <button
              onClick={saveRecipe}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Recipe
            </button>
          </div>
          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">{generatedRecipe}</pre>
        </div>
      )}
      
      <button
        onClick={() => setActivePanel('main')}
        className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
      >
        Back
      </button>
    </div>
  );

  const renderMedicationPanel = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Medication Name</label>
        <input
          type="text"
          value={medicationName}
          onChange={(e) => setMedicationName(e.target.value)}
          placeholder="e.g., Metformin"
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white mb-2">Dose</label>
        <input
          type="text"
          value={medicationDose}
          onChange={(e) => setMedicationDose(e.target.value)}
          placeholder="e.g., 500mg"
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white mb-2">Frequency</label>
        <select
          value={medicationFrequency}
          onChange={(e) => setMedicationFrequency(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Select frequency</option>
          <option value="once-daily">Once daily</option>
          <option value="twice-daily">Twice daily</option>
          <option value="three-times-daily">Three times daily</option>
          <option value="as-needed">As needed</option>
        </select>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={handleAddMedication}
          disabled={!medicationName || !medicationDose}
          className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-slate-600 text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Medication
        </button>
        <button
          onClick={() => setActivePanel('main')}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );

  const renderReportsPanel = () => {
    const bloodSugarData = JSON.parse(localStorage.getItem('ss_blood_sugar') || '[]');
    const medicationData = JSON.parse(localStorage.getItem('ss_medications') || '[]');
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/20 rounded-xl p-4">
            <h4 className="font-semibold text-white mb-2">Blood Sugar Logs</h4>
            <p className="text-2xl font-bold text-blue-400">{bloodSugarData.length}</p>
            <p className="text-sm text-slate-400">Total readings</p>
          </div>
          
          <div className="bg-white/5 border border-white/20 rounded-xl p-4">
            <h4 className="font-semibold text-white mb-2">Medications</h4>
            <p className="text-2xl font-bold text-green-400">{medicationData.length}</p>
            <p className="text-sm text-slate-400">Active medications</p>
          </div>
        </div>
        
        {bloodSugarData.length > 0 && (
          <div className="bg-white/5 border border-white/20 rounded-xl p-4">
            <h4 className="font-semibold text-white mb-3">Recent Blood Sugar Readings</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {bloodSugarData.slice(-5).reverse().map((entry: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
                  <span className="text-white">{entry.value} {entry.unit}</span>
                  <span className="text-sm text-slate-400">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={() => setActivePanel('main')}
          className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
        >
          Back
        </button>
      </div>
    );
  };

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'blood-sugar':
        return renderBloodSugarPanel();
      case 'chatpata':
        return renderChatpataPanel();
      case 'medication':
        return renderMedicationPanel();
      case 'reports':
        return renderReportsPanel();
      default:
        return renderMainPanel();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-slate-800 border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img
                src="/assets/logo/sugar-sense.png"
                alt="Sugar Sense logo"
                className="w-6 h-6"
                style={{
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                }}
              />
              <h2 id="modal-title" className="text-xl font-semibold text-white">
                {activePanel === 'main' ? 'Quick Actions' : 
                 activePanel === 'blood-sugar' ? 'Log Blood Sugar' :
                 activePanel === 'chatpata' ? 'Chatpata AI' :
                 activePanel === 'medication' ? 'Add Medication' :
                 'Health Reports'}
              </h2>
            </div>
            <button
              ref={firstFocusableRef}
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <motion.div
            key={activePanel}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderActivePanel()}
          </motion.div>

          {/* Success Toast */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default QuickActionsModal;