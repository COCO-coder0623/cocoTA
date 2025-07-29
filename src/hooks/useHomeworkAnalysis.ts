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
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration missing. Please connect to Supabase using the "Connect to Supabase" button in the top right corner.');
      }
      
      const apiUrl = `${supabaseUrl}/functions/v1/analyze-homework`;
      const headers = {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      };

      console.log('Frontend: Making request to:', apiUrl);
      console.log('Frontend: Using Supabase URL:', supabaseUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ image: base64Image }),
      });

      console.log('Frontend: Response status:', response.status);
      console.log('Frontend: Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        console.log('Frontend: Response not OK, status:', response.status);
        
        if (response.status === 404) {
          throw new Error('Edge Function not found. Please deploy the analyze-homework function to your Supabase project using the Supabase CLI: supabase functions deploy analyze-homework');
        }
        
        let errorMessage = 'Analysis failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If we can't parse the error response, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let analysisResult;
      try {
        const responseText = await response.text();
        if (!responseText.trim()) {
          throw new Error('Empty response from server');
        }
        analysisResult = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response format from server');
      }

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