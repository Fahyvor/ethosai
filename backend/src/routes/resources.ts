import { Router, Request, Response } from 'express';

const router = Router();

const EU_AI_ACT = [
  { id: 'art5', article: 'Article 5', title: 'Prohibited AI Practices', category: 'eu_ai_act', description: 'Prohibits AI systems that use subliminal techniques, exploit vulnerabilities, social scoring by governments, real-time biometric identification in public spaces, and emotion recognition in workplaces/educational institutions.', relevance: 'Any AI system must be screened against these prohibited practices before deployment.' },
  { id: 'art6', article: 'Article 6', title: 'Classification of High-Risk AI Systems', category: 'eu_ai_act', description: 'AI systems listed in Annex III (biometric identification, critical infrastructure, education, employment, essential services, law enforcement, migration, justice) are classified as high-risk.', relevance: 'AI systems in these sectors require mandatory conformity assessment and registration in the EU database.' },
  { id: 'art9', article: 'Article 9', title: 'Risk Management System', category: 'eu_ai_act', description: 'Requires a continuous risk management process for high-risk AI systems, including risk identification, estimation, evaluation, and mitigation measures.', relevance: 'Central to AI risk assessments — forms the backbone of the ETHOSAI assessment framework.' },
  { id: 'art10', article: 'Article 10', title: 'Data and Data Governance', category: 'eu_ai_act', description: 'Training, validation, and testing data must meet quality criteria, be relevant and representative, and be free from errors and biases relevant to the intended purpose.', relevance: 'Directly addresses bias evaluation and data quality scoring in AI assessments.' },
  { id: 'art13', article: 'Article 13', title: 'Transparency and Information Provision', category: 'eu_ai_act', description: 'High-risk AI systems must be transparent, allowing deployers to interpret outputs and use them appropriately. Technical documentation and instructions must be provided.', relevance: 'Transparency scoring in ETHOSAI directly measures compliance with this obligation.' },
  { id: 'art14', article: 'Article 14', title: 'Human Oversight', category: 'eu_ai_act', description: 'High-risk AI systems must allow human oversight, enabling natural persons to understand and monitor the AI output and intervene or stop the system.', relevance: 'Human oversight scoring evaluates compliance with this critical safeguard.' },
  { id: 'art29', article: 'Article 29', title: 'Obligations of Deployers', category: 'eu_ai_act', description: 'Deployers must use AI systems in accordance with the provider\'s instructions, ensure human oversight, monitor operation, and conduct fundamental rights impact assessments.', relevance: 'Organizations deploying AI systems must conduct FRIA — ETHOSAI facilitates this process.' },
  { id: 'art50', article: 'Article 50', title: 'Transparency Obligations for Limited-Risk AI', category: 'eu_ai_act', description: 'Limited-risk AI systems (chatbots, deepfakes) must inform users they are interacting with AI and disclose AI-generated content.', relevance: 'Applies to conversational AI, synthetic media, and recommendation systems.' },
];

const NDPA_2023 = [
  { id: 'ndpa-p1', article: 'Part I', title: 'Objectives and Application', category: 'ndpa_2023', description: 'Establishes the Nigeria Data Protection Act 2023 framework for protecting personal data of natural persons in Nigeria, including data processed by AI systems.', relevance: 'All AI systems processing personal data of Nigerian residents must comply with the NDPA 2023.' },
  { id: 'ndpa-p3', article: 'Part III', title: 'Lawful Basis for Processing', category: 'ndpa_2023', description: 'Personal data must be processed on a lawful basis: consent, contract, legal obligation, vital interests, public task, or legitimate interests. Automated decision-making must be disclosed.', relevance: 'AI systems must have a clear lawful basis for every data processing activity.' },
  { id: 'ndpa-s24', article: 'Section 24', title: 'Rights of Data Subjects', category: 'ndpa_2023', description: 'Data subjects have rights to: access their data, rectification, erasure, objection to automated decisions, restriction of processing, and data portability.', relevance: 'AI systems must support these rights, especially the right not to be subject to solely automated decisions.' },
  { id: 'ndpa-s30', article: 'Section 30', title: 'Data Protection Impact Assessment', category: 'ndpa_2023', description: 'A DPIA is mandatory when processing is likely to result in high risk to data subjects\' rights, including systematic automated processing, profiling, and large-scale processing of special category data.', relevance: 'AI systems conducting profiling or automated decision-making at scale must conduct a DPIA.' },
  { id: 'ndpa-s34', article: 'Section 34', title: 'Data Protection Officer', category: 'ndpa_2023', description: 'Organizations processing personal data at scale or processing special category data must appoint a Data Protection Officer (DPO) or engage a licensed Data Protection Compliance Organisation (DPCO).', relevance: 'AI developers and deployers may need to appoint a DPO depending on scale and sensitivity.' },
  { id: 'ndpa-s40', article: 'Section 40', title: 'Cross-border Data Transfers', category: 'ndpa_2023', description: 'Personal data may only be transferred outside Nigeria where the recipient country provides adequate protection or appropriate safeguards are in place.', relevance: 'AI systems using overseas cloud infrastructure or sharing data with foreign entities must comply with transfer requirements.' },
];

router.get('/', (req: Request, res: Response) => {
  const { category } = req.query;
  let resources = [...EU_AI_ACT, ...NDPA_2023];
  if (category === 'eu_ai_act') resources = EU_AI_ACT;
  if (category === 'ndpa_2023') resources = NDPA_2023;
  res.json(resources);
});

export default router;
