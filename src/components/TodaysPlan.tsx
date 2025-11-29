import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Edit3, Save, X, Trash2, Plus } from 'lucide-react';

interface PlanItem {
  id: string;
  time: string;
  task: string;
  type: 'medication' | 'glucose-check' | 'recipe' | 'custom';
  status: 'completed' | 'pending';
  notes?: string;
}

const TodaysPlan: React.FC = () => {
  const [planItems, setPlanItems] = useState<PlanItem[]>([
    {
      id: '1',
      time: '8:00 AM',
      task: 'Morning Medication',
      type: 'medication',
      status: 'completed'
    },
    {
      id: '2',
      time: '12:30 PM',
      task: 'Blood Sugar Check',
      type: 'glucose-check',
      status: 'pending'
    },
    {
      id: '3',
      time: '2:00 PM',
      task: 'Healthy Lunch',
      type: 'recipe',
      status: 'pending'
    },
    {
      id: '4',
      time: '6:00 PM',
      task: 'Evening Walk',
      type: 'custom',
      status: 'pending'
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ time: '', task: '', notes: '' });
  const [showUndo, setShowUndo] = useState<{ id: string; item: PlanItem } | null>(null);

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('ss_todays_plan');
    if (saved) {
      setPlanItems(JSON.parse(saved));
    }
  }, []);

  const savePlanItems = (items: PlanItem[]) => {
    setPlanItems(items);
    localStorage.setItem('ss_todays_plan', JSON.stringify(items));
    
    // Try to sync with backend
    fetch('/api/todays-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    }).catch(() => {
      // Silently fail if backend not available
    });
  };

  const handleEdit = (item: PlanItem) => {
    setEditingId(item.id);
    setEditForm({
      time: item.time,
      task: item.task,
      notes: item.notes || ''
    });
  };

  const handleSave = () => {
    if (!editingId) return;
    
    const updatedItems = planItems.map(item =>
      item.id === editingId
        ? { ...item, time: editForm.time, task: editForm.task, notes: editForm.notes }
        : item
    );
    
    savePlanItems(updatedItems);
    setEditingId(null);
    setEditForm({ time: '', task: '', notes: '' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ time: '', task: '', notes: '' });
  };

  const handleToggleComplete = (id: string) => {
    const updatedItems = planItems.map(item =>
      item.id === id
        ? { ...item, status: item.status === 'completed' ? 'pending' : 'completed' as const }
        : item
    );
    
    savePlanItems(updatedItems);
  };

  const handleDelete = (id: string) => {
    const itemToDelete = planItems.find(item => item.id === id);
    if (!itemToDelete) return;
    
    const updatedItems = planItems.filter(item => item.id !== id);
    savePlanItems(updatedItems);
    
    // Show undo option
    setShowUndo({ id, item: itemToDelete });
    setTimeout(() => setShowUndo(null), 5000);
  };

  const handleUndo = () => {
    if (!showUndo) return;
    
    const updatedItems = [...planItems, showUndo.item].sort((a, b) => 
      a.time.localeCompare(b.time)
    );
    
    savePlanItems(updatedItems);
    setShowUndo(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medication':
        return 'from-green-500 to-emerald-500';
      case 'glucose-check':
        return 'from-blue-500 to-cyan-500';
      case 'recipe':
        return 'from-orange-500 to-yellow-500';
      default:
        return 'from-purple-500 to-pink-500';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {planItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border transition-all duration-300 ${
              item.status === 'completed' 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-white/5 border-white/20 hover:bg-white/10'
            }`}
          >
            {editingId === item.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.time}
                  onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="Time"
                  onKeyDown={handleKeyDown}
                />
                <input
                  type="text"
                  value={editForm.task}
                  onChange={(e) => setEditForm({ ...editForm, task: e.target.value })}
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="Task"
                  onKeyDown={handleKeyDown}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center justify-center gap-1 transition-colors"
                    aria-label="Save changes"
                  >
                    <Save className="w-3 h-3" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-2 py-1 rounded text-xs flex items-center justify-center gap-1 transition-colors"
                    aria-label="Cancel editing"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">{item.time}</span>
                  <div className="flex items-center gap-1">
                    {item.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      aria-label="Edit task"
                    >
                      <Edit3 className="w-3 h-3 text-slate-400 hover:text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      aria-label="Delete task"
                    >
                      <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-400" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={item.status === 'completed'}
                    onChange={() => handleToggleComplete(item.id)}
                    className="w-4 h-4 text-green-500 bg-white/10 border-white/20 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <p className={`font-medium flex-1 ${
                    item.status === 'completed' ? 'text-green-400 line-through' : 'text-white'
                  }`}>
                    {item.task}
                  </p>
                </div>
                
                {item.status === 'completed' && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-block mt-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full"
                  >
                    +10 XP
                  </motion.span>
                )}
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Undo Toast */}
      {showUndo && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 bg-slate-700 border border-white/20 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3"
        >
          <span className="text-sm">Task deleted</span>
          <button
            onClick={handleUndo}
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm transition-colors"
          >
            Undo
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default TodaysPlan;