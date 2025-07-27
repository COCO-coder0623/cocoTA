export interface MacroNutrients {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface FoodEntry {
  id: string;
  description: string;
  macros: MacroNutrients;
  imageUrl: string;
  timestamp: Date;
}

export interface FoodAnalysisResult {
  description: string;
  macros: MacroNutrients;
}

export interface DailyGoals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}