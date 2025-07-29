import React from 'react';
import { TrendingUp, Target, CheckCircle, AlertCircle, Trophy, BookOpen, Brain } from 'lucide-react';
import { LearningGoals, StudentProgress } from '../types/education';

interface ProgressSummaryProps {
  progress: StudentProgress;
  goals: LearningGoals;
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ progress, goals }) => {
  const accuracyProgress = Math.min((progress.accuracy / goals.targetAccuracy) * 100, 100);
  const problemsProgress = Math.min((progress.totalProblems / goals.dailyProblems) * 100, 100);
  
  // Check if goals are achieved
  const accuracyAchieved = progress.accuracy >= goals.targetAccuracy;
  const problemsAchieved = progress.totalProblems >= goals.dailyProblems;
  const allGoalsAchieved = accuracyAchieved && problemsAchieved;

  const getKnowledgeStatus = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'warning';
    return 'danger';
  };

  const getTrendIcon = () => {
    switch (progress.improvementTrend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining':
        return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
      default:
        return <Target className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getTrendText = () => {
    switch (progress.improvementTrend) {
      case 'improving':
        return 'Improving';
      case 'declining':
        return 'Needs Attention';
      default:
        return 'Stable';
    }
  };

  const getTrendColor = () => {
    switch (progress.improvementTrend) {
      case 'improving':
        return 'text-green-600 bg-green-50';
      case 'declining':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Achievement Banner */}
      {allGoalsAchieved && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-full">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Daily Goals Achieved! 🎉</h3>
              <p className="text-sm text-green-700">Excellent work! You've met all your learning targets for today.</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-900">今日学习进度</h2>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor()}`}>
          {getTrendIcon()}
          {getTrendText()}
        </div>
      </div>

      <div className="space-y-4">
        {/* Daily Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                完成题目数
              </span>
              <span className="text-sm text-gray-600">
                {progress.totalProblems} / {goals.dailyProblems}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  problemsAchieved ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${problemsProgress}%` }}
              ></div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm">
              {problemsAchieved ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Target className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-gray-600">
                {problemsAchieved ? '目标达成！' : `还需完成 ${goals.dailyProblems - progress.totalProblems} 题`}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                正确率
              </span>
              <span className="text-sm text-gray-600">
                {progress.accuracy}% / {goals.targetAccuracy}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  accuracyAchieved ? 'bg-green-500' : 'bg-purple-500'
                }`}
                style={{ width: `${accuracyProgress}%` }}
              ></div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm">
              {accuracyAchieved ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
              <span className="text-gray-600">
                {accuracyAchieved ? '目标达成！' : '继续加油！'}
              </span>
            </div>
          </div>
        </div>

        {/* Knowledge Areas Progress */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">知识点掌握情况</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {Object.entries(progress.knowledgeAreas).map(([area, current]) => {
              const target = goals.weeklyGoals[area as keyof typeof goals.weeklyGoals];
              const status = getKnowledgeStatus(current, target);
              const achieved = current >= target * 0.9;
              
              return (
                <div key={area} className={`rounded-lg p-3 text-center transition-all duration-300 ${
                  achieved ? 'bg-green-50 ring-1 ring-green-200' : 
                  status === 'warning' ? 'bg-yellow-50' : 'bg-red-50'
                }`}>
                  <div className={`text-lg font-bold ${
                    achieved ? 'text-green-600' : 
                    status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {current}%
                  </div>
                  <div className="text-xs text-gray-600 capitalize">
                    {area === 'arithmetic' ? '算术' : 
                     area === 'geometry' ? '几何' :
                     area === 'fractions' ? '分数' :
                     area === 'wordProblems' ? '应用题' :
                     area === 'measurement' ? '测量' : area}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    目标: {target}%
                  </div>
                  {achieved && (
                    <CheckCircle className="w-3 h-3 text-green-500 mx-auto mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">总体表现</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">{progress.correctProblems} 正确</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-600">{progress.totalProblems - progress.correctProblems} 错误</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;