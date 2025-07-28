export interface KnowledgeAreas {
  arithmetic: number;
  geometry: number;
  fractions: number;
  wordProblems: number;
  measurement: number;
}

export interface AssessmentResult {
  id: string;
  description: string;
  subject: string;
  isCorrect: boolean;
  completeness: number; // 0-100
  logicCoherence: number; // 0-100
  knowledgeAreas: KnowledgeAreas;
  weakPoints: string[];
  strengths: string[];
  errorAnalysis: string;
  solutionApproach: string;
  imageUrl: string;
  timestamp: Date;
}

export interface LearningGoals {
  dailyProblems: number;
  targetAccuracy: number; // percentage
  focusAreas: string[];
  weeklyGoals: {
    arithmetic: number;
    geometry: number;
    fractions: number;
    wordProblems: number;
    measurement: number;
  };
}

export interface StudentProgress {
  totalProblems: number;
  correctProblems: number;
  accuracy: number;
  knowledgeAreas: KnowledgeAreas;
  improvementTrend: 'improving' | 'stable' | 'declining';
}