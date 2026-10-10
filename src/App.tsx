import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InterviewCoachView } from './components/InterviewCoachView';
import { TrainingRoadmapView } from './components/TrainingRoadmapView';
import { SavedSessionsView, SavedSession } from './components/SavedSessionsView';
import { PresetModal } from './components/PresetModal';
import { PRESET_SCENARIOS } from './data/presets';
import {
  InterviewQuestion,
  InterviewerPersona,
  CompletedTraining,
  TrainingAnalysisResult,
  PresetScenario,
} from './types/coach';

export default function App() {
  const [activeTab, setActiveTab] = useState<'interview' | 'training' | 'saved'>('interview');
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);

  // Interview state
  const [interviewerTitle, setInterviewerTitle] = useState(
    'Kıdemli Yazılım Ekip Lideri (Senior Engineering Lead)'
  );
  const [targetRole, setTargetRole] = useState('Junior Fullstack / Frontend Developer');
  const [candidateLevel, setCandidateLevel] = useState('Yeni Mezun (0-1 Yıl Deneyim)');
  const [industry, setIndustry] = useState('Teknoloji & SaaS');
  const [companyContext, setCompanyContext] = useState('Modern Çevik Yazılım Ekibi');
  const [persona, setPersona] = useState<InterviewerPersona | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);

  // Training & roadmap state
  const [completedTrainings, setCompletedTrainings] = useState<CompletedTraining[]>(
    PRESET_SCENARIOS[0].sampleTrainings
  );
  const [targetCareerGoal, setTargetCareerGoal] = useState('Production-Ready Fullstack Mühendisi');
  const [currentLevel, setCurrentLevel] = useState('Üniversiteden Yeni Mezun');
  const [analysisResult, setAnalysisResult] = useState<TrainingAnalysisResult | null>(null);

  // Saved sessions state
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('career_coach_sessions');
      if (stored) {
        setSavedSessions(JSON.parse(stored));
      }
    } catch (e) {
      console.error('LocalStorage read error:', e);
    }
  }, []);

  // Sync to LocalStorage when session is added
  const saveCurrentSession = () => {
    const newSession: SavedSession = {
      id: `session_${Date.now()}`,
      date: new Date().toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      title: `${targetRole} · ${interviewerTitle}`,
      interviewerTitle,
      targetRole,
      candidateLevel,
      persona,
      questions,
      completedTrainings,
      analysisResult,
    };

    const updated = [newSession, ...savedSessions.filter((s) => s.title !== newSession.title)];
    setSavedSessions(updated);
    try {
      localStorage.setItem('career_coach_sessions', JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }
  };

  // Automatically save if questions or analysis exists
  useEffect(() => {
    if (questions.length > 0 || analysisResult) {
      saveCurrentSession();
    }
  }, [questions, analysisResult]);

  const handleSelectPreset = (preset: PresetScenario) => {
    setInterviewerTitle(preset.interviewerTitle);
    setTargetRole(preset.targetRole);
    setCandidateLevel(preset.candidateLevel);
    setIndustry(preset.industry);
    setCompanyContext(preset.companyContext);
    setTargetCareerGoal(preset.targetCareerGoal);
    setCompletedTrainings(preset.sampleTrainings);
    setPersona(null);
    setQuestions([]);
    setAnalysisResult(null);
  };

  const handleLoadSession = (session: SavedSession) => {
    setInterviewerTitle(session.interviewerTitle);
    setTargetRole(session.targetRole);
    setCandidateLevel(session.candidateLevel);
    setPersona(session.persona);
    setQuestions(session.questions);
    setCompletedTrainings(session.completedTrainings);
    setAnalysisResult(session.analysisResult);
    setActiveTab('interview');
  };

  const handleDeleteSession = (id: string) => {
    const filtered = savedSessions.filter((s) => s.id !== id);
    setSavedSessions(filtered);
    try {
      localStorage.setItem('career_coach_sessions', JSON.stringify(filtered));
    } catch (e) {
      console.error('LocalStorage delete error:', e);
    }
  };

  const handleExportAll = () => {
    const dataStr = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        currentProfile: {
          interviewerTitle,
          targetRole,
          candidateLevel,
          industry,
          companyContext,
          persona,
          questions,
          completedTrainings,
          analysisResult,
        },
        savedSessions,
      },
      null,
      2
    );

    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kariyer-kocu-yedek-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenPresets={() => setIsPresetModalOpen(true)}
        savedCount={savedSessions.length}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'interview' && (
          <InterviewCoachView
            interviewerTitle={interviewerTitle}
            setInterviewerTitle={setInterviewerTitle}
            targetRole={targetRole}
            setTargetRole={setTargetRole}
            candidateLevel={candidateLevel}
            setCandidateLevel={setCandidateLevel}
            industry={industry}
            setIndustry={setIndustry}
            companyContext={companyContext}
            setCompanyContext={setCompanyContext}
            persona={persona}
            setPersona={setPersona}
            questions={questions}
            setQuestions={setQuestions}
          />
        )}

        {activeTab === 'training' && (
          <TrainingRoadmapView
            completedTrainings={completedTrainings}
            setCompletedTrainings={setCompletedTrainings}
            targetCareerGoal={targetCareerGoal}
            setTargetCareerGoal={setTargetCareerGoal}
            currentLevel={currentLevel}
            setCurrentLevel={setCurrentLevel}
            analysisResult={analysisResult}
            setAnalysisResult={setAnalysisResult}
          />
        )}

        {activeTab === 'saved' && (
          <SavedSessionsView
            sessions={savedSessions}
            onLoadSession={handleLoadSession}
            onDeleteSession={handleDeleteSession}
            onExportAll={handleExportAll}
          />
        )}
      </main>

      {/* Preset Modal */}
      <PresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 sm:px-8 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Kariyer & Mülakat Koçu · Gemini 3.8 Flash Destekli Akıllı Değerlendirme</p>
          <p className="text-slate-400">
            Mülakatçı Unvanı Analizi · Canlı STAR Simülasyonu · Müfredat & Eğitim Yol Haritası
          </p>
        </div>
      </footer>
    </div>
  );
}
