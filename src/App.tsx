import React, { useState } from 'react';
import { Brain, BookOpen, Plus, Sparkles, GraduationCap } from 'lucide-react';
import Navigation from './components/Navigation';
import HomeworkCapture from './components/HomeworkCapture';
import AssessmentEntry from './components/AssessmentEntry';
import ProgressSummary from './components/ProgressSummary';
import LearningGoalsTab from './components/LearningGoalsTab';
import EducationCalendarPage from './components/EducationCalendarPage';
import { useHomeworkAnalysis } from './hooks/useHomeworkAnalysis';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AssessmentResult, LearningGoals } from './types/education';
import { calculateStudentProgress } from './utils/progressCalculations';
import { isWithin24Hours, formatDate } from './utils/dateUtils';

type TabType = 'assessment' | 'goals' | 'calendar';

function App() {
  const [assessments, setAssessments] = useLocalStorage<AssessmentResult[]>('assessments', []);
  const [learningGoals, setLearningGoals] = useLocalStorage<LearningGoals>('learningGoals', {
    dailyProblems: 8,
    targetAccuracy: 80,
    focusAreas: ['Basic Arithmetic', 'Word Problems'],
    weeklyGoals: {
      arithmetic: 85,
      geometry: 60,
      fractions: 70,
      wordProblems: 75,
      measurement: 65
    }
  });
  const [activeTab, setActiveTab] = useState<TabType>('assessment');
  const [showCapture, setShowCapture] = useState(false);
  const { analyzeHomework, isAnalyzing, error } = useHomeworkAnalysis();

  // Parse stored dates back to Date objects
  const parsedAssessments = assessments.map(assessment => ({
    ...assessment,
    timestamp: new Date(assessment.timestamp)
  }));

  // Filter assessments within 24 hours
  const recentAssessments = parsedAssessments.filter(assessment => isWithin24Hours(assessment.timestamp));

  const handleImageCapture = async (imageUrl: string, file: File) => {
    const result = await analyzeHomework(file);
    
    if (result) {
      const newAssessment: AssessmentResult = {
        id: Date.now().toString(),
        description: result.description,
        subject: result.subject,
        isCorrect: result.isCorrect,
        completeness: result.completeness,
        logicCoherence: result.logicCoherence,
        knowledgeAreas: result.knowledgeAreas,
        weakPoints: result.weakPoints,
        strengths: result.strengths,
        errorAnalysis: result.errorAnalysis,
        solutionApproach: result.solutionApproach,
        imageUrl,
        timestamp: new Date(),
      };
      
      setAssessments(prev => [newAssessment, ...prev]);
      setShowCapture(false);
    }
  };

  const studentProgress = calculateStudentProgress(parsedAssessments);

  const handleGoalsUpdate = (newGoals: DailyGoals) => {
    setLearningGoals(newGoals);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">AI Education Assessment</h1>
                  <Sparkles className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600">Primary School Math Assessment System</p>
              </div>
            </div>
            
            {!showCapture && activeTab === 'assessment' && (
              <button
                onClick={() => setShowCapture(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Homework
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
        {activeTab === 'assessment' && (
          <>
            {/* Homework Capture */}
            {showCapture && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Upload Homework</h2>
                  <button
                    onClick={() => setShowCapture(false)}
                    disabled={isAnalyzing}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
                <HomeworkCapture 
                  onImageCapture={handleImageCapture}
                  isAnalyzing={isAnalyzing}
                  error={error}
                />
              </div>
            )}

            {/* Progress Summary */}
            {recentAssessments.length > 0 && (
              <ProgressSummary progress={studentProgress} goals={learningGoals} />
            )}

            {/* Assessment Entries */}
            <div className="space-y-4">
              {recentAssessments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Welcome to AI Education Assessment</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Start by uploading a photo of student homework. Our advanced AI will analyze the work, check for correctness, and provide detailed feedback on learning progress.
                  </p>
                  <button
                    onClick={() => setShowCapture(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    Try AI Assessment
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Assessments (24h)</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      {recentAssessments.length} AI-analyzed assessments
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    {recentAssessments.map((assessment) => (
                      <div key={assessment.id} className="relative">
                        <AssessmentEntry {...assessment} />
                        <div className="absolute top-3 left-3 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-xs text-white font-medium">
                            {formatDate(assessment.timestamp)}
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
          <LearningGoalsTab goals={learningGoals} onGoalsUpdate={handleGoalsUpdate} />
        )}

        {activeTab === 'calendar' && (
          <EducationCalendarPage assessments={parsedAssessments} goals={learningGoals} />
        )}
      </main>
    </div>
  );
}

export default App;