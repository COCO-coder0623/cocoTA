import { MacroNutrients } from '../types/food';

export const calculateTotalMacros = (entries: { macros: MacroNutrients }[]): MacroNutrients => {
  return entries.reduce(
    (total, entry) => ({
      calories: total.calories + entry.macros.calories,
      protein: total.protein + entry.macros.protein,
      fat: total.fat + entry.macros.fat,
      carbs: total.carbs + entry.macros.carbs,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );
};

export const formatMacroValue = (value: number, unit: string = 'g'): string => {
  return `${Math.round(value)}${unit}`;
};