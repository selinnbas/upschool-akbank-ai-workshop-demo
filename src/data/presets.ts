import { PresetScenario } from '../types/coach';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'new-grad-developer',
    name: 'Üniversiteden Yeni Mezun → Junior Fullstack Developer',
    description: 'Bilgisayar/Mühendislik mezunlarının ilk profesyonel iş mülakatına hazırlığı ve backend/bulut eksiklerini kapatacak eğitim yol haritası.',
    targetRole: 'Junior Fullstack / Frontend Developer',
    candidateLevel: 'Yeni Mezun (0-1 Yıl Deneyim)',
    industry: 'Teknoloji & SaaS',
    interviewerTitle: 'Kıdemli Yazılım Ekip Lideri (Senior Engineering Lead)',
    companyContext: 'Yüksek Mühendislik Standartlarına Sahip Ürün Şirketi',
    targetCareerGoal: 'Production-Ready Fullstack Mühendisi',
    sampleTrainings: [
      {
        id: 't1',
        title: 'Üniversite Lisans: Veri Yapıları, Algoritmalar ve Nesne Yönelimli Programlama',
        platform: 'Üniversite Mühendislik Fakültesi',
        contentSummary: 'C++/Java ile diziler, bağlı listeler, ağaçlar, sıralama algoritmaları, Big-O karmaşıklık analizi ve OOP prensipleri.',
        completedYear: '2025'
      },
      {
        id: 't2',
        title: 'Modern Web Geliştirme Bootcamp: React 19, TypeScript ve Tailwind CSS',
        platform: 'Udemy / Kodlama Akademisi',
        contentSummary: 'JavaScript ES6+, TypeScript tip tanımları, React hooks (useState, useEffect, useMemo), Tailwind CSS responsive tasarım ve REST API tüketimi.',
        completedYear: '2026'
      },
      {
        id: 't3',
        title: 'İlişkisel Veritabanları ve Temel SQL',
        platform: 'Coursera',
        contentSummary: 'PostgreSQL ve MySQL temel komutları, SELECT, JOIN sorguları, primary/foreign key ilişkileri ve normalizasyon kuralları.',
        completedYear: '2026'
      }
    ]
  },
  {
    id: 'new-grad-data',
    name: 'Yeni Mezun → Junior Veri Bilimci & ML Mühendisi',
    description: 'İstatistik veya mühendislik kökenli yeni mezunun veri bilimi mülakatları ve yapay zeka alanında alması gereken ileri eğitimler.',
    targetRole: 'Junior Data Scientist / AI Engineer',
    candidateLevel: 'Yeni Mezun (0-1 Yıl Deneyim)',
    industry: 'Fintech & Veri Analitiği',
    interviewerTitle: 'Lead Data Scientist / AI Director',
    companyContext: 'Veri Odaklı Karar Alan Büyüyen Fintech Kuruluşu',
    targetCareerGoal: 'Uygulamalı Yapay Zeka & Makine Öğrenimi Mühendisi',
    sampleTrainings: [
      {
        id: 'd1',
        title: 'Python ile Veri Analizi ve Görselleştirme',
        platform: 'Coursera',
        contentSummary: 'NumPy matris işlemleri, Pandas DataFrame manipülasyonu, Matplotlib ve Seaborn ile keşifçi veri analizi (EDA).',
        completedYear: '2025'
      },
      {
        id: 'd2',
        title: 'İleri SQL ve İş Zekası (BI) Raporlama',
        platform: 'DataCamp',
        contentSummary: 'Window functions, CTE (Common Table Expressions), alt sorgular ve veri temizleme teknikleri.',
        completedYear: '2025'
      },
      {
        id: 'd3',
        title: 'Temel Makine Öğrenimi: Scikit-Learn ile Regresyon ve Sınıflandırma',
        platform: 'Kaggle Learn',
        contentSummary: 'Lineer regresyon, lojistik regresyon, karar ağaçları, Random Forest, model değerlendirme metrikleri (RMSE, F1-score, AUC-ROC).',
        completedYear: '2026'
      }
    ]
  },
  {
    id: 'product-manager-transition',
    name: 'Yeni Mezun / Kariyer Değişimi → Associate Product Manager (APM)',
    description: 'Ürün yönetimi rolü için mülakatçı beklentileri, kullanıcı araştırması ve ürün stratejisi eğitim adımları.',
    targetRole: 'Associate Product Manager (APM)',
    candidateLevel: 'Yeni Mezun / Başlangıç Seviyesi',
    industry: 'E-Ticaret & Mobil Uygulamalar',
    interviewerTitle: 'VP of Product / Head of Product',
    companyContext: 'B2C Büyüme Odaklı Hızlı Scaleup',
    targetCareerGoal: 'Kıdemli Ürün Yöneticisi (Senior PM)',
    sampleTrainings: [
      {
        id: 'p1',
        title: 'Agile & Scrum Temelleri ve Ürün Sahibi (PO) Rolü',
        platform: 'Scrum.org Eğitimleri',
        contentSummary: 'User Story yazımı, Sprint planlama, Backlog önceliklendirme teknikleri (MoSCoW, RICE) ve takım içi çevik seremoniler.',
        completedYear: '2025'
      },
      {
        id: 'p2',
        title: 'UI/UX Tasarım ve Figma ile Prototipleme',
        platform: 'Interaction Design Foundation',
        contentSummary: 'Kullanıcı araştırması, persona oluşturma, wireframing, etkileşimli Figma prototipleri ve kullanılabilirlik testleri.',
        completedYear: '2026'
      }
    ]
  },
  {
    id: 'backend-to-devops',
    name: 'Junior Developer → Bulut & Platform Mühendisi',
    description: 'Yazılım geliştiricinin sistem tasarımı, Docker, Kubernetes ve bulut altyapısı mülakatlarına hazırlığı.',
    targetRole: 'DevOps / Platform Engineer',
    candidateLevel: 'Junior / Mid-Level (1-2 Yıl)',
    industry: 'Bulut Altyapısı & Telekomünikasyon',
    interviewerTitle: 'Platform Engineering Lead / DevOps Yöneticisi',
    companyContext: 'Yüksek Trafikli Dağıtık Sistem Mimarisi',
    targetCareerGoal: 'Kıdemli Bulut Mimarisi & SRE Uzmanı',
    sampleTrainings: [
      {
        id: 'b1',
        title: 'Node.js & Express ile Dağıtık Servisler',
        platform: 'Udemy',
        contentSummary: 'Asenkron programlama, mikroservis haberleşmesi, REST API mimarisi ve Redis önbellekleme.',
        completedYear: '2025'
      },
      {
        id: 'b2',
        title: 'Linux Sistem Yönetimi ve Bash Scripting',
        platform: 'Linux Foundation',
        contentSummary: 'Dosya izinleri, ağ yönetimi, SSH, process izleme ve otomatikleştirilmiş bash scriptleri.',
        completedYear: '2025'
      }
    ]
  }
];

export const COMMON_INTERVIEWER_TITLES = [
  'Kıdemli Yazılım Ekip Lideri (Senior Engineering Lead)',
  'Teknik İşe Alım Uzmanı / Talent Partner (HR)',
  'Üniversite & Kampüs İşe Alım Yöneticisi (Campus Recruiter)',
  'Mühendislik Direktörü / VP of Engineering',
  'Yazılım Mimarı (Principal Software Architect)',
  'Ürün Yöneticisi / Head of Product',
  'Yapay Zeka & Veri Ekip Lideri (Lead Data Scientist)',
  'Genel Müdür / CTO (Chief Technology Officer)'
];

export const CANDIDATE_LEVELS = [
  'Yeni Mezun (0-1 Yıl Deneyim)',
  'Junior (1-2 Yıl Deneyim)',
  'Mid-Level (3-5 Yıl Deneyim)',
  'Senior / Lead (5+ Yıl Deneyim)'
];

export const INDUSTRIES = [
  'Teknoloji & SaaS',
  'Fintech & Bankacılık',
  'E-Ticaret & Pazaryeri',
  'Otomotiv & Savunma Sanayii',
  'Telekomünikasyon & Bulut',
  'Danışmanlık & Dijital Ajans'
];
