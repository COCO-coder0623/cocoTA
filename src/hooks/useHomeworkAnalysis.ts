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

      // Call OpenAI API for homework analysis
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this primary school mathematics homework image and provide a response in the following JSON format:
{
  "description": "Brief description of the math problems shown",
  "subject": "Mathematics",
  "isCorrect": boolean,
  "completeness": number (0-100),
  "logicCoherence": number (0-100),
  "knowledgeAreas": {
    "arithmetic": number (0-100),
    "geometry": number (0-100),
    "fractions": number (0-100),
    "wordProblems": number (0-100),
    "measurement": number (0-100)
  },
  "weakPoints": ["array of specific areas needing improvement"],
  "strengths": ["array of areas where student performed well"]
}

Analyze:
1. Whether the mathematical answers are correct
2. If solution steps are complete and logical
3. Which knowledge areas are demonstrated
4. Specific strengths and weaknesses
5. Rate completeness and logic coherence (0-100)

Return only the JSON object, no additional text.`
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 500,
          temperature: 0.1
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${error}`);
      }

      const openaiResult = await response.json();
      const content = openaiResult.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      // Parse the JSON response
      let analysisResult: HomeworkAnalysisResult;
      try {
        analysisResult = JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', content);
        throw new Error('Invalid response format from AI analysis');
      }

      // Validate and ensure proper data types
      analysisResult.completeness = Math.round(Number(analysisResult.completeness) || 0);
      analysisResult.logicCoherence = Math.round(Number(analysisResult.logicCoherence) || 0);
      
      // Ensure knowledge areas are properly formatted
      Object.keys(analysisResult.knowledgeAreas).forEach(key => {
        analysisResult.knowledgeAreas[key as keyof KnowledgeAreas] = 
          Math.round(Number(analysisResult.knowledgeAreas[key as keyof KnowledgeAreas]) || 0);
      });

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