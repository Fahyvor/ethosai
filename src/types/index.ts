export interface User {
  id: string;
  name: string;
  email: string;
  role: 'assessor' | 'auditor' | 'developer' | 'regulator' | 'admin';
  organization?: string;
}

export interface AISystem {
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
  registeredBy?: {
    _id: string;
    name: string;
    email: string;
  };
  riskCategory?: 'unacceptable' | 'high' | 'limited' | 'minimal';
  status: 'registered' | 'under_assessment' | 'assessed' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Recommendation {
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  regulatoryReference?: string;
  mitigationMeasure: string;
}

export interface Assessment {
  _id: string;
  aiSystemId: AISystem | any;
  assessorId: {
    _id: string;
    name: string;
    email: string;
  } | any;
  status: 'draft' | 'in_progress' | 'completed' | 'reviewed';
  transparencyScore: number;
  biasScore: number;
  privacyScore: number;
  humanOversightScore: number;
  dataQualityScore: number;
  overallRiskScore: number;
  riskLevel: 'unacceptable' | 'high' | 'limited' | 'minimal';
  findings: string[];
  recommendations: Recommendation[];
  regulatoryReferences: string[];
  assessmentData?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ReportItem {
  _id: string;
  assessmentId: Assessment | any;
  generatedBy: string;
  title: string;
  pdfPath?: string;
  status: 'generating' | 'ready' | 'failed';
  createdAt: string;
}

export interface RegulatoryResource {
  id: string;
  article: string;
  title: string;
  category: 'eu_ai_act' | 'ndpa_2023';
  description: string;
  relevance: string;
}
