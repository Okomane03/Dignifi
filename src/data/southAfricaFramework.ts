export interface LegalPathway {
  id: string;
  title: string;
  subtitle: string;
  legislation: string;
  timeLimit: string;
  whoItAppliesTo: string;
  description: string;
  stepByStep: string[];
  keyConsiderations: string[];
  ccmaFormRequired?: string;
  isExternalStatutory: boolean;
}

export const SOUTH_AFRICA_PATHWAYS: LegalPathway[] = [
  {
    id: 'internal_grievance',
    title: 'Formal Internal Grievance',
    subtitle: 'Invoking Company Harassment & Grievance Policy',
    legislation: 'Employment Equity Act (EEA) Code of Good Practice (2022) Item 8',
    timeLimit: 'According to internal workplace policy (typically within 30–90 days)',
    whoItAppliesTo: 'Any employee wishing for their employer to formally investigate and take corrective disciplinary steps.',
    description: 'Under the 2022 Code of Good Practice on Prevention and Elimination of Harassment, employers must provide clear, confidential, and prompt internal procedures. Submitting your Dignifi dossier triggers the employer\'s statutory duty under Section 60 of the EEA to take all reasonable steps to eliminate the conduct.',
    stepByStep: [
      'Export or share your encrypted Dignifi incident record or summary with your designated HR Officer or Harassment Contact.',
      'Request written acknowledgment of receipt within 3–5 working days.',
      'HR conducts preliminary inquiry and determines appropriate action (informal conciliation or formal disciplinary hearing).',
      'The complainant is entitled to representation by a trade union representative or trusted colleague.',
      'Employer must ensure complainant is protected against retaliation or victimization.'
    ],
    keyConsiderations: [
      'You are not required to face the alleged perpetrator directly if doing so causes psychological distress.',
      'If the employer fails to take necessary steps after receiving notice, the employer may become vicariously liable for damages under Section 60 of the EEA.'
    ],
    isExternalStatutory: false
  },
  {
    id: 'ccma_harassment_discrimination',
    title: 'CCMA Referral: Unfair Discrimination / Harassment',
    subtitle: 'Section 10 of the Employment Equity Act',
    legislation: 'Employment Equity Act No. 55 of 1998 (EEA) Section 6 & 10',
    timeLimit: 'Within 6 months of the act or omission (or within a reasonable period if condonation is granted)',
    whoItAppliesTo: 'Employees subjected to harassment (sexual, racial, bullying, ethnic, or other prohibited grounds) where internal steps failed or were unsafe.',
    description: 'Harassment is recognized as a direct form of unfair discrimination under South African law. Employees can refer a dispute to the Commission for Conciliation, Mediation and Arbitration (CCMA) or an applicable Bargaining Council.',
    stepByStep: [
      'Complete CCMA Form 7.11 ("Referring a Dispute to the CCMA for Conciliation"). Dignifi generates this referral draft for you.',
      'Attach your contemporaneous Dignifi timeline, dates, witnesses, and impact statements as an evidentiary annexure.',
      'Serve a copy of Form 7.11 on your employer (via registered email, fax, or personal delivery with proof of service).',
      'Lodge Form 7.11 and proof of service with your provincial CCMA regional office.',
      'Attend CCMA conciliation hearing (typically scheduled within 30 days of receipt).'
    ],
    keyConsiderations: [
      'Conciliation is a confidential, without-prejudice process assisted by a neutral CCMA commissioner.',
      'If conciliation does not resolve the dispute, the commissioner issues a certificate of non-resolution, entitling referral to arbitration or the Labour Court.'
    ],
    ccmaFormRequired: 'CCMA Form 7.11 (Section 10 EEA)',
    isExternalStatutory: true
  },
  {
    id: 'ccma_constructive_dismissal',
    title: 'CCMA Referral: Constructive Dismissal',
    subtitle: 'Section 186(1)(e) of the Labour Relations Act',
    legislation: 'Labour Relations Act No. 66 of 1995 (LRA) Section 186(1)(e)',
    timeLimit: 'Strict 30 days from the date of resignation',
    whoItAppliesTo: 'Employees who felt compelled to resign because the employer made continued employment intolerable.',
    description: 'Constructive dismissal occurs when an employee terminates the employment contract because the employer deliberately created or permitted an unbearable, hostile work environment (e.g., severe unaddressed bullying or retaliation).',
    stepByStep: [
      'Establish that continued employment was genuinely intolerable and that resignation was the measure of last resort.',
      'Ensure clear written evidence that you previously notified the employer of the misconduct (your Dignifi records provide proof of contemporaneous notice).',
      'Serve and lodge CCMA Form 7.11 within 30 calendar days of your resignation.',
      'Seek conciliation and, if unresolved, referral to formal arbitration for compensation or reinstatement.'
    ],
    keyConsiderations: [
      'The legal bar is high: the employee bears the onus of proving that working conditions were truly intolerable and that all reasonable alternatives were exhausted.',
      'Always seek advice from a labour attorney, union representative, or Legal Aid before resigning.'
    ],
    ccmaFormRequired: 'CCMA Form 7.11 (Section 186(1)(e) LRA)',
    isExternalStatutory: true
  },
  {
    id: 'protection_order',
    title: 'Protection from Harassment Order',
    subtitle: 'Magistrate\'s Court Protection Order',
    legislation: 'Protection from Harassment Act No. 17 of 2011',
    timeLimit: 'Any time while harassment is occurring or reasonably feared',
    whoItAppliesTo: 'Individuals experiencing ongoing stalking, intimidation, cyber-bullying, or physical harassment by a colleague or superior.',
    description: 'You can apply for an interim protection order at your nearest Magistrate\'s Court directly against the perpetrator, independently of your employer\'s grievance process or employment contract.',
    stepByStep: [
      'Visit the Clerk of the Court at your local Magistrate\'s Court.',
      'Complete Form 2 (Application for Protection Order) attaching your Dignifi timeline and digital communications.',
      'A magistrate can issue an immediate Interim Protection Order without notifying the respondent if urgent danger exists.',
      'A sheriff serves the interim order with a return date for a final hearing.',
      'Breaching a protection order is a criminal offence resulting in immediate police arrest.'
    ],
    keyConsiderations: [
      'This process operates in criminal/civil magistrates courts and does not depend on employer cooperation.',
      'No legal representation is required to apply, and court clerks are mandated to assist complainants.'
    ],
    isExternalStatutory: true
  },
  {
    id: 'protected_disclosures',
    title: 'Whistleblower Protection',
    subtitle: 'Protected Disclosures Act',
    legislation: 'Protected Disclosures Act No. 26 of 2000 (PDA)',
    timeLimit: 'Protection applies contemporaneously and retrospectively',
    whoItAppliesTo: 'Employees who disclose criminal conduct, unlawful directives, health/safety dangers, or systemic discrimination.',
    description: 'The PDA protects employees against any \'occupational detriment\' (disciplinary action, dismissal, suspension, demotion, harassment, or intimidation) following a good-faith disclosure.',
    stepByStep: [
      'Ensure your disclosure relates to an unlawful act, health danger, or failure to comply with legal obligations.',
      'Disclose through internal workplace compliance lines, legal counsel, or designated bodies (Public Protector, Auditor-General).',
      'Document every subsequent workplace change in Dignifi to detect retaliation patterns immediately.',
      'If occupational detriment occurs, refer an urgent dispute to the CCMA or Labour Court under Section 187(1)(h) of the LRA.'
    ],
    keyConsiderations: [
      'Retaliation dismissals under the PDA constitute Automatically Unfair Dismissals, carrying up to 24 months\' compensation.'
    ],
    isExternalStatutory: true
  }
];

export interface SupportResource {
  id: string;
  name: string;
  category: 'mental_health' | 'gbv_crisis' | 'legal_aid' | 'labour_statutory';
  contactPhone: string;
  alternateContact?: string;
  operatingHours: string;
  cost: string;
  description: string;
}

export const SOUTH_AFRICA_SUPPORT_RESOURCES: SupportResource[] = [
  {
    id: 'sadag_hotline',
    name: 'SADAG Mental Health Helpline',
    category: 'mental_health',
    contactPhone: '0800 456 789',
    alternateContact: 'SMS 31393 or WhatsApp 076 882 2775',
    operatingHours: '24 Hours / 7 Days a week',
    cost: 'Free toll-free service',
    description: 'South African Depression and Anxiety Group provides immediate trauma debriefing, psychological crisis support, and workplace stress counseling.'
  },
  {
    id: 'gbv_command_centre',
    name: 'National GBV Command Centre',
    category: 'gbv_crisis',
    contactPhone: '0800 428 428',
    alternateContact: 'Please Call Me: *120*7867# or Skype: Helpme GBV',
    operatingHours: '24 Hours / 365 Days',
    cost: 'Free national toll-free service',
    description: 'Run by the Department of Social Development with social workers providing real-time psychological support and dispatch to SAPS or safe shelters for gender-based misconduct.'
  },
  {
    id: 'tears_foundation',
    name: 'TEARS Foundation (GBV & Sexual Harassment)',
    category: 'gbv_crisis',
    contactPhone: '010 590 5920',
    alternateContact: 'Free USSD: *134*7355#',
    operatingHours: '24/7 Assistance',
    cost: 'Free via USSD',
    description: 'Immediate nationwide assistance, crisis intervention, forensic medical advice, and safe counseling for victims of sexual harassment and gender-based violence.'
  },
  {
    id: 'ccma_national',
    name: 'CCMA National Dispute Call Centre',
    category: 'labour_statutory',
    contactPhone: '0861 16 16 16',
    alternateContact: 'info@ccma.org.za · www.ccma.org.za',
    operatingHours: 'Mon - Fri: 08:30 - 16:30',
    cost: 'Standard call rates (Lodging disputes is free)',
    description: 'Statutory dispute resolution body for South African labour disputes, offering free conciliation, arbitration, and downloadable Form 7.11 advice.'
  },
  {
    id: 'legal_aid_sa',
    name: 'Legal Aid South Africa Advice Line',
    category: 'legal_aid',
    contactPhone: '0800 110 110',
    alternateContact: 'Please Call Me: 079 835 7179',
    operatingHours: 'Mon - Fri: 07:00 - 19:00',
    cost: 'Free toll-free consultation',
    description: 'Provides free legal guidance on unfair dismissal, discrimination, employment contracts, and statutory court representations for qualifying workers.'
  },
  {
    id: 'sahrc_office',
    name: 'South African Human Rights Commission (SAHRC)',
    category: 'labour_statutory',
    contactPhone: '011 877 3600',
    alternateContact: 'complaints@sahrc.org.za',
    operatingHours: 'Mon - Fri: 08:30 - 16:30',
    cost: 'Free statutory complaints',
    description: 'Constitutional body investigating systemic discrimination, hate speech, racial or gender harassment, and gross workplace dignity violations.'
  }
];
