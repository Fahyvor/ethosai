import bcrypt from 'bcryptjs';
import prisma from './prisma.js';

export async function seedDatabase() {
  console.log('[ETHOSAI Seed] Checking / seeding database with portfolio demo data...');

  const existingUser = await prisma.user.findUnique({
    where: { email: 'assessor@ethosai.gov' },
  });

  let userId: string;

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('governance123', 10);
    const demoUser = await prisma.user.create({
      data: {
        id: 'user-demo-assessor-001',
        name: 'Dr. Alex Vance',
        email: 'assessor@ethosai.gov',
        password: hashedPassword,
        organization: 'Ethical AI Oversight Institute',
        role: 'assessor',
      },
    });
    userId = demoUser.id;
    console.log(`[ETHOSAI Seed] Created demo assessor account: ${demoUser.email}`);
  } else {
    userId = existingUser.id;
    console.log(`[ETHOSAI Seed] Demo user already exists: ${existingUser.email}`);
  }

  // Check if AI systems exist
  const existingSystems = await prisma.aISystem.count({
    where: { registeredById: userId },
  });

  if (existingSystems === 0) {
    console.log('[ETHOSAI Seed] Creating sample portfolio AI systems...');

    // System 1: HR AI System
    const hrSystem = await prisma.aISystem.create({
      data: {
        id: 'sys-talent-scout-001',
        name: 'TalentScout Pro AI',
        description: 'Automated resume parsing, candidate scoring, and video interview sentiment analysis system used in talent acquisition.',
        purpose: 'Pre-employment candidate screening and workflow prioritization',
        domain: 'hr',
        deploymentContext: 'Enterprise cloud deployment across European and Nigerian subsidiary entities',
        dataTypesUsed: JSON.stringify(['Applicant CVs', 'Employment History', 'Video Interview Recordings', 'Salary Expectations']),
        isAutonomous: false,
        humanOversightLevel: 'moderate',
        trainingDataDescription: 'Historical hiring records from 2018-2023 with diversity auditing',
        vendor: 'TalentSphere Technologies Inc.',
        riskCategory: 'high',
        status: 'assessed',
        registeredById: userId,
      },
    });

    // System 2: Healthcare Diagnostic
    const healthSystem = await prisma.aISystem.create({
      data: {
        id: 'sys-clinical-pulse-002',
        name: 'ClinicalPulse Diagnostics',
        description: 'Deep learning radiology triaging assistant for emergency department computed tomography (CT) scans.',
        purpose: 'Early acute trauma detection and radiologist worklist prioritization',
        domain: 'healthcare',
        deploymentContext: 'On-premises hospital radiology PACS infrastructure',
        dataTypesUsed: JSON.stringify(['DICOM Imaging', 'Patient Age and Gender', 'Emergency Admission Triage Notes']),
        isAutonomous: false,
        humanOversightLevel: 'full',
        trainingDataDescription: '120,000 multi-center annotated thoracic and cranial CT studies',
        vendor: 'MedVision BioHealth Solutions',
        riskCategory: 'high',
        status: 'assessed',
        registeredById: userId,
      },
    });

    // System 3: FinTech Fraud Guard
    const financeSystem = await prisma.aISystem.create({
      data: {
        id: 'sys-fraud-guard-003',
        name: 'FraudGuard Neural Engine',
        description: 'High-frequency banking transaction anomaly detection and suspicious activity reporting engine.',
        purpose: 'Real-time payment fraud prevention and regulatory AML screening',
        domain: 'finance',
        deploymentContext: 'Core fintech banking payment rail processing microservices',
        dataTypesUsed: JSON.stringify(['Transaction Metadata', 'Device Geolocation', 'Historical Account Velocity']),
        isAutonomous: true,
        humanOversightLevel: 'minimal',
        trainingDataDescription: '10M+ anonymized banking transactions across retail customer accounts',
        vendor: 'SecurePay FinTech Ltd.',
        riskCategory: 'limited',
        status: 'assessed',
        registeredById: userId,
      },
    });

    // Create Sample Assessment for TalentScout Pro AI
    const assessment1 = await prisma.assessment.create({
      data: {
        id: 'assess-talent-scout-001',
        aiSystemId: hrSystem.id,
        assessorId: userId,
        status: 'completed',
        transparencyScore: 68,
        biasScore: 62,
        privacyScore: 74,
        humanOversightScore: 78,
        dataQualityScore: 70,
        overallRiskScore: 68,
        riskLevel: 'high',
        findings: JSON.stringify([
          'Potential adverse impact detected on gender sub-groups in technical keyword extraction.',
          'Automated scoring weights are partially opaque to job candidates without explicit score breakdown.',
          'Adequate human-in-the-loop review mechanisms exist for candidate rejection appeals.',
        ]),
        recommendations: JSON.stringify([
          {
            category: 'Bias Mitigation',
            priority: 'high',
            description: 'Conduct counterfactual fairness evaluations across gender and demographic cohorts before model updates.',
            regulatoryReference: 'EU AI Act Art. 10 — Data and Data Governance',
            mitigationMeasure: 'Retrain candidate evaluation layers using demographically balanced synthetic benchmarks.',
          },
          {
            category: 'Transparency',
            priority: 'high',
            description: 'Provide applicants with clear, plain-language disclosure of automated scoring factors.',
            regulatoryReference: 'EU AI Act Art. 13 — Transparency and Information Provision',
            mitigationMeasure: 'Deploy candidate explanation modal in candidate portal before submission.',
          },
          {
            category: 'Data Protection',
            priority: 'medium',
            description: 'Complete mandatory Data Protection Impact Assessment (DPIA) under NDPA Section 30.',
            regulatoryReference: 'NDPA 2023 s.30 — Data Protection Impact Assessment',
            mitigationMeasure: 'Document automated decision-making lawful basis and DPIA register.',
          },
        ]),
        regulatoryReferences: JSON.stringify([
          'EU AI Act Art. 6 — Classification of High-Risk AI Systems',
          'EU AI Act Art. 9 — Risk Management System',
          'EU AI Act Art. 10 — Data and Data Governance',
          'EU AI Act Art. 13 — Transparency',
          'EU AI Act Art. 14 — Human Oversight',
          'NDPA 2023 Part III — Lawful Basis for Processing',
          'NDPA 2023 s.24 — Rights of Data Subjects',
          'NDPA 2023 s.30 — Data Protection Impact Assessment',
        ]),
        assessmentData: JSON.stringify({
          notes: 'Conducted comprehensive audit against EU AI Act Annex III high-risk employment criteria and NDPA 2023 principles.',
        }),
      },
    });

    // Create Sample Assessment for ClinicalPulse Diagnostics
    await prisma.assessment.create({
      data: {
        id: 'assess-clinical-pulse-002',
        aiSystemId: healthSystem.id,
        assessorId: userId,
        status: 'completed',
        transparencyScore: 82,
        biasScore: 78,
        privacyScore: 88,
        humanOversightScore: 92,
        dataQualityScore: 85,
        overallRiskScore: 35,
        riskLevel: 'high',
        findings: JSON.stringify([
          'Full radiologist-in-the-loop oversight enforced before any diagnostic recommendation is recorded.',
          'High compliance with medical data privacy protocols (NDPA 2023 & GDPR Health Data).',
          'Continuous drift monitoring in place for new imaging machines and resolution changes.',
        ]),
        recommendations: JSON.stringify([
          {
            category: 'Continuous Monitoring',
            priority: 'medium',
            description: 'Maintain periodic recalibration logs across newly installed CT scanner models.',
            regulatoryReference: 'EU AI Act Art. 9 — Risk Management System',
            mitigationMeasure: 'Establish bi-monthly radiological calibration checks.',
          },
        ]),
        regulatoryReferences: JSON.stringify([
          'EU AI Act Art. 6 — Classification of High-Risk AI Systems',
          'EU AI Act Art. 14 — Human Oversight',
          'NDPA 2023 s.30 — Data Protection Impact Assessment',
        ]),
        assessmentData: JSON.stringify({
          notes: 'Full radiological clinical validation study review completed.',
        }),
      },
    });

    // Create Sample Report for TalentScout Pro AI
    await prisma.report.create({
      data: {
        id: 'rep-talent-scout-001',
        assessmentId: assessment1.id,
        generatedById: userId,
        title: 'ETHOSAI Governance Report - TalentScout Pro AI',
        status: 'ready',
      },
    });

    console.log('[ETHOSAI Seed] Sample portfolio systems, assessments, and reports created successfully!');
  }
}

export default seedDatabase;
