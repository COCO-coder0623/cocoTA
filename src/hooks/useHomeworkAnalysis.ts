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

      // Call OpenAI API for homework analysis
      let response;
      try {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
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
  "strengths": ["array of areas where student performed well"],
  "errorAnalysis": "detailed analysis of errors if answer is incorrect, empty string if correct",
  "solutionApproach": "step-by-step solution method if answer is incorrect, empty string if correct"
}

CRITICAL ANALYSIS REQUIREMENTS:
1. CORRECTNESS ASSESSMENT: Carefully examine each mathematical answer and solution step. Mark as correct ONLY if all answers and methods are mathematically accurate.

2. ERROR ANALYSIS (if incorrect): Provide detailed analysis including:
   - Identify specific calculation errors or conceptual mistakes
   - Explain why the student's approach was wrong
   - Point out any missing steps or logical gaps
   - Highlight misconceptions that led to the error

3. SOLUTION APPROACH (if incorrect): Provide clear, step-by-step solution:
   - Break down the problem into manageable steps
   - Show the correct mathematical operations
   - Explain the reasoning behind each step
   - Provide the correct final answer
   - Use simple language appropriate for primary school students

4. ASSESSMENT CRITERIA:
   - Rate completeness based on how much of the problem was attempted
   - Rate logic coherence based on the mathematical reasoning shown
   - Identify demonstrated knowledge areas and rate proficiency (0-100)
   - List specific strengths (what the student did well)
   - List specific weak points (areas needing improvement)

Be thorough in your analysis - this feedback will help the student learn from their mistakes and improve their mathematical understanding.

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
      } catch (fetchError) {
        console.error('Network error:', fetchError);
        throw new Error('Network error: Unable to connect to OpenAI API. This may be due to CORS restrictions when calling external APIs directly from the browser. Consider using a backend proxy or edge function.');
      }

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
        // Remove markdown code block delimiters if present
        let cleanContent = content.trim();
        if (cleanContent.startsWith('```json') && cleanContent.endsWith('```')) {
          cleanContent = cleanContent.slice(7, -3).trim(); // Remove ```json from start and ``` from end
        } else if (cleanContent.startsWith('```') && cleanContent.endsWith('```')) {
          cleanContent = cleanContent.slice(3, -3).trim(); // Remove ``` from both ends
        }
        
        analysisResult = JSON.parse(cleanContent);
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