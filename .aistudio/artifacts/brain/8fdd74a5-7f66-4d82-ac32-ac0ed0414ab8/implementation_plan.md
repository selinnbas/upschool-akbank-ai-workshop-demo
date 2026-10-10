# Kariyer & Mülakat Koçu (Career & Interview Coach Agent)

Akıllı mülakat simülatörü ve kariyer gelişim danışmanı: Katılacağınız mülakattaki mülakatçının unvanına (interviewer title) göre hedefe yönelik soru havuzu ve canlı simülasyon sunarken, aldığınız eğitimlerin içeriğini analiz ederek sonraki adım için kişiselleştirilmiş eğitim yol haritası ve beceri açığı analizi oluşturur.

## Kullanıcı Tercihleri ve Onaylanan Kararlar

> [!IMPORTANT]
> Kullanıcı ile yapılan ön değerlendirme doğrultusunda sistem mimarisi aşağıdaki kararlar üzerine kurgulanmıştır:

- **Sektörel Kapsam**: Yazılım, ürün yönetimi, veri ve tüm genel iş sektörlerine esnek uyarlanabilirlik (hazır şablonlar ve serbest unvan girişi).
- **Mülakat Modu**: Canlı interaktif simülasyon deneyimi; mülakatçının unvanı ve bakış açısına göre soru üretimi, STAR metoduyla kullanıcı yanıtını puanlama ve anlık koç geri bildirimi.
- **Eğitim ve Gelişim Rehberi**: Mevcut eğitim içeriklerinden çıkarılan beceri matrisi, hedef unvan için eksik analizi (gap analysis) ve aşamalı eğitim/sertifika yol haritası.

---

## 1. Genel Bakış ve Temel Değer Önerisi

- **Ne Yapar?**:
  1. **Mülakatçı Unvanına Özel Soru & Simülasyon**: Kullanıcı mülakata gireceği kişinin unvanını (örneğin *Engineering Manager*, *Lead HR Specialist*, *VP of Product*, *Principal Architect*, *C-Level Executive*) ve hedef pozisyonu belirtir. Yapay zeka, o unvanın değerlendirme kriterlerini, odaklandığı yetkinlikleri ve potansiyel teknik/davranışsal soruları üretir. Kullanıcı canlı simülasyonda soruları yanıtlayarak anlık koçluk ve revize örnek yanıt önerileri alır.
  2. **Eğitim İçeriği Analizi & Sonraki Adım Tavsiyesi**: Kullanıcının tamamladığı eğitim ve kursların içeriklerini (müfredat, öğrenilen konular, araçlar) analiz eder; kazanılan becerileri haritalandırır; hedef seviye için nelerin eksik olduğunu tespit ederek bir sonraki aşamada alması gereken kurs ve eğitim konularını adım adım planlar.
- **Hedef Kitle**: Kariyer basamaklarını tırmanmak isteyen profesyoneller, yeni iş mülakatına hazırlanan adaylar ve kariyer dönüşümü hedefleyen çalışanlar.
- **Temel Değer**: Mülakatçı kimliğine göre özel taktik ve strateji kazandırmak; gelişigüzel eğitimler almak yerine eksik becerilere doğrudan nokta atışı yapan eğitim rotası çizmek.

---

## 2. Kullanıcı Deneyimi ve Arayüz Tasarımı

### Ana Kullanıcı Akışları
1. **Mülakat Hazırlık & Simülatör Akışı**:
   - Kullanıcı mülakatçı unvanını girer veya hazır kartlardan seçer (ör. *Head of Engineering*, *Senior HR Business Partner*, *Product Director*).
   - Hedef şirket türü ve pozisyon düzeyi (Junior, Mid, Senior, Lead) seçilir.
   - Model, mülakatçının zihin yapısını ve 6-8 adet kritik soruyu oluşturur (soru amacı, aranan ipuçları, değerlendirme kriteri).
   - **Canlı Simülasyon**: İstenen soru için yanıt yazılır; AI Koç, STAR formatında güçlü ve zayıf yönleri listeler, 1-100 puan verir ve "Nasıl daha iyi söylenebilirdi?" revizyonunu sunar.
2. **Eğitim Analizi & Yol Haritası Akışı**:
   - Kullanıcı tamamladığı eğitimleri (kurs adı, platform, işlenen konular, kazanılan pratikler) listeye ekler (metin yapıştırma veya hazır şablon yükleme desteği).
   - "Kariyer Yol Haritası Üret" tıklandığında yapay zeka:
     - Kazanılan becerileri kategorilere ayırır (Temel Teknik, Mimari/Metodoloji, Liderlik & Süreç).
     - Eksik becerileri (Skill Gaps) tespit eder.
     - "Bir Sonraki Adım" eğitim planını çıkarır: Önerilen eğitim başlığı, öncelik sırası, gerekçesi, tahmini süre ve hedeflenen yetkinlik kazanımı.
3. **Kişisel Kariyer Panosu**:
   - Mülakat notları ve eğitim yol haritası LocalStorage'a kaydedilir; JSON veya Markdown olarak dışa aktarılabilir.

### Görsel Tasarım ve Tipografi
- **Tasarım Dili**: SaaS & Dashboard ilkelerine uygun, temiz, profesyonel ve modern editoryal estetik. Kart içine kart yığma yerine ferah boşluklar ve net çizgiler.
- **Renk Paleti**:
  - Tuval: Slate-900 / Slate-950 koyu tema veya Slate-50 temiz aydınlık nötr zemin (60-30-10 renk dengesi).
  - Vurgular: İndigo / Mavi (`#4F46E5` / `#3B82F6`) odak rengi; başarı için zümrüt yeşili (`#10B981`); eksik beceriler için amber (`#F59E0B`).
- **Tipografi**:
  - Başlıklar: *Plus Jakarta Sans* / *Outfit* karakterli geometrik sans-serif.
  - Gövde Metni: *Plus Jakarta Sans* / *DM Sans* yüksek okunabilirlik.
  - Metrikler ve Seviyeler: `font-mono tabular-nums`.
- **Anti-Slop Kuralları**:
  - Statik hap (pill badge) yerine sade tipografik ayraçlar (`·` veya `/`).
  - Gereksiz yapay sayaçlar veya kod yorumu başlıkları (`// 01`) bulunmaz; doğal insan dilinde editoryal başlıklar kullanılır.

---

## 3. Ürün Kararları ve Mimari Tercihler

- **Karar 1: İki Temel Modüler Sekme (Mülakat Simülatörü vs. Eğitim Yol Haritası)**:
  - *Seçim*: Tek bir karmaşık sayfa yerine, üstte temiz sekme yapısıyla iki odaklanmış deneyim sunulacak: "Mülakat Koçu & Simülatör" ve "Eğitim Analizi & Yol Haritası".
  - *Neden*: Kullanıcı bir gün sadece mülakat provası yaparken, başka bir gün eğitim planlamasına odaklanabilir. Veriler ortak kariyer profilinde senkronize çalışır.
- **Karar 2: Server-Side Gemini 3.8 Entegrasyonu**:
  - *Seçim*: Tüm yapay zeka çağrıları `@google/genai` kullanılarak sunucu tarafında (Vite API middleware / Express) `gemini-3.8-flash` modeli ile yapılandırılmış JSON şemalarıyla yönetilecek.
  - *Neden*: Hızlı yanıt süresi, güvenli API anahtarı yönetimi ve tutarlı veri formatı.
- **Karar 3: Hazır Şablonlar & Gerçekçi Örnekler**:
  - *Seçim*: Kullanıcının hemen deneyebilmesi için tek tıkla yüklenebilen gerçekçi veri setleri (Frontend'den Fullstack'e geçiş, Veri Analistinden ML Mühendisine geçiş vb.).

---

## 4. Teknik Mimari ve Veri Stratejisi

### Sistem Mimarisi

```
┌─────────────────────────────────────────────────────────────┐
│                    Kullanıcı Arayüzü (React 19)             │
│                                                             │
│  ┌─────────────────────────┐   ┌──────────────────────────┐ │
│  │   Mülakatçı Unvanı &     │   │   Tamamlanan Eğitimler   │ │
│  │   Soru Havuzu Paneli    │   │   & Beceri Giriş Alanı   │ │
│  └────────────┬────────────┘   └─────────────┬────────────┘ │
│               │                              │              │
│  ┌────────────▼────────────┐   ┌─────────────▼────────────┐ │
│  │  Canlı Simülatör &      │   │  Beceri Matrisi & Adım   │ │
│  │  STAR Değerlendirme     │   │  Adım Eğitim Yol Haritası│ │
│  └────────────┬────────────┘   └─────────────┬────────────┘ │
└───────────────┼──────────────────────────────┼──────────────┘
                │                              │
                ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                API Katmanı (/api/coach/...)                 │
│   • POST /api/coach/generate-questions                      │
│   • POST /api/coach/evaluate-answer                         │
│   • POST /api/coach/analyze-trainings                       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             @google/genai (gemini-3.8-flash)                │
│    • Personaya göre soru türetme                            │
│    • STAR yöntemiyle yanıt analizi ve skorlama              │
│    • Beceri envanteri çıkarma & eğitim açığı kapatma        │
└─────────────────────────────────────────────────────────────┘
```

### Veri Modelleri
- `InterviewerProfile`: `{ title: string, seniority: string, industry: string, roleDescription?: string }`
- `InterviewQuestion`: `{ id: string, question: string, category: 'technical' | 'behavioral' | 'strategic' | 'culture', interviewerRationale: string, keySignals: string[], suggestedFramework: string }`
- `AnswerEvaluation`: `{ score: number, strengths: string[], weaknesses: string[], starBreakdown: { situation: string, task: string, action: string, result: string }, refinedAnswer: string, coachNotes: string }`
- `CompletedCourse`: `{ id: string, title: string, platform: string, topics: string[], keyTakeaways: string, duration?: string }`
- `SkillMatrix`: `{ masteredSkills: string[], intermediateSkills: string[], missingCriticalSkills: string[] }`
- `RecommendedTraining`: `{ id: string, stepNumber: number, title: string, focusArea: string, whyNeeded: string, targetSkills: string[], estimatedTime: string, suggestedFormat: string, priority: 'critical' | 'high' | 'medium' }`

---

## 5. Uygulama Adımları (Onay Sonrası)

1. **API & Servis Altyapısı**: Vite sunucu middleware katmanında Gemini 3.8 istemcisini ve soru türetme, mülakat değerlendirme ve eğitim analiz uçlarını yapılandırma.
2. **Kariyer & Mülakat Paneli**: Mülakatçı unvanı seçimi, soru havuzu kartları ve interaktif yanıt/simülatör bileşeni.
3. **Eğitim Analiz & Yol Haritası Paneli**: Kurs dökümü girişi, beceri matrisi görselleştirmesi ve aşamalı eğitim öneri rehberi.
4. **Şablonlar, Dışa Aktarma & Kalite Kontrolü**: Tek tıkla örnek veri yükleme, Markdown/JSON dışa aktarma, responsive yerleşim ve `compile_applet` doğrulaması.
