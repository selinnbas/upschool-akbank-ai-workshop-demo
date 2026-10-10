import React from 'react';
import { Sparkles, Compass, UserCheck, BookOpen, BookmarkCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'interview' | 'training' | 'saved';
  onTabChange: (tab: 'interview' | 'training' | 'saved') => void;
  onOpenPresets: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenPresets,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 backdrop-blur px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Kariyer & Mülakat Koçu
          </span>
          <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-normal">
            AI Interviewer & Roadmap Agent
          </span>
        </div>
      </div>

      {/* Zone 2: 3 clean single-line navigation links */}
      <nav className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => onTabChange('interview')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'interview'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Mülakat Simülatörü</span>
        </button>

        <button
          onClick={() => onTabChange('training')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'training'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Eğitim & Yol Haritası</span>
        </button>

        <button
          onClick={() => onTabChange('saved')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'saved'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>Kayıtlı Hazırlıklar</span>
          {savedCount > 0 && (
            <span className="text-[10px] font-mono bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded-full border border-slate-700">
              {savedCount}
            </span>
          )}
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenPresets}
          className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg transition-all shadow-sm whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Örnek Senaryo Seç</span>
          <span className="sm:hidden">Senaryolar</span>
        </button>
      </div>
    </header>
  );
};
