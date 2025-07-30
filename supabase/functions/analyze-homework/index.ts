/*
  # Enhanced Homework Analysis Edge Function

  1. Purpose
    - Analyzes homework images using OpenAI's GPT-4.1 Vision API
    - Recognizes each individual question and answer
    - Determines correctness for each question
    - Provides detailed explanations for incorrect answers
    - Identifies weak knowledge areas
    
  2. Input
    - Base64 encoded image data
    
  3. Output
    - Detailed question-by-question analysis
    - Correctness assessment for each question
    - Explanations and correct solutions for wrong answers
    - Knowledge area weakness identification
*/

import { corsHeaders } from '../_shared/cors.ts';

console.log('Edge Function: Enhanced analyze-homework is starting...');

interface AnalysisRequest {
  image: string; // base64 encoded image
}

interface QuestionAnalysis {
  questionNumber: number;
  questionText: string;
  studentAnswer: string;
  isCorrect: boolean;
  correctAnswer?: string;
  explanation?: string;
  knowledgeArea: string;
  difficulty: 'easy' | 'medium' | 'hard';
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
  questions: QuestionAnalysis[];
  totalQuestions: number;
  correctQuestions: number;
  weakKnowledgeAreas: string[];
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

Deno.serve(async (req: Request) => {
  console.log(`Edge Function: Received ${req.method} request to ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Edge Function: Handling CORS preflight request');
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('Edge Function: Processing enhanced homework analysis request');
    
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const { image }: AnalysisRequest = await req.json();

    if (!image) {
      console.log('Edge Function: No image provided in request');
      throw new Error('No image provided');
    }

    console.log('Edge Function: Making request to OpenAI API for detailed analysis');
    // Call OpenAI GPT-4.1 Vision API
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
                text: `You are a professional elementary school math teacher. Please carefully analyze this math homework image and return ONLY a valid JSON object in the exact format below. Do not include any other text, markdown formatting, or explanations outside the JSON.

Required JSON format:
{
  "description": "Brief description of the homework in Chinese",
  "subject": "数学",
  "isCorrect": boolean (true if all answers are correct),
  "completeness": number (0-100, percentage of questions completed),
  "logicCoherence": number (0-100, overall logic score),
  "knowledgeAreas": {
    "arithmetic": number (0-100, mastery level),
    "geometry": number (0-100, mastery level),
    "fractions": number (0-100, mastery level),
    "wordProblems": number (0-100, mastery level),
    "measurement": number (0-100, mastery level)
  },
  "weakPoints": ["weak area 1 in Chinese", "weak area 2 in Chinese"],
  "strengths": ["strength 1 in Chinese", "strength 2 in Chinese"],
  "errorAnalysis": "Overall error analysis in Chinese",
  "solutionApproach": "Solution approach suggestions in Chinese",
  "questions": [
    {
      "questionNumber": number,
      "questionText": "Question text in Chinese",
      "studentAnswer": "Student's answer",
      "isCorrect": boolean,
      "correctAnswer": "Correct answer (if wrong)",
      "explanation": "Detailed explanation in Chinese (if wrong)",
      "knowledgeArea": "Knowledge area in Chinese",
      "difficulty": "easy" | "medium" | "hard"
    }
  ],
  "totalQuestions": number,
  "correctQuestions": number,
  "weakKnowledgeAreas": ["weak knowledge area 1", "weak knowledge area 2"]
}

Instructions:
1. Identify each question and student answer in the image
2. Determine correctness for each question
3. For incorrect answers, provide detailed explanations and correct solutions in Chinese
4. Analyze weak knowledge areas
5. All text content should be in Chinese
6. Return ONLY the JSON object, no additional text or formatting`
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
        max_tokens: 2000,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      console.log('Edge Function: OpenAI API error:', response.status, response.statusText);
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const openaiResult = await response.json();
    console.log('Edge Function: Received response from OpenAI');
    console.log('Edge Function: Full OpenAI response:', JSON.stringify(openaiResult, null, 2));
    const content = openaiResult.choices[0]?.message?.content;
    console.log('Edge Function: Extracted content:', content);

    if (!content) {
      console.log('Edge Function: No content in OpenAI response');
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
      
      console.log('Edge Function: Parsing enhanced analysis result');
      
      if (!cleanContent) {
        throw new Error('Empty content after cleaning');
      }
      
      analysisResult = JSON.parse(cleanContent);
      
      // Validate required fields
      if (!analysisResult.description || !analysisResult.subject) {
        throw new Error('Missing required fields in analysis result');
      }
      
    } catch (parseError) {
      console.log('Edge Function: JSON parsing error:', parseError);
      console.error('Failed to parse OpenAI response:', content);
      console.error('Parse error:', parseError);
      throw new Error('Invalid response format from AI analysis');
    }

    // Validate and ensure proper data types with defaults
    console.log('Edge Function: Validating and formatting enhanced response');
    analysisResult.completeness = Math.round(Number(analysisResult.completeness) || 0);
    analysisResult.logicCoherence = Math.round(Number(analysisResult.logicCoherence) || 0);
    analysisResult.isCorrect = Boolean(analysisResult.isCorrect);
    analysisResult.weakPoints = Array.isArray(analysisResult.weakPoints) ? analysisResult.weakPoints : [];
    analysisResult.strengths = Array.isArray(analysisResult.strengths) ? analysisResult.strengths : [];
    analysisResult.errorAnalysis = String(analysisResult.errorAnalysis || '');
    analysisResult.solutionApproach = String(analysisResult.solutionApproach || '');
    analysisResult.questions = Array.isArray(analysisResult.questions) ? analysisResult.questions : [];
    analysisResult.totalQuestions = Number(analysisResult.totalQuestions) || 0;
    analysisResult.correctQuestions = Number(analysisResult.correctQuestions) || 0;
    analysisResult.weakKnowledgeAreas = Array.isArray(analysisResult.weakKnowledgeAreas) ? analysisResult.weakKnowledgeAreas : [];
    
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

    // Validate questions array
    if (analysisResult.questions) {
      analysisResult.questions = analysisResult.questions.map(q => ({
        questionNumber: Number(q.questionNumber) || 0,
        questionText: String(q.questionText || ''),
        studentAnswer: String(q.studentAnswer || ''),
        isCorrect: Boolean(q.isCorrect),
        correctAnswer: q.correctAnswer ? String(q.correctAnswer) : undefined,
        explanation: q.explanation ? String(q.explanation) : undefined,
        knowledgeArea: String(q.knowledgeArea || ''),
        difficulty: q.difficulty || 'medium'
      }));
    }

    console.log('Edge Function: Returning successful enhanced response');
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
    console.error('Edge Function: Unexpected error:', error);
    console.error('Enhanced homework analysis error:', error);
    
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