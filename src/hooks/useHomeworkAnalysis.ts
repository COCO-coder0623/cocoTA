import { useState } from 'react';
import { KnowledgeAreas } from '../types/education';

interface HomeworkAnalysisResult {
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
}

export const useHomeworkAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeHomework = async (imageFile: File): Promise<HomeworkAnalysisResult | null> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert image to base64
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
        };
        reader.readAsDataURL(imageFile);
      });

      // Call Supabase Edge Function for homework analysis
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-homework`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const analysisResult = await response.json();

      return analysisResult;

    } catch (err) {
      console.error('Homework analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze homework');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analyzeHomework, isAnalyzing, error };
};