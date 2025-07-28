import React, { useState } from 'react';
import { Target, Save, TrendingUp, BookOpen, Calculator, Shapes, PieChart, FileText, Ruler } from 'lucide-react';
import { LearningGoals } from '../types/education';

interface LearningGoalsTabProps {
  goals: LearningGoals;
  onGoalsUpdate: (goals: LearningGoals) => void;
}

const LearningGoalsTab: React.FC<LearningGoalsTabProps> = ({ goals, onGoalsUpdate }) => {
  const [editingGoals, setEditingGoals] = useState<LearningGoals>(goals);
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
      name: 'Beginner (Grade 1-2)',
      description: 'Focus on basic arithmetic and number recognition',
      goals: { 
        dailyProblems: 5, 
        targetAccuracy: 70, 
        focusAreas: ['Basic Addition', 'Number Recognition'],
        weeklyGoals: { arithmetic: 80, geometry: 20, fractions: 10, wordProblems: 30, measurement: 40 }
      }
    },
    {
      name: 'Intermediate (Grade 3-4)',
      description: 'Balanced approach with introduction to fractions',
      goals: { 
        dailyProblems: 8, 
        targetAccuracy: 80, 
        focusAreas: ['Multiplication', 'Fractions', 'Word Problems'],
        weeklyGoals: { arithmetic: 85, geometry: 60, fractions: 70, wordProblems: 75, measurement: 65 }
      }
    },
    {
      name: 'Advanced (Grade 5-6)',
      description: 'Complex problem solving and geometry',
      goals: { 
        dailyProblems: 12, 
        targetAccuracy: 85, 
        focusAreas: ['Complex Word Problems', 'Geometry', 'Advanced Fractions'],
        weeklyGoals: { arithmetic: 90, geometry: 85, fractions: 80, wordProblems: 85, measurement: 80 }
      }
    }
  ];

  const knowledgeAreaIcons = {
    arithmetic: Calculator,
    geometry: Shapes,
    fractions: PieChart,
    wordProblems: FileText,
    measurement: Ruler
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Learning Goals</h2>
            <p className="text-sm text-gray-600">Set daily learning targets and focus areas</p>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Goals */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Daily Goals</h4>
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-blue-700">Daily Problems</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {isEditing ? (
                    <input
                      type="number"
                      value={editingGoals.dailyProblems}
                      onChange={(e) => setEditingGoals({...editingGoals, dailyProblems: Number(e.target.value)})}
                      className="w-20 text-center bg-transparent border-b border-blue-300 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    goals.dailyProblems
                  )}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-green-700">Target Accuracy</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {isEditing ? (
                    <input
                      type="number"
                      value={editingGoals.targetAccuracy}
                      onChange={(e) => setEditingGoals({...editingGoals, targetAccuracy: Number(e.target.value)})}
                      className="w-20 text-center bg-transparent border-b border-green-300 focus:border-green-500 outline-none"
                    />
                  ) : (
                    goals.targetAccuracy
                  )}%
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Knowledge Area Goals */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Weekly Knowledge Goals</h4>
            <div className="space-y-2">
              {Object.entries(goals.weeklyGoals).map(([area, target]) => {
                const Icon = knowledgeAreaIcons[area as keyof typeof knowledgeAreaIcons];
                return (
                  <div key={area} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm capitalize text-gray-700">
                        {area.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editingGoals.weeklyGoals[area as keyof typeof editingGoals.weeklyGoals]}
                          onChange={(e) => setEditingGoals({
                            ...editingGoals, 
                            weeklyGoals: {
                              ...editingGoals.weeklyGoals,
                              [area]: Number(e.target.value)
                            }
                          })}
                          className="w-12 text-center bg-white border border-gray-300 rounded px-1"
                        />
                      ) : (
                        target
                      )}%
                    </div>
                  </div>
                );
              })}
            </div>
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
                    <p className="text-sm text-gray-600 mb-2">{preset.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {preset.goals.focusAreas.map((area, index) => (
                        <span key={index} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {preset.goals.dailyProblems} problems/day • {preset.goals.targetAccuracy}% accuracy
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Focus Areas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Focus Areas</h3>
        
        <div className="flex flex-wrap gap-2">
          {goals.focusAreas.map((area, index) => (
            <span key={index} className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium">
              {area}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningGoalsTab;