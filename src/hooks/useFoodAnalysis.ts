import { useState } from 'react';

interface MacroNutrients {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface FoodAnalysisResult {
  description: string;
  macros: MacroNutrients;
}

export const useFoodAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeFood = async (imageFile: File): Promise<FoodAnalysisResult | null> => {
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

      // Call OpenAI API directly
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this food image and provide a response in the following JSON format:
{
  "description": "A single sentence describing the food items visible",
  "macros": {
    "calories": number,
    "protein": number,
    "fat": number,
    "carbs": number
  }
}

Please be as accurate as possible with the nutritional estimates based on typical serving sizes. Return only the JSON object, no additional text.`
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
          max_tokens: 300,
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
      let analysisResult: FoodAnalysisResult;
      try {
        analysisResult = JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', content);
        throw new Error('Invalid response format from AI analysis');
      }

      // Validate the response structure
      if (!analysisResult.description || !analysisResult.macros) {
        throw new Error('Incomplete analysis result');
      }

      // Ensure numeric values
      analysisResult.macros = {
        calories: Math.round(Number(analysisResult.macros.calories) || 0),
        protein: Math.round(Number(analysisResult.macros.protein) || 0),
        fat: Math.round(Number(analysisResult.macros.fat) || 0),
        carbs: Math.round(Number(analysisResult.macros.carbs) || 0),
      };

      return analysisResult;

    } catch (err) {
      console.error('Food analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analyzeFood, isAnalyzing, error };
};