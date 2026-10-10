import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK with required telemetry User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for calling Gemini with JSON response
async function callGeminiJson<T>(prompt: string, systemInstruction: string, fallbackData: T): Promise<T> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not configured, using comprehensive fallback data.');
    return fallbackData;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction,
        temperature: 0.7,
      },
    });

    const rawText = response.text?.trim() || '';
    if (!rawText) return fallbackData;

    try {
      return JSON.parse(rawText) as T;
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON output:', parseErr, rawText);
      return fallbackData;
    }
  } catch (err) {
    console.error('Gemini API call error:', err);
    return fallbackData;
  }
}

// 1. Generate Interview Questions & Persona
app.post('/api/coach/generate-questions', async (req: Request, res: Response) => {
  const {
    interviewerTitle = 'Senior Software Engineering Lead',
    targetRole = 'Frontend / Fullstack Developer',
    candidateLevel = 'Yeni Mezun / Giriş Seviyesi',
    industry = 'Teknoloji & SaaS',
    companyContext = 'Modern Çevik Yazılım Ekibi',
  } = req.body;

  const systemInstruction = `Sen dünya çapında deneyimli bir Üst Düzey Kariyer Koçu ve Mülakat Danışmanısın.
Kullanıcı sana mülakat yapacak kişinin unvanını (interviewerTitle), hedef pozisyonu (targetRole), aday seviyesini (candidateLevel: özellikle Üniversiteden Yeni Mezun, Junior, Mid, Senior) ve sektör bilgisini veriyor.
Görevin:
1. Mülakatçının unvanı ve zihniyetini analiz etmek: Bu unvandaki biri mülakata girdiğinde adayı hangi mercekten süzer? Nelere dikkat eder? Yeşil bayraklar (green flags) ve kırmızı bayraklar (red flags) nelerdir? Üniversiteden yeni mezun / deneyimsiz adaylar için özel taktikler nelerdir?
2. Bu mülakatçının doğrudan soracağı en az 6, en fazla 8 adet nokta atışı potansiyel soru üretmek. Soruların kategorileri ('technical', 'behavioral', 'strategic', 'culture', 'scenario') dengeli olmalıdır.
Tüm içerik Türkçe, profesyonel, yapıcı ve doğrudan uygulanabilir olmalıdır.
Çıktı JSON formatında olmalıdır.`;

  const prompt = `Lütfen şu mülakat profili için soru ve persona analizi üret:
- Mülakatçı Unvanı: "${interviewerTitle}"
- Adayın Başvurduğu Rol: "${targetRole}"
- Aday Seviyesi: "${candidateLevel}"
- Sektör / Şirket Türü: "${industry} - ${companyContext}"

Beklenen JSON Şeması:
{
  "interviewerPersona": {
    "title": "${interviewerTitle}",
    "seniorityLevel": "string",
    "coreFocus": "string (Bu unvanın mülakatta en çok odaklandığı 2-3 temel konu)",
    "evaluationMindset": "string (Mülakatçının zihin yapısı ve değerlendirme tarzı)",
    "topGreenFlags": ["string", "string", "string"],
    "topRedFlags": ["string", "string", "string"],
    "newGradAdvice": "string (Özellikle yeni mezunlar ve junior adaylar bu mülakatçı karşısında nasıl öne çıkmalı?)"
  },
  "questions": [
    {
      "id": "q1",
      "question": "string (Mülakatçının ağzından çıkacak net soru cümlesi)",
      "category": "technical | behavioral | strategic | culture | scenario",
      "difficulty": "Temel | Orta | İleri",
      "whyAsked": "string (Neden özellikle bu unvandaki kişi bu soruyu sorar?)",
      "idealSignals": ["string", "string"],
      "commonMistakes": ["string", "string"],
      "suggestedFramework": "string (örn: STAR Metodu, Problem-Çözüm-Etki, Mimari Karar Ağacı)",
      "sampleKeyPoints": ["string", "string", "string"]
    }
  ]
}`;

  const fallbackData = {
    interviewerPersona: {
      title: interviewerTitle,
      seniorityLevel: 'Kıdemli Değerlendirici',
      coreFocus: 'Pratik problem çözme yeteneği, temel prensiplere hakimiyet ve takım içi iletişim.',
      evaluationMindset: 'Ezber yanıtlar yerine adayın düşünme sürecini, öğrenme çevikliğini ve aldığı sorumlulukları ölçümler.',
      topGreenFlags: [
        'Hatalarından ne öğrendiğini dürüstçe ve açıkça aktarabilme',
        'Akademik ya da kişisel projelerin sadece kodunu değil, arkasındaki mantığı savunabilme',
        'Soruları anlamak için netleştirici soru sorabilme olgunluğu'
      ],
      topRedFlags: [
        'Bilmediği bir kavramı biliyormuş gibi göstermeye çalışmak',
        'Sadece popüler kütüphanelerin isimlerini sayıp arka plandaki çalışma mekanizmasını bilmemek',
        'Ekip çalışmasında sorumluluk paylaşımından kaçınmak'
      ],
      newGradAdvice: 'Yeni mezun veya kariyerinin başındaki adaylardan 10 yıllık sistem mimarisi bilgisi beklenmez; merak, öğrenme tutkusu, git/kodlama hijyeni ve temel bilgisayar bilimi/iş prensiplerini ne kadar içselleştirdiği aranır. Üniversite bitirme projenizi veya stajınızı somut çıktılarla anlatın.'
    },
    questions: [
      {
        id: 'q1',
        question: `Geçmiş projelerinizde veya eğitimlerinizde karşılaştığınız teknik/işle ilgili en zorlu problemi ve bunu nasıl aştığınızı anlatır mısınız?`,
        category: 'behavioral',
        difficulty: 'Orta',
        whyAsked: `${interviewerTitle} adayın kriz anlarındaki analitik düşünme refleksini ve problem çözme yaklaşımını anlamak ister.`,
        idealSignals: ['Metodik hata ayıklama adımları', 'Öğrenilen dersin vurgulanması', 'Başkalarından yardım isteme olgunluğu'],
        commonMistakes: ['Problemi çok yüzeysel bırakmak', '"Hiç zorluk yaşamadım" demek'],
        suggestedFramework: 'STAR (Durum - Görev - Eylem - Sonuç)',
        sampleKeyPoints: ['Karşılaşılan beklenmedik durum', 'İzlenen araştırma ve test yöntemi', 'Nihai başarı ve kazanım']
      },
      {
        id: 'q2',
        question: `Bir kütüphane veya teknoloji seçimi yaparken hangi kriterleri göz önünde bulundurursunuz?`,
        category: 'technical',
        difficulty: 'Orta',
        whyAsked: 'Kişinin popüler trendleri körü körüne takip etmek yerine teknik fayda-maliyet dengesini kavrayıp kavramadığını ölçer.',
        idealSignals: ['Topluluk desteği ve dokümantasyon', 'Performans ve bakım kolaylığı', 'Ekip yetkinliği'],
        commonMistakes: ['Sadece "çünkü en popüleri o" demek'],
        suggestedFramework: 'Karar Matrisi (Trade-off Analizi)',
        sampleKeyPoints: ['Gereksinim analizi', 'Alternatiflerin karşılaştırılması', 'Bakım ve güvenlik maliyeti']
      },
      {
        id: 'q3',
        question: `Ekip arkadaşınızın veya yöneticinizin teknik bir kararınıza karşı çıktığı bir durumu nasıl yönetirsiniz?`,
        category: 'culture',
        difficulty: 'Temel',
        whyAsked: 'Kişinin çatışma çözme becerisini, egodan bağımsız objektif diyalog kurabilme yeteneğini test eder.',
        idealSignals: ['Veri ve argümanlarla konuşma', 'Aktif dinleme ve empati', 'Ortak hedefe odaklanma'],
        commonMistakes: ['Kişiselleştirmek veya hemen geri adım atmak'],
        suggestedFramework: 'Empati ve Argümantasyon Modeli',
        sampleKeyPoints: ['Karşı tarafın endişesini anlama', 'Ölçülebilir metriklerle tartışma', 'Ekip kararına saygı duyup hızla uygulama']
      }
    ]
  };

  const data = await callGeminiJson(prompt, systemInstruction, fallbackData);
  res.json(data);
});

// 2. Evaluate Candidate's Answer (Interactive Mock Simulator)
app.post('/api/coach/evaluate-answer', async (req: Request, res: Response) => {
  const {
    question = '',
    interviewerTitle = 'Senior Interviewer',
    targetRole = 'Software Engineer',
    candidateLevel = 'Yeni Mezun / Junior',
    candidateAnswer = '',
  } = req.body;

  if (!candidateAnswer || candidateAnswer.trim().length < 5) {
    return res.status(400).json({ error: 'Lütfen mülakat sorusuna bir yanıt giriniz.' });
  }

  const systemInstruction = `Sen profesyonel bir Kariyer ve Mülakat Koçusun.
Aday sana girdiği mülakattaki soruyu, mülakatçının unvanını, aday seviyesini (özellikle Üniversiteden Yeni Mezun ve Junior adaylara pozitif fakat yapıcı rehberlik sağla) ve verdiği gerçek yanıtı veriyor.
Görevin:
1. STAR (Situation, Task, Action, Result) modeline ve mülakatçının beklentilerine göre objektif değerlendirme yapmak.
2. 1-100 arası gerçekçi bir puan vermek.
3. Yanıtın güçlü yönlerini ve geliştirilmesi gereken noktaları maddeler halinde sunmak.
4. "Mülakatçının Zihnindeki İzlenim": Bu unvandaki kişi bu yanıtı duyduğunda içinden ne düşünür?
5. "Koçun Revize Ettiği Örnek Yanıt": Adayın anlattığı hikayeyi ve gerçekliği bozmadan, profesyonel, ölçülebilir ve etkileyici bir dille yeniden kaleme al.
Çıktı JSON formatında olmalıdır.`;

  const prompt = `Lütfen şu yanıtı değerlendir:
- Mülakat Sorusu: "${question}"
- Mülakatçı Unvanı: "${interviewerTitle}"
- Aday Rolü & Seviyesi: "${targetRole} (${candidateLevel})"
- Adayın Yanıtı:
"""
${candidateAnswer}
"""

Beklenen JSON Şeması:
{
  "overallScore": 75,
  "verdict": "Güçlü Aday | Geliştirilebilir Potansiyel | Yetersiz Hazırlık",
  "strengths": ["string", "string"],
  "improvements": ["string", "string"],
  "starBreakdown": {
    "situation": "string (Durum aktarımı nasıldı?)",
    "task": "string (Üstlenilen görev açık mıydı?)",
    "action": "string (Aday kendi aldığı aksiyonları mı anlattı yoksa genel mi konuştu?)",
    "result": "string (Sonuç ölçülebilir veya net miydi?)"
  },
  "interviewerImpression": "string (Mülakatçının bu yanıt sonrasındaki samimi iç sesi ve notu)",
  "coachedRevision": "string (Adayın yanıtının profesyonel ve etkileyici revize edilmiş hali)",
  "coachTip": "string (Bir sonraki soruda dikkat etmesi gereken altın ipucu)"
}`;

  const fallbackData = {
    overallScore: 78,
    verdict: 'Geliştirilebilir Potansiyel',
    strengths: [
      'Problem çözme isteği ve konu üzerindeki samimiyeti net aktarılmış.',
      'Soruya doğrudan odaklanarak gereksiz ayrıntılardan kaçınılmış.'
    ],
    improvements: [
      'Sonuç kısmında daha fazla somut çıktı veya ölçülebilir metrik (yüzde, zaman tasarrufu, öğrenim) belirtilmeli.',
      '"Biz yaptık" yerine "Ben şu rolü üstlendim ve şu kararı aldım" diyerek kişisel eylemler öne çıkarılmalı.'
    ],
    starBreakdown: {
      situation: 'Bağlam anlaşılır şekilde özetlenmiş.',
      task: 'Üzerine düşen sorumluluk ana hatlarıyla belirtilmiş.',
      action: 'Teknik aksiyonlar açıklanmış ancak kararların arkasındaki gerekçeler güçlendirilebilir.',
      result: 'Süreç tamamlanmış ancak nihai etki daha somut ifade edilmeli.'
    },
    interviewerImpression: `${interviewerTitle} bu adayın konuyu temel düzeyde anladığını ancak henüz profesyonel bir etki diliyle anlatma pratiğinin gelişme aşamasında olduğunu not eder.`,
    coachedRevision: `Örnek Revizyon: "${candidateAnswer.slice(0, 100)}... Bu süreçte özellikle X mimarisini tercih ettim çünkü Y faydası sağlıyordu. Sonuç olarak projeyi zamanında teslim ederek ekip verimliliğini artırdık ve Z konusunda derinleşme fırsatı buldum."`,
    coachTip: 'Yanıtlarınızda her zaman bireysel katkınızı ("Ben X aracını kullanarak Y sorununu çözdüm") vurgulayın.'
  };

  const data = await callGeminiJson(prompt, systemInstruction, fallbackData);
  res.json(data);
});

// 3. Analyze Completed Trainings & Recommend Next Educational Steps
app.post('/api/coach/analyze-trainings', async (req: Request, res: Response) => {
  const {
    completedTrainings = [],
    targetCareerGoal = 'Fullstack Developer',
    currentLevel = 'Yeni Mezun / Junior',
    fieldOfInterest = 'Web Teknolojileri & Bulut Mimarisi'
  } = req.body;

  const systemInstruction = `Sen kıdemli bir Teknik Kariyer & Eğitim Danışmanısın.
Kullanıcı sana tamamladığı eğitimlerin/kursların listesini ve içerik özetlerini, ayrıca ulaşmak istediği hedef kariyer pozisyonunu (targetCareerGoal) veriyor.
Görevin:
1. Mevcut eğitim içeriklerinden kazanılan beceri envanterini (coreTechnical, methodologyAndTools, softAndLeadership) net bir şekilde çıkarmak.
2. Hedef pozisyon için sektördeki (özellikle 2026 sektörel standartları) beklentileri kıyaslayarak Kritik Beceri Açıklarını (Skill Gap Analysis) tespit etmek.
3. Kullanıcının tam olarak "BİR SONRAKİ ADIM" olarak hangi eğitimleri alması gerektiğini sıralı bir yol haritası (stepByStepRoadmap) olarak oluşturmak.
Her adımda:
- Eğitimin başlığı ve odak alanı
- Neden tam olarak bir sonraki adımda alınmalı? (Önceki eğitimlerle kurulan köprü)
- İçermesi gereken spesifik müfredat konuları
- Tahmini öğrenme süresi ve önerilen format/sertifika/platform tipi
- Bu eğitimin ardından portfolyosuna (GitHub / CV) koyabileceği Capstone Proje Fikri!
Tüm metin Türkçe, motive edici, pedagojik olarak yapılandırılmış ve gerçekçi olmalıdır.
Çıktı JSON formatında olmalıdır.`;

  const prompt = `Adayın Bilgileri:
- Hedef Kariyer / Unvan: "${targetCareerGoal}"
- Mevcut Seviye: "${currentLevel}"
- İlgi Alanı: "${fieldOfInterest}"
- Tamamlanan Eğitimler:
${JSON.stringify(completedTrainings, null, 2)}

Beklenen JSON Şeması:
{
  "extractedSkillInventory": {
    "coreTechnical": ["string", "string"],
    "methodologyAndTools": ["string", "string"],
    "softAndLeadership": ["string", "string"],
    "overallCompetencyAssessment": "string (Mevcut eğitimlerin adayı getirdiği seviyenin özeti)"
  },
  "gapAnalysis": {
    "criticalGaps": ["string", "string", "string (Hedef unvan için acil tamamlanması gerekenler)"],
    "secondaryGaps": ["string", "string (Adayı rakiplerinin önüne geçirecek katma değerli beceriler)"],
    "marketExpectations": "string (2026 sektöründe bu hedef rol için aranan temel standartlar)"
  },
  "stepByStepRoadmap": [
    {
      "stepNumber": 1,
      "title": "string (Eğitim Başlığı)",
      "focusArea": "string (Örn: Backend Mimarisi, CI/CD, Güvenlik)",
      "priority": "Kritik | Yüksek | Orta",
      "whyThisNext": "string (Neden şu an aldığınız eğitimlerin ardından ilk olarak bu eğitimi almalısınız?)",
      "recommendedFormat": "string (Örn: Proje Bazlı İleri Düzey Kurs / Resmi Sertifikasyon)",
      "suggestedTopics": ["string", "string", "string", "string"],
      "estimatedDuration": "string (Örn: 4-6 Hafta)",
      "suggestedPlatformsOrCertifications": ["string", "string"],
      "capstoneProject": {
        "title": "string (CV/GitHub projesi)",
        "description": "string",
        "githubShowcaseTip": "string"
      }
    }
  ]
}`;

  const fallbackData = {
    extractedSkillInventory: {
      coreTechnical: ['JavaScript/TypeScript Temelleri', 'React Bileşen Mimarisi', 'Temel HTML5 & CSS3', 'REST API Tüketimi'],
      methodologyAndTools: ['Git & GitHub Versiyon Kontrolü', 'Vite & Modern Paketleyiciler', 'Temel Kod Düzeni'],
      softAndLeadership: ['Kendi Kendine Öğrenme Yetisi', 'Teknik Araştırma Becerisi'],
      overallCompetencyAssessment: 'Arayüz geliştirme ve istemci tarafı mantığında sağlam bir başlangıç temeli oluşmuş durumda. Ancak kurumsal üretim ortamı için arka uç, veri tabanı ve sistem tasarımı deneyimine ihtiyaç var.'
    },
    gapAnalysis: {
      criticalGaps: [
        'İlişkisel Veri Tabanı Mimarisi (PostgreSQL / SQL sorgu optimizasyonu)',
        'Arka Uç API Geliştirme ve Kimlik Doğrulama (Node.js / Express / JWT)',
        'Docker ile Konteynerlaştırma ve Temel CI/CD Dağıtım Süreçleri'
      ],
      secondaryGaps: [
        'Birim ve Entegrasyon Testleri (Vitest / Playwright)',
        'Bulut Temelleri (AWS EC2 / S3 veya Cloudflare Workers)'
      ],
      marketExpectations: 'Günümüz sektöründe yalnızca arayüz değil, verinin akışını uçtan uca yönetebilen ve kendi uygulamasını bulutta ayağa kaldırabilen mühendisler öncelikli tercih edilmektedir.'
    },
    stepByStepRoadmap: [
      {
        stepNumber: 1,
        title: 'Node.js, Express & PostgreSQL ile Kurumsal Arka Uç Mimarisi',
        focusArea: 'Backend & Veritabanı',
        priority: 'Kritik',
        whyThisNext: 'React ve arayüz eğitimlerinizi tamamladığınız için, artık kendi veri tabanınızı tasarlayıp güvenli API servisleri sunabilmeniz bir sonraki en doğal ve kritik adımdır.',
        recommendedFormat: 'Proje Bazlı Uygulamalı Kurs',
        suggestedTopics: [
          'PostgreSQL Veri Modelleme ve İndeksleme',
          'RESTful API Tasarım Prensipleri ve HTTP Durum Kodları',
          'JWT ile Yetkilendirme ve Güvenlik Önlemleri',
          'Prisma veya Drizzle ORM ile Tip Güvenli Veri Erişimi'
        ],
        estimatedDuration: '4-5 Hafta (Haftada 8-10 saat)',
        suggestedPlatformsOrCertifications: ['Coursera / Udemy', 'PostgreSQL Certified Associate hazırlık kaynakları'],
        capstoneProject: {
          title: 'Rol Tabanlı Görev ve Proje Yönetim API Servisi',
          description: 'Çok kullanıcılı, JWT kimlik doğrulamalı ve PostgreSQL ilişkisel veri tabanına bağlı tam donanımlı bir arka uç servisi.',
          githubShowcaseTip: 'Swagger/OpenAPI dokümantasyonu ekleyerek ve Postman koleksiyonunu Readme dosyasında paylaşarak mülakatçıyı etkileyin.'
        }
      },
      {
        stepNumber: 2,
        title: 'Docker & GitHub Actions ile Konteynerlaştırma ve CI/CD',
        focusArea: 'DevOps & Dağıtım',
        priority: 'Yüksek',
        whyThisNext: 'Yazdığınız frontend ve backend uygulamalarını "benim bilgisayarımda çalışıyordu" sorunundan kurtarıp canlı sunucularda otomatik test ve dağıtım döngüsüne sokabilmeniz gerekir.',
        recommendedFormat: 'Atölye & Uygulamalı Laboratuvar',
        suggestedTopics: [
          'Dockerfile ve Multi-stage Build optimizasyonları',
          'Docker Compose ile Frontend + Backend + DB orkestrasyonu',
          'GitHub Actions CI/CD Pipeline kurulumu',
          'Temel Linux sunucu yönetimi'
        ],
        estimatedDuration: '3-4 Hafta',
        suggestedPlatformsOrCertifications: ['Docker Certified Associate (DCA)', 'GitHub Actions Lab'],
        capstoneProject: {
          title: 'Tek Komutla Ayağa Kalkan Mikro Hizmet Çevresi',
          description: 'Frontend, Backend ve DB servislerinin tek bir docker-compose ile ayağa kalktığı ve PR açıldığında otomatik test koşan mimari.',
          githubShowcaseTip: 'GitHub repo ana sayfanıza yeşil "Passing Build" badge yerleştirin ve Dockerfile kararlarınızı Architecture.md içinde açıklayın.'
        }
      },
      {
        stepNumber: 3,
        title: 'Otomatik Test Stratejileri: Vitest, React Testing Library & Mocking',
        focusArea: 'Kod Kalitesi ve Güvenilirlik',
        priority: 'Yüksek',
        whyThisNext: 'Özellikle Senior ve Lead mülakatçıların ilk sorduğu şey test kültürüdür. Kodunuzun bozulmayacağını kanıtlayabilmek kıdem sıçraması sağlar.',
        recommendedFormat: 'Derinlemesine Kod İnceleme & Test Kursu',
        suggestedTopics: [
          'Birim Testleri (Unit Tests) ve Test Odaklı Geliştirme (TDD)',
          'Kullanıcı Akışlarını Test Etme (React Testing Library)',
          'API Çağrılarını ve DB İşlemlerini Mocklama (MSW)',
          'Code Coverage analizleri'
        ],
        estimatedDuration: '2-3 Hafta',
        suggestedPlatformsOrCertifications: ['TestingJavaScript / Modern Frontend Testing Guide'],
        capstoneProject: {
          title: '%85+ Test Kapsamına Sahip Kritik E-Ticaret Sepet Modülü',
          description: 'Fiyat hesaplamaları, kupon kodları ve asenkron sipariş akışlarının eksiksiz birim ve entegrasyon testleriyle korunduğu proje.',
          githubShowcaseTip: 'Mülakatta test raporunu ve test senaryolarınızı nasıl kurguladığınızı gösterin.'
        }
      }
    ]
  };

  const data = await callGeminiJson(prompt, systemInstruction, fallbackData);
  res.json(data);
});

// Configure Vite middleware in development or static serving in production
const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Career & Interview Coach Server running at http://0.0.0.0:${PORT}`);
});
