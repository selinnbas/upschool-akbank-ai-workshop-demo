import React from 'react';
import { BookmarkCheck, Trash2, ArrowRight, Download, Calendar, Briefcase, BookOpen } from 'lucide-react';
import { InterviewerPersona, InterviewQuestion, CompletedTraining, TrainingAnalysisResult } from '../types/coach';

export interface SavedSession {
  id: string;
  date: string;
  title: string;
  interviewerTitle: string;
  targetRole: string;
  candidateLevel: string;
  persona: InterviewerPersona | null;
  questions: InterviewQuestion[];
  completedTrainings: CompletedTraining[];
  analysisResult: TrainingAnalysisResult | null;
}

interface SavedSessionsViewProps {
  sessions: SavedSession[];
  onLoadSession: (session: SavedSession) => void;
  onDeleteSession: (id: string) => void;
  onExportAll: () => void;
}

export const SavedSessionsView: React.FC<SavedSessionsViewProps> = ({
  sessions,
  onLoadSession,
  onDeleteSession,
  onExportAll,
}) => {
  return (
    <div className="space-y-6">
      <div className="p-5 sm:p-7 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Kayıtlı Hazırlıklarım ve Kariyer Profillerim
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Daha önce oluşturduğunuz mülakat sorularını ve eğitim yol haritalarını inceleyin veya geri yükleyin.
          </p>
        </div>

        {sessions.length > 0 && (
          <button
            onClick={onExportAll}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tüm Verileri Dışa Aktar (.json)</span>
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <BookmarkCheck className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">Henüz Kayıtlı Hazırlık Bulunmuyor</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Mülakat simülatöründe soru ürettiğinizde veya eğitim analizi yaptığınızda profiliniz otomatik olarak buraya kaydedilecektir.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 space-y-4 transition-all shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{session.date}</span>
                  </span>
                  <button
                    onClick={() => onDeleteSession(session.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-white">
                  {session.title || `${session.targetRole} (${session.interviewerTitle})`}
                </h3>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1 text-indigo-400">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Mülakatçı: {session.interviewerTitle}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400">{session.candidateLevel}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                  <span>{session.questions.length} Soru Hazır</span>
                  <span aria-hidden="true">·</span>
                  <span>{session.completedTrainings.length} Eğitim Kayıtlı</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => onLoadSession(session)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <span>Bu Profili Yükle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
