import React, { useMemo } from 'react';
import { Calendar, TrendingUp, CheckCircle, XCircle, Clock, Brain, BookOpen } from 'lucide-react';
import { AssessmentResult, LearningGoals } from '../types/education';
import { isSameDay, formatCalendarDate, getCalendarDays, isToday } from '../utils/dateUtils';

interface EducationCalendarPageProps {
  assessments: AssessmentResult[];
  goals: LearningGoals;
}

interface DayStatus {
  date: Date;
  achieved: boolean;
  hasAssessments: boolean;
  totalProblems: number;
  correctProblems: number;
  accuracy: number;
}

const EducationCalendarPage: React.FC<EducationCalendarPageProps> = ({ assessments, goals }) => {
  const calendarData = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const calendarDays = getCalendarDays(currentYear, currentMonth);
    
    return calendarDays.map(date => {
      const dayAssessments = assessments.filter(assessment => 
        isSameDay(new Date(assessment.timestamp), date)
      );
      
      const totalProblems = dayAssessments.length;
      const correctProblems = dayAssessments.filter(a => a.isCorrect).length;
      const accuracy = totalProblems > 0 ? Math.round((correctProblems / totalProblems) * 100) : 0;
      
      // Check if daily goals are achieved
      const problemsAchieved = totalProblems >= goals.dailyProblems;
      const accuracyAchieved = accuracy >= goals.targetAccuracy;
      const achieved = problemsAchieved && accuracyAchieved && totalProblems > 0;
      
      return {
        date,
        achieved,
        hasAssessments: totalProblems > 0,
        totalProblems,
        correctProblems,
        accuracy
      };
    });
  }, [assessments, goals]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const today = new Date();
  const currentMonth = monthNames[today.getMonth()];
  const currentYear = today.getFullYear();

  const achievedDays = calendarData.filter(day => day.hasAssessments && day.achieved).length;
  const missedDays = calendarData.filter(day => day.hasAssessments && !day.achieved).length;
  const totalTrackedDays = calendarData.filter(day => day.hasAssessments).length;
  const totalProblems = calendarData.reduce((sum, day) => sum + day.totalProblems, 0);
  const totalCorrect = calendarData.reduce((sum, day) => sum + day.correctProblems, 0);
  const overallAccuracy = totalProblems > 0 ? Math.round((totalCorrect / totalProblems) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Learning Progress Calendar</h2>
            <p className="text-sm text-gray-600">{currentMonth} {currentYear}</p>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Monthly Summary</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{achievedDays}</div>
            <div className="text-sm text-green-700">Goals Achieved</div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{missedDays}</div>
            <div className="text-sm text-red-700">Goals Missed</div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <BookOpen className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{totalProblems}</div>
            <div className="text-sm text-blue-700">Total Problems</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{overallAccuracy}%</div>
            <div className="text-sm text-purple-700">Overall Accuracy</div>
          </div>
        </div>
        
        {totalTrackedDays > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Success Rate</span>
              <span>{Math.round((achievedDays / totalTrackedDays) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(achievedDays / totalTrackedDays) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {calendarData.map((dayData, index) => {
            const { date, achieved, hasAssessments, totalProblems, accuracy } = dayData;
            const isCurrentMonth = date.getMonth() === today.getMonth();
            const isTodayDate = isToday(date);
            
            let dayClass = "aspect-square p-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer ";
            
            if (!isCurrentMonth) {
              dayClass += "text-gray-300 bg-gray-50";
            } else if (isTodayDate) {
              dayClass += "ring-2 ring-blue-500 bg-blue-50 text-blue-700";
            } else if (hasAssessments) {
              if (achieved) {
                dayClass += "bg-green-500 text-white hover:bg-green-600";
              } else {
                dayClass += "bg-red-500 text-white hover:bg-red-600";
              }
            } else {
              dayClass += "bg-gray-100 text-gray-600 hover:bg-gray-200";
            }
            
            return (
              <div
                key={index}
                className={dayClass}
                title={hasAssessments ? 
                  `${formatCalendarDate(date)}\nProblems: ${totalProblems}\nAccuracy: ${accuracy}%\nGoals ${achieved ? 'Achieved' : 'Missed'}` :
                  formatCalendarDate(date)
                }
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span>{date.getDate()}</span>
                  {hasAssessments && (
                    <div className="flex gap-0.5 mt-1">
                      <div className="w-1 h-1 rounded-full bg-current opacity-75"></div>
                      {totalProblems > 1 && (
                        <div className="w-1 h-1 rounded-full bg-current opacity-75"></div>
                      )}
                      {totalProblems > 2 && (
                        <div className="w-1 h-1 rounded-full bg-current opacity-75"></div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">Goals Achieved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700">Goals Missed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-50 border-2 border-blue-500 rounded"></div>
            <span className="text-sm text-gray-700">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span className="text-sm text-gray-700">No Activity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationCalendarPage;