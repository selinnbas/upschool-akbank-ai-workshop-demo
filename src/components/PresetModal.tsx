import React from 'react';
import { X, Sparkles, GraduationCap, Code, Database, Layers, ArrowRight } from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/presets';
import { PresetScenario } from '../types/coach';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PresetScenario) => void;
}

export const PresetModal: React.FC<PresetModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  const getIcon = (id: string) => {
    switch (id) {
      case 'new-grad-developer':
        return <GraduationCap className="w-5 h-5 text-indigo-400" />;
      case 'new-grad-data':
        return <Database className="w-5 h-5 text-emerald-400" />;
      case 'product-manager-transition':
        return <Layers className="w-5 h-5 text-amber-400" />;
      case 'backend-to-devops':
        return <Code className="w-5 h-5 text-blue-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-white">Hazır Kariyer & Mülakat Senaryoları</h2>
            <p className="text-xs text-slate-400 mt-1">
              Tek tıkla gerçekçi mülakatçı unvanı ve eğitim geçmişi yükleyerek anında test edin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3 max-h-[65vh] overflow-y-auto pr-1">
          {PRESET_SCENARIOS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
              className="group p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 rounded-xl cursor-pointer transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/60 shrink-0 mt-0.5">
                    {getIcon(preset.id)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                        {preset.name}
                      </h3>
                      {preset.id.startsWith('new-grad') && (
                        <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                          Yeni Mezun Odaklı
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {preset.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-[11px] text-slate-400">
                      <span>Mülakatçı: <strong className="text-slate-200 font-medium">{preset.interviewerTitle}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Rol: <strong className="text-slate-200 font-medium">{preset.targetRole}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Eğitim: <strong className="text-slate-200 font-medium">{preset.sampleTrainings.length} kurs yüklü</strong></span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
