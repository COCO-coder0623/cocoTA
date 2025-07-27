import React, { useState } from 'react';
import { Target, Save, TrendingUp, Activity, Zap, Beef } from 'lucide-react';
import { DailyGoals } from '../types/food';

interface GoalsTabProps {
  goals: DailyGoals;
  onGoalsUpdate: (goals: DailyGoals) => void;
}

const GoalsTab: React.FC<GoalsTabProps> = ({ goals, onGoalsUpdate }) => {
  const [editingGoals, setEditingGoals] = useState<DailyGoals>(goals);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onGoalsUpdate(editingGoals);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingGoals(goals);
    setIsEditing(false);
  };

  const presetGoals = [
    {
      name: 'Weight Loss',
      description: 'Moderate calorie deficit with high protein',
      goals: { calories: 1800, protein: 140, fat: 60, carbs: 180 }
    },
    {
      name: 'Muscle Gain',
      description: 'Calorie surplus with high protein',
      goals: { calories: 2500, protein: 180, fat: 85, carbs: 280 }
    },
    {
      name: 'Maintenance',
      description: 'Balanced macros for weight maintenance',
      goals: { calories: 2200, protein: 150, fat: 75, carbs: 220 }
    },
    {
      name: 'Athletic',
      description: 'High carbs for performance',
      goals: { calories: 2800, protein: 160, fat: 90, carbs: 350 }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Daily Goals</h2>
            <p className="text-sm text-gray-600">Set your macro nutrient targets</p>
          </div>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Edit Goals
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        )}
      </div>

      {/* Current Goals Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Targets</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-emerald-50 rounded-lg p-4 text-center">
            <Zap className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-600">
              {isEditing ? (
                <input
                  type="number"
                  value={editingGoals.calories}
                  onChange={(e) => setEditingGoals({...editingGoals, calories: Number(e.target.value)})}
                  className="w-20 text-center bg-transparent border-b border-emerald-300 focus:border-emerald-500 outline-none"
                />
              ) : (
                goals.calories
              )}
            </div>
            <div className="text-sm text-emerald-700">Calories</div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <Beef className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-600">
              {isEditing ? (
                <input
                  type="number"
                  value={editingGoals.protein}
                  onChange={(e) => setEditingGoals({...editingGoals, protein: Number(e.target.value)})}
                  className="w-16 text-center bg-transparent border-b border-blue-300 focus:border-blue-500 outline-none"
                />
              ) : (
                goals.protein
              )}g
            </div>
            <div className="text-sm text-blue-700">Protein</div>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <Activity className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-amber-600">
              {isEditing ? (
                <input
                  type="number"
                  value={editingGoals.fat}
                  onChange={(e) => setEditingGoals({...editingGoals, fat: Number(e.target.value)})}
                  className="w-16 text-center bg-transparent border-b border-amber-300 focus:border-amber-500 outline-none"
                />
              ) : (
                goals.fat
              )}g
            </div>
            <div className="text-sm text-amber-700">Fat</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-purple-600">
              {isEditing ? (
                <input
                  type="number"
                  value={editingGoals.carbs}
                  onChange={(e) => setEditingGoals({...editingGoals, carbs: Number(e.target.value)})}
                  className="w-16 text-center bg-transparent border-b border-purple-300 focus:border-purple-500 outline-none"
                />
              ) : (
                goals.carbs
              )}g
            </div>
            <div className="text-sm text-purple-700">Carbs</div>
          </div>
        </div>
      </div>

      {/* Preset Goals */}
      {isEditing && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Presets</h3>
          
          <div className="grid gap-3">
            {presetGoals.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setEditingGoals(preset.goals)}
                className="text-left p-4 border border-gray-200 hover:border-purple-300 rounded-lg transition-colors duration-200 hover:bg-purple-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{preset.name}</h4>
                    <p className="text-sm text-gray-600">{preset.description}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {preset.goals.calories} cal • {preset.goals.protein}p • {preset.goals.fat}f • {preset.goals.carbs}c
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Macro Distribution Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Macro Distribution</h3>
        
        <div className="space-y-3">
          {[
            { name: 'Protein', value: goals.protein * 4, color: 'bg-blue-500', total: goals.calories },
            { name: 'Fat', value: goals.fat * 9, color: 'bg-amber-500', total: goals.calories },
            { name: 'Carbs', value: goals.carbs * 4, color: 'bg-purple-500', total: goals.calories }
          ].map((macro) => {
            const percentage = Math.round((macro.value / macro.total) * 100);
            return (
              <div key={macro.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{macro.name}</span>
                  <span className="text-gray-600">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${macro.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GoalsTab;