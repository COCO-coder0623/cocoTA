import React from 'react';
import { Calendar, BookOpen, CheckCircle, XCircle, TrendingUp, AlertTriangle, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { KnowledgeAreas, QuestionAnalysis } from '../types/education';

interface AssessmentEntryProps {
  id: string;
  description: string;
  subject: string;
  isCorrect: boolean;
  completeness: number;
  logicCoherence: number;
  knowledgeAreas: KnowledgeAreas;
  weakPoints: string[];
  strengths: string[];
  errorAnalysis: string;
  solutionApproach: string;
  imageUrl: string;
  timestamp: Date;
  questions?: QuestionAnalysis[];
  totalQuestions?: number;
  correctQuestions?: number;
  weakKnowledgeAreas?: string[];
}

const AssessmentEntry: React.FC<AssessmentEntryProps> = ({ 
  description, 
  subject,
  isCorrect, 
  completeness,
  logicCoherence,
  knowledgeAreas,
  weakPoints,
  strengths,
  errorAnalysis,
  solutionApproach,
  imageUrl, 
  timestamp,
  questions = [],
  totalQuestions = 0,
  correctQuestions = 0,
  weakKnowledgeAreas = []
}) => {
  const [showQuestions, setShowQuestions] = React.useState(false);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '中等';
    }
  };

  const topKnowledgeAreas = Object.entries(knowledgeAreas)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  // Group questions by section if available
  const groupedQuestions = questions.reduce((acc, question) => {
    const section = question.knowledgeArea || '其他题目';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(question);
    return acc;
  }, {} as Record<string, QuestionAnalysis[]>);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header with image */}
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={description}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm rounded-full p-2">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          {isCorrect ? (
            <div className="bg-green-500 rounded-full p-1">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="bg-red-500 rounded-full p-1">
              <XCircle className="w-4 h-4 text-white" />
            </div>
          )}
          {totalQuestions > 0 && (
            <div className="bg-blue-500 rounded-full px-2 py-1">
              <span className="text-white text-xs font-medium">
                {correctQuestions}/{totalQuestions}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {/* Title and basic info */}
        <div className="text-center mb-6 pb-4 border-b-2 border-blue-100">
          <h2 className="text-2xl font-bold text-blue-600 mb-2 flex items-center justify-center gap-2">
            🌟 {description}
          </h2>
          <p className="text-gray-600">让我们一起学习和提高 📚</p>
          <div className="flex items-center justify-center text-gray-500 text-sm mt-2">
            <Calendar className="w-4 h-4 mr-1" />
            {timestamp.toLocaleString('zh-CN')}
          </div>
        </div>
        
        {/* Assessment Scores */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`rounded-lg p-4 text-center ${getScoreColor(completeness)}`}>
            <div className="text-2xl font-bold">{completeness}%</div>
            <div className="text-sm">完成度</div>
          </div>
          <div className={`rounded-lg p-4 text-center ${getScoreColor(logicCoherence)}`}>
            <div className="text-2xl font-bold">{logicCoherence}%</div>
            <div className="text-sm">逻辑性</div>
          </div>
        </div>

        {/* Question Details */}
        {questions.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowQuestions(!showQuestions)}
              className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 border-l-4 border-blue-500"
            >
              <span className="font-semibold text-blue-800 text-lg">
                📝 题目详细分析 ({questions.length}道题)
              </span>
              {showQuestions ? (
                <ChevronUp className="w-5 h-5 text-blue-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-600" />
              )}
            </button>
            
            {showQuestions && (
              <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(groupedQuestions).map(([section, sectionQuestions]) => (
                  <div key={section} className="space-y-3">
                    <h4 className="text-lg font-semibold text-blue-600 border-l-4 border-blue-500 pl-4">
                      {section}
                    </h4>
                    {sectionQuestions.map((question, index) => (
                      <div key={index} className="bg-blue-50 rounded-lg p-4 transition-all duration-200 hover:shadow-md">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-base font-medium text-gray-700">
                              第{question.questionNumber}题
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(question.difficulty)}`}>
                              {getDifficultyText(question.difficulty)}
                            </span>
                            {question.difficulty === 'hard' && (
                              <Star className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          {question.isCorrect ? (
                            <span className="text-green-600 font-semibold flex items-center gap-1">
                              ✓ 正确
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold flex items-center gap-1">
                              ✗ 错误
                            </span>
                          )}
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 mb-3">
                          <div className="text-gray-800 mb-2">
                            <strong>题目：</strong>{question.questionText}
                          </div>
                          
                          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                            <span>你的答案：</span>
                            <span className={`font-semibold ${question.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                              {question.studentAnswer}
                            </span>
                            {question.isCorrect ? (
                              <span className="text-green-600 font-semibold">正确</span>
                            ) : (
                              <span className="text-red-600 font-semibold">错误</span>
                            )}
                          </div>
                        </div>
                        
                        {question.explanation && (
                          <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-400">
                            {!question.isCorrect && question.correctAnswer && (
                              <div className="mb-3">
                                <strong className="text-red-800">正确答案：</strong>
                                <span className="text-green-600 font-semibold ml-2">{question.correctAnswer}</span>
                              </div>
                            )}
                            <div className="text-gray-700">
                              <strong className="text-blue-800">💡 解析：</strong>
                              <div className="mt-1 leading-relaxed">{question.explanation}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Knowledge Areas Summary */}
        {topKnowledgeAreas.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              知识点掌握情况
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {topKnowledgeAreas.map(([area, score]) => (
                <div key={area} className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className={`text-lg font-bold ${score >= 70 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {score}%
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {area.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weak Knowledge Areas Summary */}
        {(weakKnowledgeAreas.length > 0 || weakPoints.length > 0) && (
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📝</span>
              <h4 className="text-lg font-semibold text-blue-600">重点知识回顾</h4>
            </div>
            
            {weakKnowledgeAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-lg p-4 mb-4">
                <div className="font-semibold text-blue-600 mb-2">
                  {index + 1}. {area}
                </div>
                <div className="text-red-600 mb-2 text-sm">
                  📚 知识点：需要加强{area}相关概念的理解
                </div>
                <div className="text-blue-600 text-sm">
                  💡 复习建议：
                  <ul className="list-disc list-inside mt-1 ml-4">
                    <li>多做相关练习题</li>
                    <li>理解基本概念和公式</li>
                    <li>寻求老师或同学的帮助</li>
                  </ul>
                </div>
              </div>
            ))}

            {weakPoints.map((point, index) => (
              <div key={index} className="bg-white rounded-lg p-4 mb-4">
                <div className="font-semibold text-blue-600 mb-2">
                  {weakKnowledgeAreas.length + index + 1}. {point}
                </div>
                <div className="text-red-600 mb-2 text-sm">
                  📚 知识点：{point}
                </div>
                <div className="text-blue-600 text-sm">
                  💡 复习建议：针对此知识点进行专项练习
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Encouragement Footer */}
        <div className="text-center mt-6 pt-6 border-t-2 border-blue-100">
          <div className="text-blue-600 text-lg font-medium">
            💪 认真复习，相信你下次一定能做得更好！加油！
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentEntry;