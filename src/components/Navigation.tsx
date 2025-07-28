import React from 'react';
import { BookOpen, Target, Calendar } from 'lucide-react';

type TabType = 'assessment' | 'goals' | 'calendar';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'assessment' as TabType, label: 'Assessment', icon: BookOpen },
    { id: 'goals' as TabType, label: 'Goals', icon: Target },
    { id: 'calendar' as TabType, label: 'Calendar', icon: Calendar },
  ];

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
            activeTab === id
              ? id === 'assessment' 
                ? 'bg-white text-blue-600 shadow-sm'
                : id === 'goals'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
};

export default Navigation;