import React from 'react';
import { TrendingUp, Target, CheckCircle, AlertCircle } from 'lucide-react';
import { DailyGoals } from '../types/food';

interface MacroNutrients {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface DailySummaryProps {
  totalMacros: MacroNutrients;
  goals: DailyGoals;
}

const DailySummary: React.FC<DailySummaryProps> = ({ totalMacros, goals }) => {
  const calorieProgress = Math.min((totalMacros.calories / goals.calories) * 100, 100);
  const remainingCalories = Math.max(goals.calories - totalMacros.calories, 0);

  const getMacroStatus = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90 && percentage <= 110) return 'success';
    if (percentage >= 80 && percentage <= 120) return 'warning';
    return 'danger';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-emerald-500" />
        <h2 className="text-lg font-semibold text-gray-900">Today's Summary</h2>
      </div>

      <div className="space-y-4">
        {/* Calorie Progress */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Calories</span>
            <span className="text-sm text-gray-600">
              {totalMacros.calories} / {goals.calories}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${calorieProgress}%` }}
            ></div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <Target className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {remainingCalories} calories remaining
            </span>
          </div>
        </div>

        {/* Enhanced Macro Breakdown */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'Protein', current: totalMacros.protein, target: goals.protein, color: 'blue' },
            { name: 'Fat', current: totalMacros.fat, target: goals.fat, color: 'amber' },
            { name: 'Carbs', current: totalMacros.carbs, target: goals.carbs, color: 'purple' }
          ].map((macro) => {
            const status = getMacroStatus(macro.current, macro.target);
            const percentage = Math.round((macro.current / macro.target) * 100);
            
            return (
              <div key={macro.name} className={`bg-${macro.color}-50 rounded-lg p-3`}>
                <div className="flex items-center justify-between mb-1">
                  <div className={`text-lg font-bold text-${macro.color}-600`}>
                    {macro.current}g
                  </div>
                  {status === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : status === 'warning' ? (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className={`text-xs text-${macro.color}-700 mb-1`}>{macro.name}</div>
                <div className="text-xs text-gray-600">
                  {percentage}% of {macro.target}g
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Indicators */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Daily Progress</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-xs text-gray-600">On Track</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-gray-600">Close</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-gray-600">Off Target</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;