import React from 'react';
import { Calendar, BookOpen, CheckCircle, XCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { KnowledgeAreas } from '../types/education';

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
  imageUrl: string;
  timestamp: Date;
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
  imageUrl, 
  timestamp 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
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

        {/* Strengths and Weak Points */}
        <div className="space-y-3">
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