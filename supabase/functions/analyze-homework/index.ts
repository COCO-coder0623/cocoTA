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
                text: `作为一个专业的小学数学老师，请仔细分析这张数学作业图片，识别每一道题目并判断答案的正误。请按照以下JSON格式返回详细分析：

{
  "description": "作业内容的简要描述",
  "subject": "Mathematics",
  "isCorrect": boolean (整体作业是否全部正确),
  "completeness": number (0-100, 作业完成度),
  "logicCoherence": number (0-100, 逻辑连贯性),
  "knowledgeAreas": {
    "arithmetic": number (0-100, 算术能力),
    "geometry": number (0-100, 几何能力),
    "fractions": number (0-100, 分数能力),
    "wordProblems": number (0-100, 应用题能力),
    "measurement": number (0-100, 测量能力)
  },
  "weakPoints": ["具体的薄弱环节"],
  "strengths": ["学生的优势表现"],
  "errorAnalysis": "错误题目的总体分析",
  "solutionApproach": "改进建议和学习方法",
  "questions": [
    {
      "questionNumber": 1,
      "questionText": "题目内容",
      "studentAnswer": "学生的答案",
      "isCorrect": boolean,
      "correctAnswer": "正确答案（如果学生答错）",
      "explanation": "详细解释（特别是错误题目的解题步骤）",
      "knowledgeArea": "涉及的知识点",
      "difficulty": "easy/medium/hard"
    }
  ],
  "totalQuestions": number,
  "correctQuestions": number,
  "weakKnowledgeAreas": ["需要加强的知识领域"]
}

分析要求：
1. 仔细识别图片中的每一道题目和学生答案
2. 准确判断每道题的正误
3. 对于错误的题目，提供详细的解题步骤和正确答案
4. 分析学生在哪些知识点上存在薄弱环节
5. 给出具体的学习建议
6. 使用中文进行解释和建议

请只返回JSON格式的结果，不要包含其他文字。`
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
    const content = openaiResult.choices[0]?.message?.content;

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