import React from 'react';
import { Calendar, BookOpen, CheckCircle, XCircle, TrendingUp, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
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

  const topKnowledgeAreas = Object.entries(knowledgeAreas)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
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
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 leading-tight mb-1">{description}</h3>
            <p className="text-sm text-gray-600">{subject}</p>
          </div>
          <div className="flex items-center text-gray-500 text-sm ml-3">
            <Calendar className="w-4 h-4 mr-1" />
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        {/* Assessment Scores */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={`rounded-lg p-3 text-center ${getScoreColor(completeness)}`}>
            <div className="text-xl font-bold">{completeness}%</div>
            <div className="text-xs">Completeness</div>
          </div>
          <div className={`rounded-lg p-3 text-center ${getScoreColor(logicCoherence)}`}>
            <div className="text-xl font-bold">{logicCoherence}%</div>
            <div className="text-xs">Logic</div>
          </div>
        </div>

        {/* Question Details Toggle */}
        {questions.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowQuestions(!showQuestions)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <span className="font-medium text-gray-700">
                题目详情 ({questions.length}道题)
              </span>
              {showQuestions ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            
            {showQuestions && (
              <div className="mt-3 space-y-3 max-h-96 overflow-y-auto">
                {questions.map((question, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">
                          第{question.questionNumber}题
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty === 'easy' ? '简单' : 
                           question.difficulty === 'medium' ? '中等' : '困难'}
                        </span>
                      </div>
                      {question.isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-700 mb-2">
                      <strong>题目：</strong>{question.questionText}
                    </div>
                    
                    <div className="text-sm text-gray-700 mb-2">
                      <strong>学生答案：</strong>
                      <span className={question.isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {question.studentAnswer}
                      </span>
                    </div>
                    
                    {!question.isCorrect && question.correctAnswer && (
                      <div className="text-sm text-gray-700 mb-2">
                        <strong>正确答案：</strong>
                        <span className="text-green-600">{question.correctAnswer}</span>
                      </div>
                    )}
                    
                    {question.explanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-2 text-sm">
                        <strong className="text-blue-800">解析：</strong>
                        <span className="text-blue-700">{question.explanation}</span>
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs text-gray-500">
                      知识点：{question.knowledgeArea}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Knowledge Areas */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Top Knowledge Areas
          </h4>
          <div className="space-y-1">
            {topKnowledgeAreas.map(([area, score]) => (
              <div key={area} className="flex justify-between items-center text-sm">
                <span className="capitalize text-gray-600">{area.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className={`font-medium ${score >= 70 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Knowledge Areas */}
        {weakKnowledgeAreas.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              需要加强的知识点
            </h4>
            <div className="flex flex-wrap gap-1">
              {weakKnowledgeAreas.map((area, index) => (
                <span key={index} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Strengths and Weak Points */}
        <div className="space-y-3">
          {/* Error Analysis and Solution - Only show if incorrect */}
          {!isCorrect && (errorAnalysis || solutionApproach) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
              {errorAnalysis && (
                <div>
                  <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Error Analysis
                  </h4>
                  <p className="text-sm text-red-700 leading-relaxed">{errorAnalysis}</p>
                </div>
              )}
              
              {solutionApproach && (
                <div>
                  <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Correct Solution Approach
                  </h4>
                  <p className="text-sm text-red-700 leading-relaxed whitespace-pre-line">{solutionApproach}</p>
                </div>
              )}
            </div>
          )}

          {strengths.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Strengths
              </h4>
              <div className="flex flex-wrap gap-1">
                {strengths.slice(0, 2).map((strength, index) => (
                  <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {weakPoints.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Areas to Improve
              </h4>
              <div className="flex flex-wrap gap-1">
                {weakPoints.slice(0, 2).map((weakness, index) => (
                  <span key={index} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    {weakness}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentEntry;