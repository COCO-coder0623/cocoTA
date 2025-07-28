import { AssessmentResult, KnowledgeAreas, StudentProgress } from '../types/education';
import { isWithin24Hours } from './dateUtils';

export const calculateStudentProgress = (assessments: AssessmentResult[]): StudentProgress => {
  // Filter assessments from the last 24 hours
  const recentAssessments = assessments.filter(assessment => 
    isWithin24Hours(new Date(assessment.timestamp))
  );

  const totalProblems = recentAssessments.length;
  const correctProblems = recentAssessments.filter(a => a.isCorrect).length;
  const accuracy = totalProblems > 0 ? Math.round((correctProblems / totalProblems) * 100) : 0;

  // Calculate average knowledge areas
  const knowledgeAreas: KnowledgeAreas = {
    arithmetic: 0,
    geometry: 0,
    fractions: 0,
    wordProblems: 0,
    measurement: 0
  };

  if (totalProblems > 0) {
    Object.keys(knowledgeAreas).forEach(area => {
      const sum = recentAssessments.reduce((total, assessment) => 
        total + assessment.knowledgeAreas[area as keyof KnowledgeAreas], 0
      );
      knowledgeAreas[area as keyof KnowledgeAreas] = Math.round(sum / totalProblems);
    });
  }

  // Determine improvement trend (simplified - could be enhanced with historical data)
  const improvementTrend = accuracy >= 80 ? 'improving' : accuracy >= 60 ? 'stable' : 'declining';

  return {
    totalProblems,
    correctProblems,
    accuracy,
    knowledgeAreas,
    improvementTrend
  };
};

export const formatScoreValue = (value: number, unit: string = '%'): string => {
  return `${Math.round(value)}${unit}`;
};