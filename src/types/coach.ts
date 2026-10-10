export type QuestionCategory = 'technical' | 'behavioral' | 'strategic' | 'culture' | 'scenario';

export interface InterviewQuestion {
  id: string;
  question: string;
  category: QuestionCategory;
  difficulty: 'Temel' | 'Orta' | 'İleri';
  whyAsked: string;
  idealSignals: string[];
  commonMistakes: string[];
  suggestedFramework: string;
  sampleKeyPoints: string[];
}

export interface InterviewerPersona {
  title: string;
  seniorityLevel: string;
  coreFocus: string;
  evaluationMindset: string;
  topGreenFlags: string[];
  topRedFlags: string[];
  newGradAdvice: string;
}

export interface AnswerEvaluation {
  overallScore: number;
  verdict: string;
  strengths: string[];
  improvements: string[];
  starBreakdown: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  interviewerImpression: string;
  coachedRevision: string;
  coachTip: string;
}

export interface CompletedTraining {
  id: string;
  title: string;
  platform?: string;
  contentSummary: string;
  completedYear?: string;
}

export interface SkillInventory {
  coreTechnical: string[];
  methodologyAndTools: string[];
  softAndLeadership: string[];
  overallCompetencyAssessment: string;
}

export interface GapAnalysis {
  criticalGaps: string[];
  secondaryGaps: string[];
  marketExpectations: string;
}

export interface RoadmapStep {
  stepNumber: number;
  title: string;
  focusArea: string;
  priority: 'Kritik' | 'Yüksek' | 'Orta';
  whyThisNext: string;
  recommendedFormat: string;
  suggestedTopics: string[];
  estimatedDuration: string;
  suggestedPlatformsOrCertifications: string[];
  capstoneProject: {
    title: string;
    description: string;
    githubShowcaseTip: string;
  };
}

export interface TrainingAnalysisResult {
  extractedSkillInventory: SkillInventory;
  gapAnalysis: GapAnalysis;
  stepByStepRoadmap: RoadmapStep[];
}

export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  targetRole: string;
  candidateLevel: string;
  industry: string;
  interviewerTitle: string;
  companyContext: string;
  targetCareerGoal: string;
  sampleTrainings: CompletedTraining[];
}
