import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, AlertCircle, Quote, Copy, Check, RefreshCw, Award } from 'lucide-react';
import { InterviewQuestion, AnswerEvaluation } from '../types/coach';

interface MockSimulatorModalProps {
  question: InterviewQuestion | null;
  interviewerTitle: string;
  targetRole: string;
  candidateLevel: string;
  isOpen: boolean;
  onClose: () => void;
  onSaveToSession?: (question: InterviewQuestion, answer: string, evalResult: AnswerEvaluation) => void;
}

export const MockSimulatorModal: React.FC<MockSimulatorModalProps> = ({
  question,
  interviewerTitle,
  targetRole,
  candidateLevel,
  isOpen,
  onClose,
  onSaveToSession,
}) => {
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !question) return null;

  const handleEvaluate = async () => {
    if (!candidateAnswer.trim() || candidateAnswer.trim().length < 10) {
      setError('Lütfen simülasyon için en az 1-2 cümlelik gerçekçi bir yanıt yazınız.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/coach/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question,
          interviewerTitle,
          targetRole,
          candidateLevel,
          candidateAnswer,
        }),
      });

      if (!res.ok) {
        throw new Error('Değerlendirme servisine ulaşılamadı.');
      }

      const data = await res.json();
      setEvaluation(data);

      if (onSaveToSession) {
        onSaveToSession(question, candidateAnswer, data);
      }
    } catch (err: any) {
      console.error('Answer evaluation failed:', err);
      setError('Yanıt değerlendirilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertSampleAnswer = () => {
    if (candidateLevel.includes('Yeni Mezun')) {
      setCandidateAnswer(
        `Üniversitedeki bitirme projemizde 3 kişilik bir ekip olarak çalışıyorduk. Projenin son iki haftasında kullandığımız harici API servisinin sınırlandırma kotasını aştığımız için sistemimiz yanıt vermez hale geldi (Situation & Task). Ben hemen duruma müdahale ederek bir lokal önbellekleme (caching) mekanizması kurdum ve sorguları optimize ederek gereksiz istekleri %65 oranında azalttım (Action). Sonuç olarak sistemi kesintisiz çalışır hale getirdik, sunumu jüri önünde hatasız tamamladık ve 95 puan aldık. Bu deneyim bana kriz anında hızlı analiz yapmayı ve sistem kaynaklarını tutumlu kullanmayı öğretti (Result).`
      );
    } else {
      setCandidateAnswer(
        `Önceki şirketimde yüksek trafikli kampanya döneminde veritabanı yanıt süreleri 2.4 saniyeye kadar çıkmıştı. Müşteri deneyimini olumsuz etkileyen bu duruma çözüm bulmak benim sorumluluğumdaydı. Yaptığım profil ve yavaş sorgu analizlerinde eksik indeksler ve N+1 sorgu problemi olduğunu tespit ettim. İndekslemeleri optimize edip Redis önbelleği entegre ettim. Sonuç olarak sorgu gecikmelerini 140 milisaniyeye düşürdük ve kampanya boyunca %99.98 uptime sağladık.`
      );
    }
  };

  const handleCopyRevision = () => {
    if (evaluation?.coachedRevision) {
      navigator.clipboard.writeText(evaluation.coachedRevision);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
    if (score >= 60) return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
    return 'text-rose-400 bg-rose-950/60 border-rose-800/60';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-indigo-400 font-medium">{interviewerTitle}</span>
              <span aria-hidden="true">·</span>
              <span>{candidateLevel}</span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-white mt-1">
              Canlı Mülakat Simülasyonu & Koçluk
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Question Box */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0 mt-0.5">
                <Quote className="w-4 h-4" />
              </div>
              <div className="space-y-2">
                <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  "{question.question}"
                </p>
                <div className="text-xs text-slate-400">
                  <strong className="text-slate-300">Mülakatçının Amacı:</strong> {question.whyAsked}
                </div>
                {question.suggestedFramework && (
                  <div className="text-xs text-indigo-300/90 bg-indigo-950/40 border border-indigo-900/40 p-2 rounded-lg">
                    💡 <strong>Önerilen Yanıt Çerçevesi:</strong> {question.suggestedFramework} (Durum, Görev, Eylemlerin ve Ölçülebilir Sonuç)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Answer Input Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">
                Mülakatçıya Vereceğiniz Yanıt:
              </label>
              <button
                type="button"
                onClick={handleInsertSampleAnswer}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors underline"
              >
                Hızlı Test İçin Örnek Yanıt Doldur
              </button>
            </div>
            <textarea
              rows={5}
              value={candidateAnswer}
              onChange={(e) => setCandidateAnswer(e.target.value)}
              placeholder="Soruyu yanıtlarken ne yaşadığınızı (Situation), görevinizi (Task), bizzat aldığınız aksiyonları (Action) ve elde ettiğiniz somut sonucu (Result) aktarmaya çalışın..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>STAR formatına uygun yanıtlar en yüksek puanı alır.</span>
              <span>{candidateAnswer.length} karakter</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-lg text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          {!evaluation && (
            <div className="flex justify-end">
              <button
                onClick={handleEvaluate}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Koç Yanıtınızı İnceliyor...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Yanıtı Değerlendir & Koçluk Al</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Evaluation Results */}
          {evaluation && (
            <div className="space-y-5 pt-4 border-t border-slate-800 animate-in fade-in duration-300">
              {/* Score Header */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1.5 rounded-lg border text-base font-bold font-mono tabular-nums ${getScoreBadgeClass(evaluation.overallScore)}`}>
                    {evaluation.overallScore} / 100
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Değerlendirme: {evaluation.verdict}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Mülakatçı Unvanı: <span className="text-slate-300">{interviewerTitle}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setEvaluation(null)}
                  className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Yanıtı Yeniden Düzenle
                </button>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Öne Çıkan Güçlü Yönler</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {evaluation.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>Geliştirilmesi Gerekenler</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {evaluation.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">!</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Interviewer Impression */}
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/50">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 mb-1">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <span>Mülakatçının Zihnindeki İzlenim ({interviewerTitle})</span>
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{evaluation.interviewerImpression}"
                </p>
              </div>

              {/* STAR Breakdown */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-semibold text-slate-200">
                  STAR Modeli Analiz Dökümü:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-indigo-400 font-semibold block mb-0.5">S · Durum (Situation)</span>
                    <p className="text-slate-300 text-[11px]">{evaluation.starBreakdown.situation}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-indigo-400 font-semibold block mb-0.5">T · Görev (Task)</span>
                    <p className="text-slate-300 text-[11px]">{evaluation.starBreakdown.task}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-indigo-400 font-semibold block mb-0.5">A · Eylem (Action)</span>
                    <p className="text-slate-300 text-[11px]">{evaluation.starBreakdown.action}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-indigo-400 font-semibold block mb-0.5">R · Sonuç (Result)</span>
                    <p className="text-slate-300 text-[11px]">{evaluation.starBreakdown.result}</p>
                  </div>
                </div>
              </div>

              {/* Coached Model Revision */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Koçun Revize Ettiği Yüksek Etkili Örnek Yanıt</span>
                  </div>
                  <button
                    onClick={handleCopyRevision}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900 p-3.5 rounded-lg border border-slate-800">
                  {evaluation.coachedRevision}
                </p>
                {evaluation.coachTip && (
                  <p className="text-[11px] text-amber-300/90 bg-amber-950/40 p-2.5 rounded border border-amber-900/40">
                    💡 <strong>Koçun Altın Tavsiyesi:</strong> {evaluation.coachTip}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
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
