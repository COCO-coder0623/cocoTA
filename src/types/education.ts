export interface KnowledgeAreas {
  arithmetic: number;
  geometry: number;
  fractions: number;
  wordProblems: number;
  measurement: number;
}

export interface QuestionAnalysis {
  questionNumber: number;
  questionText: string;
  studentAnswer: string;
  isCorrect: boolean;
  correctAnswer?: string;
  explanation?: string;
  knowledgeArea: string;
  difficulty: 'easy' | 'medium' | 'hard';
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
  questions?: QuestionAnalysis[];
  totalQuestions?: number;
  correctQuestions?: number;
  weakKnowledgeAreas?: string[];
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