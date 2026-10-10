import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Code,
  Layers,
  Award,
  Download,
  RefreshCw,
  FolderGit2,
  Clock,
  Compass,
  FileText,
} from 'lucide-react';
import {
  CompletedTraining,
  TrainingAnalysisResult,
} from '../types/coach';

interface TrainingRoadmapViewProps {
  completedTrainings: CompletedTraining[];
  setCompletedTrainings: React.Dispatch<React.SetStateAction<CompletedTraining[]>>;
  targetCareerGoal: string;
  setTargetCareerGoal: (goal: string) => void;
  currentLevel: string;
  setCurrentLevel: (lvl: string) => void;
  analysisResult: TrainingAnalysisResult | null;
  setAnalysisResult: (res: TrainingAnalysisResult | null) => void;
}

export const TrainingRoadmapView: React.FC<TrainingRoadmapViewProps> = ({
  completedTrainings,
  setCompletedTrainings,
  targetCareerGoal,
  setTargetCareerGoal,
  currentLevel,
  setCurrentLevel,
  analysisResult,
  setAnalysisResult,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New course form state
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newYear, setNewYear] = useState('2026');

  // Bulk paste modal state
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      setError('Lütfen eğitim başlığını ve işlenen içerik özetini giriniz.');
      return;
    }

    const course: CompletedTraining = {
      id: `course_${Date.now()}`,
      title: newTitle.trim(),
      platform: newPlatform.trim() || 'Online Platform / Üniversite',
      contentSummary: newContent.trim(),
      completedYear: newYear.trim(),
    };

    setCompletedTrainings([...completedTrainings, course]);
    setNewTitle('');
    setNewPlatform('');
    setNewContent('');
    setError(null);
  };

  const handleRemoveCourse = (id: string) => {
    setCompletedTrainings(completedTrainings.filter((c) => c.id !== id));
  };

  const handleBulkImport = () => {
    if (!bulkText.trim()) return;

    // Split paragraphs or bullet points
    const lines = bulkText.split('\n\n').filter((p) => p.trim().length > 0);
    const parsedCourses: CompletedTraining[] = lines.map((block, i) => {
      const firstLine = block.split('\n')[0].replace(/^[•\-\d\.]\s*/, '').trim();
      const rest = block.split('\n').slice(1).join(' ').trim() || block;
      return {
        id: `bulk_${Date.now()}_${i}`,
        title: firstLine || `Tamamlanan Eğitim ${i + 1}`,
        platform: 'İçe Aktarılan Müfredat',
        contentSummary: rest,
        completedYear: '2026',
      };
    });

    setCompletedTrainings([...completedTrainings, ...parsedCourses]);
    setBulkText('');
    setBulkMode(false);
  };

  const handleAnalyze = async () => {
    if (completedTrainings.length === 0) {
      setError('Lütfen analiz için en az bir tamamlanan eğitim ekleyiniz.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/coach/analyze-trainings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedTrainings,
          targetCareerGoal,
          currentLevel,
        }),
      });

      if (!res.ok) {
        throw new Error('Eğitim analizi yapılamadı.');
      }

      const data = await res.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error('Training analysis failed:', err);
      setError('Eğitimler analiz edilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportRoadmap = () => {
    if (!analysisResult) return;

    let content = `# Kişisel Kariyer Gelişim & Eğitim Yol Haritası\n\n`;
    content += `**Hedef Pozisyon:** ${targetCareerGoal}\n`;
    content += `**Mevcut Seviye:** ${currentLevel}\n\n`;

    content += `## 1. Mevcut Yetkinlik Envanteri\n`;
    content += `${analysisResult.extractedSkillInventory.overallCompetencyAssessment}\n\n`;
    content += `### Temel Teknik Beceriler:\n`;
    analysisResult.extractedSkillInventory.coreTechnical.forEach((s) => (content += `- ${s}\n`));
    content += `\n### Metodoloji & Araçlar:\n`;
    analysisResult.extractedSkillInventory.methodologyAndTools.forEach((s) => (content += `- ${s}\n`));

    content += `\n## 2. Kritik Beceri Açığı Analizi (Skill Gap Analysis)\n`;
    content += `### Kritik Eksikler (Must-Have):\n`;
    analysisResult.gapAnalysis.criticalGaps.forEach((g) => (content += `- ${g}\n`));
    content += `\n### Fark Yaratan İkincil Beceriler:\n`;
    analysisResult.gapAnalysis.secondaryGaps.forEach((g) => (content += `- ${g}\n`));
    content += `\n**2026 Sektör Standartları:** ${analysisResult.gapAnalysis.marketExpectations}\n\n`;

    content += `## 3. Sıralı Eğitim Yol Haritası (Sonraki Adımlar)\n\n`;
    analysisResult.stepByStepRoadmap.forEach((step) => {
      content += `### Adım ${step.stepNumber}: ${step.title} (${step.priority} Öncelik - ${step.estimatedDuration})\n`;
      content += `- **Neden Şimdi?** ${step.whyThisNext}\n`;
      content += `- **Format / Sertifika:** ${step.recommendedFormat}\n`;
      content += `- **Öğrenilecek Konular:**\n`;
      step.suggestedTopics.forEach((t) => (content += `  * ${t}\n`));
      content += `- **Capstone Proje Fikri:** ${step.capstoneProject.title}\n`;
      content += `  ${step.capstoneProject.description}\n`;
      content += `  *GitHub İpucu:* ${step.capstoneProject.githubShowcaseTip}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kariyer-egitim-yol-haritasi-${targetCareerGoal.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Intro & Goal Card */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Eğitim İçerik Analizi & Sonraki Adım Eğitim Rehberi
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Tamamladığınız kurs ve eğitimlerin içeriklerini girin; yapay zeka beceri envanterinizi çıkarsın ve bir sonraki adımda tam olarak hangi eğitimi almanız gerektiğini sıralasın.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setBulkMode(!bulkMode)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{bulkMode ? 'Tekli Girişe Dön' : 'Toplu Metin Yapıştır'}</span>
            </button>
          </div>
        </div>

        {/* Goal and Level inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Ulaşmak İstediğiniz Hedef Pozisyon / Unvan
            </label>
            <input
              type="text"
              value={targetCareerGoal}
              onChange={(e) => setTargetCareerGoal(e.target.value)}
              placeholder="Örn: Senior Fullstack Developer, AI/ML Engineer, Associate Product Manager"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Şu Anki Deneyim Seviyeniz
            </label>
            <input
              type="text"
              value={currentLevel}
              onChange={(e) => setCurrentLevel(e.target.value)}
              placeholder="Örn: Üniversiteden Yeni Mezun, 1 Yıllık Junior Geliştirici"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Bulk Paste Area */}
        {bulkMode ? (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Tamamladığınız Eğitimleri Paragraflar Halinde Yapıştırın:
              </label>
              <span className="text-[11px] text-slate-500">
                Her eğitim arasına çift satır boşluk bırakın.
              </span>
            </div>
            <textarea
              rows={5}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="Örnek:
1. React 19 ve Modern Web Geliştirme Bootcamp
İçerik: Bileşen yaşam döngüsü, hooks, context API, state yönetimi, Tailwind ve REST entegrasyonu.

2. PostgreSQL ve İleri SQL Eğitimi
İçerik: İlişkisel şemalar, indeksleme, alt sorgular, JOIN tipleri ve veri modelleme."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setBulkMode(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleBulkImport}
                className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
              >
                Listeye Ekle
              </button>
            </div>
          </div>
        ) : (
          /* Add Single Course Form */
          <form onSubmit={handleAddCourse} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-indigo-400" />
                <span>Yeni Tamamlanan Eğitim Ekle</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Eğitim / Kurs Başlığı (Örn: React 19 & TypeScript Bootcamp)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  placeholder="Platform / Kurum (Örn: Coursera, Üniversite)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <textarea
                rows={2}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Eğitimin İçeriği ve İşlenen Konular (Örn: Hooks, TypeScript tip güvenliği, REST API mimarisi, JWT kimlik doğrulama, responsive UI pratikleri...)"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-medium rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Eğitimi Listeye Ekle</span>
              </button>
            </div>
          </form>
        )}

        {/* Existing Courses List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Mevcut Tamamlanan Eğitimleriniz ({completedTrainings.length})</span>
            {completedTrainings.length === 0 && (
              <span className="text-amber-400 font-normal text-[11px]">
                Henüz eğitim eklenmedi. Üstteki formdan ekleyebilir veya sağ üstten hazır senaryo seçebilirsiniz.
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {completedTrainings.map((course) => (
              <div
                key={course.id}
                className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">{course.title}</h4>
                    {course.platform && (
                      <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {course.platform}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 line-clamp-2 text-[11px] leading-relaxed">
                    {course.contentSummary}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveCourse(course.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 opacity-60 group-hover:opacity-100 transition-opacity"
                  title="Eğitimi kaldır"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-lg text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Trigger Analysis Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Yapay zeka, mevcut eğitimlerinizi analiz ederek bir sonraki seviye için eksiklerinizi ve adım adım eğitim planını belirler.
          </span>
          <button
            onClick={handleAnalyze}
            disabled={isLoading || completedTrainings.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-sm ml-auto"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Eğitimler Analiz Ediliyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Eğitimleri Analiz Et & Yol Haritası Üret</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Analysis Results Display */}
      {analysisResult && (
        <section className="space-y-8 animate-in fade-in duration-300">
          {/* Header & Export */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
                <span>Kariyer Danışmanlığı Analizi</span>
                <span aria-hidden="true">·</span>
                <span>{targetCareerGoal}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                Kazanılan Beceriler ve Bir Sonraki Adım Eğitim Rehberi
              </h2>
            </div>

            <button
              onClick={handleExportRoadmap}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Yol Haritasını İndir (.md)</span>
            </button>
          </div>

          {/* 1. Extracted Skills Inventory */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-7 space-y-5">
            <div>
              <h3 className="text-base font-bold text-white">
                1. Mevcut Eğitimlerinizden Çıkarılan Beceri Envanteri
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {analysisResult.extractedSkillInventory.overallCompetencyAssessment}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Core Technical */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-indigo-400 block">
                  Temel Teknik Yetkinlikler
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {analysisResult.extractedSkillInventory.coreTechnical.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-400 font-bold">·</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Methodology & Tools */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-emerald-400 block">
                  Metodoloji, Mimari & Araçlar
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {analysisResult.extractedSkillInventory.methodologyAndTools.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">·</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Soft / Leadership */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-amber-400 block">
                  Yumuşak Beceriler & Süreç
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {analysisResult.extractedSkillInventory.softAndLeadership.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">·</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 2. Gap Analysis */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-7 space-y-5">
            <div>
              <h3 className="text-base font-bold text-white">
                2. Kritik Beceri Açığı Analizi (Hedef: {targetCareerGoal})
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                2026 sektör standartları: {analysisResult.gapAnalysis.marketExpectations}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Kritik Eksikler (Acil Kapatılması Gerekenler)</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {analysisResult.gapAnalysis.criticalGaps.map((gap, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold shrink-0">!</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                  <Award className="w-4 h-4" />
                  <span>Fark Yaratan İkincil Beceriler (Avantaj Sağlayacaklar)</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {analysisResult.gapAnalysis.secondaryGaps.map((gap, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold shrink-0">★</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Step-by-Step Educational Roadmap */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
                <Compass className="w-4 h-4" />
                <span>Sıralı Gelişim Rotası</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                3. Bir Sonraki Adım İçin Almanız Gereken Eğitimler
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Mevcut eğitimlerinizin üzerine inşa edilen, önceliklendirilmiş ve portfolyo projesi içeren adım adım eğitim yol haritanız:
              </p>
            </div>

            <div className="space-y-6">
              {analysisResult.stepByStepRoadmap.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 hover:border-slate-700/80 transition-all shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold font-mono text-sm">
                        {step.stepNumber}
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">
                          {step.stepNumber === 1 ? '🔥 İLK ALINMASI GEREKEN EĞİTİM (BİR SONRAKİ ADIM)' : `${step.stepNumber}. Sıradaki Eğitim`}
                        </span>
                        <h4 className="text-base font-bold text-white">
                          {step.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-indigo-300 font-medium">{step.focusArea}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{step.estimatedDuration}</span>
                      </span>
                    </div>
                  </div>

                  {/* Why this next rationale */}
                  <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/40 text-xs">
                    <strong className="text-indigo-300 block mb-1">
                      Neden Tam Olarak Bir Sonraki Adım Olarak Bu Eğitimi Almalısınız?
                    </strong>
                    <p className="text-slate-300 leading-relaxed">
                      {step.whyThisNext}
                    </p>
                  </div>

                  {/* Curriculum topics and certifications */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <strong className="text-slate-300 block">Eğitimin İçermesi Gereken Müfredat Konuları:</strong>
                      <ul className="space-y-1 text-slate-400">
                        {step.suggestedTopics.map((topic, tidx) => (
                          <li key={tidx} className="flex items-start gap-1.5">
                            <span className="text-emerald-400">✓</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <strong className="text-slate-300 block mb-1">Önerilen Eğitim Formatı / Kaynak:</strong>
                        <p className="text-slate-400">{step.recommendedFormat}</p>
                        {step.suggestedPlatformsOrCertifications && (
                          <div className="mt-2 text-[11px] text-slate-400">
                            <strong>Platform & Sertifikasyon:</strong>{' '}
                            {step.suggestedPlatformsOrCertifications.join(' · ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Capstone Showcase Project */}
                  {step.capstoneProject && (
                    <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                        <FolderGit2 className="w-4 h-4" />
                        <span>Bu Eğitimin Ardından Yapılacak Portfolyo / GitHub Projesi: {step.capstoneProject.title}</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {step.capstoneProject.description}
                      </p>
                      <p className="text-[11px] text-indigo-300/90 italic">
                        💡 <strong>Mülakatta Sunum İpucu:</strong> {step.capstoneProject.githubShowcaseTip}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
