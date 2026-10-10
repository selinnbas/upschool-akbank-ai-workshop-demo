import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  Play,
  Filter,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Briefcase,
  Building2,
  Download,
  Share2,
  RefreshCw,
  Search,
} from 'lucide-react';
import {
  InterviewQuestion,
  InterviewerPersona,
  QuestionCategory,
} from '../types/coach';
import {
  COMMON_INTERVIEWER_TITLES,
  CANDIDATE_LEVELS,
  INDUSTRIES,
} from '../data/presets';
import { MockSimulatorModal } from './MockSimulatorModal';

interface InterviewCoachViewProps {
  interviewerTitle: string;
  setInterviewerTitle: (title: string) => void;
  targetRole: string;
  setTargetRole: (role: string) => void;
  candidateLevel: string;
  setCandidateLevel: (level: string) => void;
  industry: string;
  setIndustry: (ind: string) => void;
  companyContext: string;
  setCompanyContext: (ctx: string) => void;
  persona: InterviewerPersona | null;
  setPersona: (p: InterviewerPersona | null) => void;
  questions: InterviewQuestion[];
  setQuestions: (q: InterviewQuestion[]) => void;
}

export const InterviewCoachView: React.FC<InterviewCoachViewProps> = ({
  interviewerTitle,
  setInterviewerTitle,
  targetRole,
  setTargetRole,
  candidateLevel,
  setCandidateLevel,
  industry,
  setIndustry,
  companyContext,
  setCompanyContext,
  persona,
  setPersona,
  questions,
  setQuestions,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePracticeQuestion, setActivePracticeQuestion] = useState<InterviewQuestion | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!interviewerTitle.trim()) {
      setError('Lütfen mülakatçının unvanını belirtiniz.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/coach/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewerTitle,
          targetRole,
          candidateLevel,
          industry,
          companyContext,
        }),
      });

      if (!res.ok) {
        throw new Error('Sorular üretilemedi.');
      }

      const data = await res.json();
      setPersona(data.interviewerPersona);
      setQuestions(data.questions || []);
    } catch (err: any) {
      console.error('Question generation failed:', err);
      setError('Mülakat soruları hazırlanırken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.whyAsked.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleExportMarkdown = () => {
    if (!persona || questions.length === 0) return;

    let content = `# Mülakat Hazırlık Rehberi: ${interviewerTitle}\n\n`;
    content += `**Hedef Rol:** ${targetRole} (${candidateLevel})\n`;
    content += `**Sektör:** ${industry} - ${companyContext}\n\n`;

    content += `## Mülakatçı Personası & Değerlendirme Zihniyeti\n`;
    content += `- **Odak Alanı:** ${persona.coreFocus}\n`;
    content += `- **Zihin Yapısı:** ${persona.evaluationMindset}\n\n`;

    content += `### Yeni Mezun / Junior Adaylar İçin Özel Tavsiye\n`;
    content += `${persona.newGradAdvice}\n\n`;

    content += `### Yeşil Bayraklar (Aranan Nitelikler)\n`;
    persona.topGreenFlags.forEach((gf) => (content += `- ${gf}\n`));
    content += `\n### Kırmızı Bayraklar (Kaçınılması Gerekenler)\n`;
    persona.topRedFlags.forEach((rf) => (content += `- ${rf}\n`));

    content += `\n## Beklenen Mülakat Soruları ve Yanıt Stratejileri\n\n`;
    questions.forEach((q, i) => {
      content += `### ${i + 1}. ${q.question} (${q.category.toUpperCase()} - ${q.difficulty})\n`;
      content += `- **Neden Sorulur?** ${q.whyAsked}\n`;
      content += `- **Önerilen Çerçeve:** ${q.suggestedFramework}\n`;
      content += `- **Beklenen Sinyaller:** ${q.idealSignals.join(', ')}\n`;
      content += `- **Sık Yapılan Hatalar:** ${q.commonMistakes.join(', ')}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mulakat-hazirlik-${interviewerTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Search / Config Card */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-7 shadow-sm">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Mülakatçı Unvanına Özel Soru & Simülasyon Koçu
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Katılacağınız mülakattaki değerlendiricinin unvanını girin; zihniyetini, aradığı sinyalleri ve soracağı soruları anında keşfedin.
              </p>
            </div>

            {candidateLevel.includes('Yeni Mezun') && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-300 bg-indigo-950/60 border border-indigo-800/50 px-3 py-1.5 rounded-lg">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Yeni Mezun Modu Aktif</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Interviewer Title */}
            <div className="space-y-2 lg:col-span-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                <span>Mülakat Yapacak Kişinin Unvanı (Interviewer Title) *</span>
              </label>
              <input
                type="text"
                value={interviewerTitle}
                onChange={(e) => setInterviewerTitle(e.target.value)}
                placeholder="Örn: Senior Software Engineering Lead, Head of HR, Principal Architect, CTO..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />

              {/* Quick suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 mr-1">Önerilen unvanlar:</span>
                {COMMON_INTERVIEWER_TITLES.slice(0, 4).map((title) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => setInterviewerTitle(title)}
                    className="text-[11px] text-slate-400 hover:text-white bg-slate-800/70 hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60 transition-colors"
                  >
                    {title.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Role */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Başvurduğunuz Pozisyon / Hedef Rol</span>
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Örn: Junior Frontend Developer, Product Manager"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>

            {/* Candidate Level */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Aday Deneyim Seviyesi
              </label>
              <select
                value={candidateLevel}
                onChange={(e) => setCandidateLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              >
                {CANDIDATE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Sektör Alanı
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* Company Context */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Şirket Yapısı / Ortamı
              </label>
              <input
                type="text"
                value={companyContext}
                onChange={(e) => setCompanyContext(e.target.value)}
                placeholder="Örn: Hızlı Büyüyen Scaleup, Kurumsal Banka, Global Remote"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-lg text-xs text-rose-300">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Yapay zeka, mülakatçının bakış açısıyla soruları ve değerlendirme kriterlerini sentezler.
            </span>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-sm ml-auto"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sorular ve Persona Çıkarılıyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Soruları ve Personayı Üret</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Persona Analysis Card (if generated) */}
      {persona && (
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-7 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
                <span>Mülakatçı Personası</span>
                <span aria-hidden="true">·</span>
                <span>{persona.seniorityLevel}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                {persona.title} Karşısında Nasıl Bir Strateji İzlenmeli?
              </h2>
            </div>

            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Rehberi İndir (.md)</span>
            </button>
          </div>

          {/* Key Mindset & Focus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-xs font-semibold text-indigo-400">Temel Değerlendirme Odağı</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {persona.coreFocus}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-xs font-semibold text-indigo-400">Mülakatçının Zihniyeti</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {persona.evaluationMindset}
              </p>
            </div>
          </div>

          {/* Specialized Advice for New Graduates / Juniors */}
          {persona.newGradAdvice && (
            <div className="p-4 sm:p-5 rounded-xl bg-indigo-950/30 border border-indigo-900/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Üniversiteden Yeni Mezun ve Junior Adaylar İçin Altın Taktik</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {persona.newGradAdvice}
              </p>
            </div>
          )}

          {/* Green Flags & Red Flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Yeşil Bayraklar (Bu unvanın aradığı sinyaller)</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {persona.topGreenFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Kırmızı Bayraklar (Kesinlikle kaçınılması gerekenler)</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {persona.topRedFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Questions Section */}
      {questions.length > 0 && (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {interviewerTitle} Tarafından Sorulabilecek Potansiyel Sorular
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {filteredQuestions.length} soru listeleniyor. Herhangi bir soruda "Simülasyonda Pratik Yap" butonuna tıklayarak canlı koçluk alabilirsiniz.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
              {[
                { id: 'all', label: 'Tümü' },
                { id: 'technical', label: 'Teknik' },
                { id: 'behavioral', label: 'Davranışsal' },
                { id: 'culture', label: 'Kültür & Uyum' },
                { id: 'strategic', label: 'Stratejik' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    selectedCategory === tab.id
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Sorular arasında anahtar kelime ara..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Questions Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 transition-all shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono text-indigo-400 font-semibold">#{idx + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{q.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400">Zorluk: {q.difficulty}</span>
                    {q.suggestedFramework && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-indigo-300 font-medium">{q.suggestedFramework}</span>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setActivePracticeQuestion(q)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Simülasyonda Pratik Yap</span>
                  </button>
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  "{q.question}"
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <strong className="text-slate-300 block">Bu Unvan Neden Sorar?</strong>
                    <p className="text-slate-400 leading-relaxed">{q.whyAsked}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <strong className="text-emerald-400 block">Beklenen Kilit Sinyaller:</strong>
                    <ul className="text-slate-300 space-y-0.5">
                      {q.idealSignals.map((sig, sidx) => (
                        <li key={sidx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400">·</span>
                          <span>{sig}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {q.commonMistakes && q.commonMistakes.length > 0 && (
                  <div className="text-[11px] text-amber-300/90 bg-amber-950/30 border border-amber-900/30 px-3 py-2 rounded-lg flex items-start gap-2">
                    <span className="font-semibold text-amber-400 shrink-0">⚠️ Sık Yapılan Hata:</span>
                    <span>{q.commonMistakes.join(' | ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Practice Simulator Modal */}
      <MockSimulatorModal
        question={activePracticeQuestion}
        interviewerTitle={interviewerTitle}
        targetRole={targetRole}
        candidateLevel={candidateLevel}
        isOpen={!!activePracticeQuestion}
        onClose={() => setActivePracticeQuestion(null)}
      />
    </div>
  );
};
