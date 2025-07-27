/*
  # Food Analysis Edge Function

  1. Purpose
    - Analyzes food images using OpenAI's GPT-4o Vision API
    - Returns structured nutritional information and food description
    
  2. Input
    - Base64 encoded image data
    
  3. Output
    - Food description sentence
    - Macro nutrients (calories, protein, fat, carbs)
*/

import { corsHeaders } from '../_shared/cors.ts';

interface AnalysisRequest {
  image: string; // base64 encoded image
}

interface MacroNutrients {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface AnalysisResponse {
  description: string;
  macros: MacroNutrients;
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const { image }: AnalysisRequest = await req.json();

    if (!image) {
      throw new Error('No image provided');
    }

    // Call OpenAI GPT-4o Vision API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
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
                  url: `data:image/jpeg;base64,${image}`
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
    let analysisResult: AnalysisResponse;
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

    return new Response(
      JSON.stringify(analysisResult),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Food analysis error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Analysis failed' 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});