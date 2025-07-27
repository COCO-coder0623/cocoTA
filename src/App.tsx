import React, { useState } from 'react';
import { Brain, Utensils, Plus, Sparkles, Target, History } from 'lucide-react';
import Navigation from './components/Navigation';
import CameraCapture from './components/CameraCapture';
import FoodEntry from './components/FoodEntry';
import DailySummary from './components/DailySummary';
import GoalsTab from './components/GoalsTab';
import CalendarPage from './components/CalendarPage';
import { useFoodAnalysis } from './hooks/useFoodAnalysis';
import { useLocalStorage } from './hooks/useLocalStorage';
import { FoodEntry as FoodEntryType, DailyGoals } from './types/food';
import { calculateTotalMacros } from './utils/macroCalculations';
import { isWithin24Hours, formatDate } from './utils/dateUtils';

type TabType = 'tracker' | 'goals' | 'calendar';

function App() {
  const [foodEntries, setFoodEntries] = useLocalStorage<FoodEntryType[]>('foodEntries', []);
  const [dailyGoals, setDailyGoals] = useLocalStorage<DailyGoals>('dailyGoals', {
    calories: 2000,
    protein: 150,
    fat: 65,
    carbs: 250
  });
  const [activeTab, setActiveTab] = useState<TabType>('tracker');
  const [showCapture, setShowCapture] = useState(false);
  const { analyzeFood, isAnalyzing, error } = useFoodAnalysis();

  // Parse stored dates back to Date objects
  const parsedEntries = foodEntries.map(entry => ({
    ...entry,
    timestamp: new Date(entry.timestamp)
  }));

  // Filter entries within 24 hours
  const recentEntries = parsedEntries.filter(entry => isWithin24Hours(entry.timestamp));

  const handleImageCapture = async (imageUrl: string, file: File) => {
    const result = await analyzeFood(file);
    
    if (result) {
      const newEntry: FoodEntryType = {
        id: Date.now().toString(),
        description: result.description,
        macros: result.macros,
        imageUrl,
        timestamp: new Date(),
      };
      
      setFoodEntries(prev => [newEntry, ...prev]);
      setShowCapture(false);
    }
  };

  const totalMacros = calculateTotalMacros(recentEntries);

  const handleGoalsUpdate = (newGoals: DailyGoals) => {
    setDailyGoals(newGoals);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-2 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">AI Calorie Tracker</h1>
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-sm text-gray-600">Powered by GPT-4o Vision</p>
              </div>
            </div>
            
            {!showCapture && activeTab === 'tracker' && (
              <button
                onClick={() => setShowCapture(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Food
              </button>
            )}
          </div>
          
          {/* Navigation Tabs */}
          <Navigation 
            activeTab={activeTab} 
            onTabChange={(tab) => {
              setActiveTab(tab);
              setShowCapture(false);
            }} 
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {activeTab === 'tracker' && (
          <>
            {/* Camera Capture */}
            {showCapture && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Capture Food</h2>
                  <button
                    onClick={() => setShowCapture(false)}
                    disabled={isAnalyzing}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
                <CameraCapture 
                  onImageCapture={handleImageCapture}
                  isAnalyzing={isAnalyzing}
                  error={error}
                />
              </div>
            )}

            {/* Daily Summary */}
            {recentEntries.length > 0 && (
              <DailySummary totalMacros={totalMacros} goals={dailyGoals} />
            )}

            {/* Food Entries */}
            <div className="space-y-4">
              {recentEntries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-r from-emerald-100 to-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Utensils className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Welcome to AI Calorie Tracking</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Start by taking a photo of your meal. Our advanced AI will instantly identify the food and calculate accurate nutritional information.
                  </p>
                  <button
                    onClick={() => setShowCapture(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    Try AI Analysis
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Food (24h)</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      {recentEntries.length} AI-analyzed entries
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    {recentEntries.map((entry) => (
                      <div key={entry.id} className="relative">
                        <FoodEntry {...entry} />
                        <div className="absolute top-3 left-3 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-xs text-white font-medium">
                            {formatDate(entry.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {activeTab === 'goals' && (
          <GoalsTab goals={dailyGoals} onGoalsUpdate={handleGoalsUpdate} />
        )}

        {activeTab === 'calendar' && (
          <CalendarPage foodEntries={parsedEntries} goals={dailyGoals} />
        )}
      </main>
    </div>
  );
}

export default App;