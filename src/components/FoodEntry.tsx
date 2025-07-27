import React from 'react';
import { Calendar, Camera } from 'lucide-react';

interface MacroNutrients {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface FoodEntryProps {
  id: string;
  description: string;
  macros: MacroNutrients;
  imageUrl: string;
  timestamp: Date;
}

const FoodEntry: React.FC<FoodEntryProps> = ({ description, macros, imageUrl, timestamp }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={description}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm rounded-full p-2">
          <Camera className="w-4 h-4 text-white" />
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 leading-tight">{description}</h3>
          <div className="flex items-center text-gray-500 text-sm ml-3">
            <Calendar className="w-4 h-4 mr-1" />
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-emerald-600">{macros.calories}</div>
            <div className="text-sm text-emerald-700">Calories</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-blue-600">{macros.protein}g</div>
            <div className="text-sm text-blue-700">Protein</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-amber-600">{macros.fat}g</div>
            <div className="text-sm text-amber-700">Fat</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-purple-600">{macros.carbs}g</div>
            <div className="text-sm text-purple-700">Carbs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodEntry;