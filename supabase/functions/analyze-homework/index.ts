/*
  # Homework Analysis Edge Function

  1. Purpose
    - Analyzes homework images using OpenAI's GPT-4o Vision API
    - Returns structured educational assessment information
    
  2. Input
    - Base64 encoded image data
    
  3. Output
    - Detailed homework analysis with correctness assessment
    - Error analysis and solution approach for incorrect answers
*/

import { corsHeaders } from '../_shared/cors.ts';

interface AnalysisRequest {
  image: string; // base64 encoded image
}

interface KnowledgeAreas {
  arithmetic: number;
  geometry: number;
  fractions: number;
  wordProblems: number;
  measurement: number;
}

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
                  url: `data:image/jpeg;base64,${image}`
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

    // Parse the JSON response with better error handling
    let analysisResult: HomeworkAnalysisResult;
    try {
      // Remove markdown code block delimiters if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json') && cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(7, -3).trim();
      } else if (cleanContent.startsWith('```') && cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(3, -3).trim();
      }
      
      if (!cleanContent) {
        throw new Error('Empty content after cleaning');
      }
      
      analysisResult = JSON.parse(cleanContent);
      
      // Validate required fields
      if (!analysisResult.description || !analysisResult.subject) {
        throw new Error('Missing required fields in analysis result');
      }
      
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      console.error('Parse error:', parseError);
      throw new Error('Invalid response format from AI analysis');
    }

    // Validate and ensure proper data types with defaults
    analysisResult.completeness = Math.round(Number(analysisResult.completeness) || 0);
    analysisResult.logicCoherence = Math.round(Number(analysisResult.logicCoherence) || 0);
    analysisResult.isCorrect = Boolean(analysisResult.isCorrect);
    analysisResult.weakPoints = Array.isArray(analysisResult.weakPoints) ? analysisResult.weakPoints : [];
    analysisResult.strengths = Array.isArray(analysisResult.strengths) ? analysisResult.strengths : [];
    analysisResult.errorAnalysis = String(analysisResult.errorAnalysis || '');
    analysisResult.solutionApproach = String(analysisResult.solutionApproach || '');
    
    // Ensure knowledge areas are properly formatted with defaults
    const defaultKnowledgeAreas: KnowledgeAreas = {
      arithmetic: 0,
      geometry: 0,
      fractions: 0,
      wordProblems: 0,
      measurement: 0
    };
    
    analysisResult.knowledgeAreas = analysisResult.knowledgeAreas || defaultKnowledgeAreas;
    Object.keys(defaultKnowledgeAreas).forEach(key => {
      const typedKey = key as keyof KnowledgeAreas;
      analysisResult.knowledgeAreas[typedKey] = 
        Math.round(Number(analysisResult.knowledgeAreas[typedKey]) || 0);
    });

    return new Response(
      JSON.stringify(analysisResult),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Homework analysis error:', error);
    
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