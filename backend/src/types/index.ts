export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  organization?: string;
  role: 'assessor' | 'auditor' | 'developer' | 'regulator' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface IAISystem {
  _id: string;
  name: string;
  description: string;
  purpose: string;
  domain: 'healthcare' | 'finance' | 'hr' | 'education' | 'public_services' | 'law_enforcement' | 'other';
  deploymentContext: string;
  dataTypesUsed: string[];
  isAutonomous: boolean;
  humanOversightLevel: 'none' | 'minimal' | 'moderate' | 'full';
  trainingDataDescription?: string;
  vendor?: string;
  registeredBy: string;
  riskCategory?: 'unacceptable' | 'high' | 'limited' | 'minimal';
  status: 'registered' | 'under_assessment' | 'assessed' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface IBiasEvaluation {
  _id: string;
  assessmentId: string;
  trainingDataDiversity: number;
  fairnessMetricsUsed: boolean;
  proxyDiscriminationRisk: boolean;
  affectedGroups: string[];
  biasMitigationMeasures: string;
  score: number;
  findings: string[];
}

export interface IPrivacyAssessment {
  _id: string;
  assessmentId: string;
  dataMinimization: boolean;
  consentMechanism: string;
  dataRetentionPolicy: string;
  crossBorderTransfer: boolean;
  dpaEngaged: boolean;
  privacyByDesign: boolean;
  score: number;
  findings: string[];
}

export interface IRiskScore {
  transparencyScore: number;
  biasScore: number;
  privacyScore: number;
  humanOversightScore: number;
  dataQualityScore: number;
  overallScore: number;
  riskLevel: 'unacceptable' | 'high' | 'limited' | 'minimal';
  euAiActCategory: string;
}

export interface IRecommendation {
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  regulatoryReference?: string;
  mitigationMeasure: string;
}

export interface IAssessment {
  _id: string;
  aiSystemId: string;
  assessorId: string;
  status: 'draft' | 'in_progress' | 'completed' | 'reviewed';
  transparencyScore: number;
  biasScore: number;
  privacyScore: number;
  humanOversightScore: number;
  dataQualityScore: number;
  overallRiskScore: number;
  riskLevel: 'unacceptable' | 'high' | 'limited' | 'minimal';
  findings: string[];
  recommendations: IRecommendation[];
  regulatoryReferences: string[];
  biasEvaluation?: IBiasEvaluation;
  privacyAssessment?: IPrivacyAssessment;
  assessmentData: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReport {
  _id: string;
  assessmentId: string;
  generatedBy: string;
  title: string;
  pdfPath?: string;
  status: 'generating' | 'ready' | 'failed';
  createdAt: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}
