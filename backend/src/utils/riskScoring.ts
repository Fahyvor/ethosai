import { IRiskScore, IRecommendation } from '../types/index.js';

interface ScoreInputs {
  transparencyScore: number;
  biasScore: number;
  privacyScore: number;
  humanOversightScore: number;
  dataQualityScore: number;
  domain?: string;
  isAutonomous?: boolean;
  humanOversightLevel?: string;
}

export function computeRiskScore(inputs: ScoreInputs): IRiskScore {
  const weights = {
    transparency: 0.20,
    bias: 0.25,
    privacy: 0.20,
    humanOversight: 0.20,
    dataQuality: 0.15,
  };

  // Convert input scores (higher = better compliance = lower risk)
  // We invert: risk = 100 - compliance
  const riskComponents = {
    transparency: 100 - inputs.transparencyScore,
    bias: 100 - inputs.biasScore,
    privacy: 100 - inputs.privacyScore,
    humanOversight: 100 - inputs.humanOversightScore,
    dataQuality: 100 - inputs.dataQualityScore,
  };

  let overallScore =
    riskComponents.transparency * weights.transparency +
    riskComponents.bias * weights.bias +
    riskComponents.privacy * weights.privacy +
    riskComponents.humanOversight * weights.humanOversight +
    riskComponents.dataQuality * weights.dataQuality;

  // Domain multipliers (EU AI Act high-risk domains)
  const highRiskDomains = ['healthcare', 'finance', 'hr', 'law_enforcement', 'public_services'];
  if (inputs.domain && highRiskDomains.includes(inputs.domain)) {
    overallScore = Math.min(100, overallScore * 1.1);
  }

  // Autonomous systems with no oversight bump score
  if (inputs.isAutonomous && inputs.humanOversightLevel === 'none') {
    overallScore = Math.min(100, overallScore + 10);
  }

  overallScore = Math.round(overallScore);

  let riskLevel: IRiskScore['riskLevel'];
  let euAiActCategory: string;

  if (overallScore >= 90) {
    riskLevel = 'unacceptable';
    euAiActCategory = 'Unacceptable Risk — Prohibited (EU AI Act Art. 5)';
  } else if (overallScore >= 60) {
    riskLevel = 'high';
    euAiActCategory = 'High Risk — Requires Conformity Assessment (EU AI Act Art. 6, Annex III)';
  } else if (overallScore >= 30) {
    riskLevel = 'limited';
    euAiActCategory = 'Limited Risk — Transparency Obligations Apply (EU AI Act Art. 50)';
  } else {
    riskLevel = 'minimal';
    euAiActCategory = 'Minimal/No Risk — No Specific Obligations';
  }

  return {
    transparencyScore: inputs.transparencyScore,
    biasScore: inputs.biasScore,
    privacyScore: inputs.privacyScore,
    humanOversightScore: inputs.humanOversightScore,
    dataQualityScore: inputs.dataQualityScore,
    overallScore,
    riskLevel,
    euAiActCategory,
  };
}

export function generateRecommendations(
  scoreResult: IRiskScore,
  assessmentData: Record<string, unknown>
): IRecommendation[] {
  const recommendations: IRecommendation[] = [];

  if (scoreResult.transparencyScore < 50) {
    recommendations.push({
      category: 'Transparency',
      priority: scoreResult.transparencyScore < 25 ? 'critical' : 'high',
      description: 'Improve AI system documentation and explainability mechanisms.',
      regulatoryReference: 'EU AI Act Art. 13 — Transparency and provision of information',
      mitigationMeasure: 'Implement model cards, explainability tools (LIME/SHAP), and user-facing explanations of automated decisions.',
    });
  }

  if (scoreResult.biasScore < 50) {
    recommendations.push({
      category: 'Bias & Discrimination',
      priority: scoreResult.biasScore < 25 ? 'critical' : 'high',
      description: 'Address potential discriminatory outcomes in AI decision-making.',
      regulatoryReference: 'EU AI Act Art. 10 — Data and data governance; NDPA 2023 s.24',
      mitigationMeasure: 'Conduct regular bias audits, diversify training data, implement fairness metrics (demographic parity, equal opportunity).',
    });
  }

  if (scoreResult.privacyScore < 50) {
    recommendations.push({
      category: 'Privacy & Data Protection',
      priority: scoreResult.privacyScore < 25 ? 'critical' : 'high',
      description: 'Strengthen data protection controls and privacy-by-design principles.',
      regulatoryReference: 'NDPA 2023 Part III; EU AI Act Art. 10(5)',
      mitigationMeasure: 'Conduct a Data Protection Impact Assessment (DPIA), implement data minimization, establish clear consent mechanisms and retention policies.',
    });
  }

  if (scoreResult.humanOversightScore < 50) {
    recommendations.push({
      category: 'Human Oversight',
      priority: scoreResult.humanOversightScore < 25 ? 'critical' : 'high',
      description: 'Establish meaningful human oversight mechanisms for AI decisions.',
      regulatoryReference: 'EU AI Act Art. 14 — Human oversight',
      mitigationMeasure: 'Implement human-in-the-loop controls, right to human review for high-stakes decisions, and override mechanisms.',
    });
  }

  if (scoreResult.dataQualityScore < 50) {
    recommendations.push({
      category: 'Data Quality',
      priority: 'medium',
      description: 'Improve training data quality and governance.',
      regulatoryReference: 'EU AI Act Art. 10 — Data and data governance',
      mitigationMeasure: 'Establish data quality frameworks, document data provenance, implement data validation pipelines.',
    });
  }

  if (scoreResult.riskLevel === 'unacceptable') {
    recommendations.unshift({
      category: 'Regulatory Compliance',
      priority: 'critical',
      description: 'This AI system may fall under prohibited practices under the EU AI Act.',
      regulatoryReference: 'EU AI Act Art. 5 — Prohibited AI Practices',
      mitigationMeasure: 'Immediately suspend deployment and conduct a full legal review. Engage legal counsel and the relevant Data Protection Authority (DPA).',
    });
  }

  return recommendations;
}

export function generateFindings(scoreResult: IRiskScore): string[] {
  const findings: string[] = [];

  if (scoreResult.riskLevel === 'unacceptable') {
    findings.push('⚠️ CRITICAL: System poses unacceptable risks and may violate EU AI Act Art. 5 prohibited practices.');
  }
  if (scoreResult.riskLevel === 'high') {
    findings.push('System classified as HIGH RISK under EU AI Act Annex III — mandatory conformity assessment required before deployment.');
  }
  if (scoreResult.transparencyScore < 40) {
    findings.push('Insufficient transparency: users are not adequately informed about AI-driven decisions affecting them.');
  }
  if (scoreResult.biasScore < 40) {
    findings.push('Significant bias risk detected: training data may inadequately represent protected groups, risking discriminatory outcomes.');
  }
  if (scoreResult.privacyScore < 40) {
    findings.push('Privacy compliance gaps: data minimization principles and consent mechanisms require immediate attention under NDPA 2023.');
  }
  if (scoreResult.humanOversightScore < 40) {
    findings.push('Human oversight deficiency: automated decisions lack adequate human review mechanisms as required by EU AI Act Art. 14.');
  }
  if (scoreResult.overallScore < 30) {
    findings.push('System demonstrates good overall ethical compliance with AI governance standards.');
  }

  return findings;
}
