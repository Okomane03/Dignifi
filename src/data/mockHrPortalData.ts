import { HrReportCase, DepartmentMetric } from '../types/hrPortal';

export const INITIAL_HR_CASES: HrReportCase[] = [
  {
    id: 'DIG-KK8G-N5A9',
    trackingToken: 'DIG-KK8G-N5A9',
    title: 'Workplace conduct & unfair treatment report (Ref: DIG-KK8G-N5A9)',
    submissionTimestamp: '2026-10-30T10:15:00Z',
    incidentDate: '2026-10-29',
    incidentTime: '14:00',
    departmentContext: 'Operations & Engineering',
    locationMedium: 'On-site Office / Boardroom & Hybrid Call',
    categories: ['Bullying & Mobbing', 'Retaliation / Victimization', 'Hostile Environment'],
    isAnonymous: false,
    reporterIdentity: {
      name: 'Employee (Verified Dignifi User)',
      email: 'employee@organization.co.za',
      jobTitle: 'Staff Member'
    },
    originalSubmittedAccount: 'Documented and submitted directly via Dignifi Employee Vault with tracking token DIG-KK8G-N5A9. The incident records contemporaneous details regarding hostile workplace interactions, repeated undermining in team settings, and concerns regarding potential retaliation after raising operational questions. Logged in accordance with the 2022 Code of Good Practice on Harassment.',
    peopleInvolvedSummary: 'Documented by reporting employee; awaiting preliminary HR triage and intake assessment.',
    attachedEvidenceCount: 1,
    perceivedImpactSummary: 'High anxiety, stress, and professional concern regarding job security and team relations.',
    workflowStage: 'submitted',
    urgency: 'elevated',
    assignedOfficer: 'Thandiwe Khumalo (Senior ER Partner)',
    reviewDueDate: '2026-11-04',
    administrativeNotes: 'New encrypted report registered via Dignifi Employee Vault with Tracking Token DIG-KK8G-N5A9. Ready for preliminary intake and triage.',
    interventions: [],
    encryptedEmployeeNotes: [
      {
        timestamp: '2026-10-30T10:15:00Z',
        officer: 'Thandiwe Khumalo (Senior ER Partner)',
        message: 'Your report (Tracking Token: DIG-KK8G-N5A9) has been received in the HR portal for preliminary triage under the 2022 Harassment Code.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-kk8g-01',
        timestamp: '2026-10-30T10:15:00Z',
        performedBy: 'Dignifi Encrypted Bridge',
        action: 'Report Submitted to HR',
        details: 'Encrypted submission registered by employee with Tracking Token DIG-KK8G-N5A9.'
      }
    ]
  },
  {
    id: 'DIG-2026-7401',
    trackingToken: 'DIG-7401-K89W',
    title: 'Exclusion from project steering committee after compliance query',
    submissionTimestamp: '2026-10-24T16:45:00Z',
    incidentDate: '2026-10-17',
    incidentTime: '14:30',
    departmentContext: 'Engineering & Core Infrastructure',
    locationMedium: 'Remote Video Call (Microsoft Teams)',
    categories: ['Retaliation', 'Intimidation', 'Bullying'],
    isAnonymous: false,
    reporterIdentity: {
      name: 'Lesego K.',
      email: 'lesego.k@organization.co.za',
      jobTitle: 'Senior Systems Architect'
    },
    originalSubmittedAccount: 'During the quarterly systems sprint review on Teams with 8 attendees, I raised an operational compliance query regarding data backup protocols. The team director, Mark V., interrupted, raised his voice, and stated: "If you continue to question project governance, you will find yourself excluded from client meetings and off this team." He then muted my microphone on the call without explanation.',
    peopleInvolvedSummary: 'Mark V. (Engineering Director - Primary Actor), Sarah M. (Lead Systems Analyst - Witness)',
    attachedEvidenceCount: 2,
    perceivedImpactSummary: 'High anxiety, sleep disturbance, acute professional isolation following removal from 3 recurring client steering committee sessions.',
    workflowStage: 'action_planning',
    urgency: 'elevated',
    assignedOfficer: 'Thandiwe Khumalo (Senior ER Partner)',
    reviewDueDate: '2026-11-04',
    administrativeNotes: 'Preliminary assessment complete. Retaliation risk substantiated by calendar diffs. Interim protection placed on steering committee membership.',
    interventions: [
      {
        id: 'int-01',
        type: 'workplace_adjustment',
        title: 'Interim Committee Access Preservation',
        assignedTo: 'Thandiwe Khumalo',
        targetDate: '2026-10-26',
        status: 'completed',
        notes: 'Requested neutral calendar hold on steering committee changes pending formal inquiry.',
        loggedAt: '2026-10-25T11:00:00Z'
      },
      {
        id: 'int-02',
        type: 'support_counseling',
        title: 'Confidential EAP Psychological Support Referral',
        assignedTo: 'Life Employee Health Solutions',
        targetDate: '2026-10-28',
        status: 'completed',
        notes: 'Employee availed of 3 trauma debriefing sessions under confidential workplace EAP policy.',
        loggedAt: '2026-10-26T09:30:00Z'
      },
      {
        id: 'int-03',
        type: 'management_consultation',
        title: 'Executive Leadership Consultation & Harassment Code Review',
        assignedTo: 'Head of People & Culture',
        targetDate: '2026-11-02',
        status: 'in_progress',
        notes: 'Scheduled confidential briefing with Engineering VP regarding section 60 EEA liability risks.',
        loggedAt: '2026-10-28T14:15:00Z'
      }
    ],
    auditTrail: [
      {
        id: 'aud-01',
        timestamp: '2026-10-24T16:46:12Z',
        performedBy: 'System Encrypted Ingest',
        action: 'Report Received',
        details: 'Encrypted submission registered from authorized employee portal.'
      },
      {
        id: 'aud-02',
        timestamp: '2026-10-25T09:12:00Z',
        performedBy: 'Thandiwe Khumalo',
        action: 'Case Triage & Assignment',
        details: 'Assigned elevated urgency; preliminary review initiated under 2022 Harassment Code.'
      },
      {
        id: 'aud-03',
        timestamp: '2026-10-27T10:00:00Z',
        performedBy: 'Thandiwe Khumalo',
        action: 'Stage Progression',
        details: 'Transitioned from Assessment to Action Planning.'
      }
    ],
    encryptedEmployeeNotes: [
      {
        timestamp: '2026-10-25T09:20:00Z',
        officer: 'Thandiwe Khumalo (HR)',
        message: 'Thank you for submitting your structured documentation via Dignifi. Your report has been securely registered. We treat potential retaliation with utmost seriousness under the 2022 Harassment Code. We have placed an interim request to ensure your committee access remains undisturbed while we review this with confidentiality.'
      }
    ]
  },
  {
    id: 'DIG-2026-8924',
    trackingToken: 'DIG-8924-M42X',
    title: 'Repeated microaggressions regarding cultural expression in performance 1-on-1',
    submissionTimestamp: '2026-10-28T16:20:00Z',
    incidentDate: '2026-10-28',
    incidentTime: '11:00',
    departmentContext: 'Operations & Logistics',
    locationMedium: 'In-Person Meeting Room (4th Floor)',
    categories: ['Microaggression', 'Racial Discrimination'],
    isAnonymous: true,
    originalSubmittedAccount: 'During a scheduled quarterly check-in, supervisor made unsolicited personal comments about my cultural attire and accent, stating: "If you want to be taken seriously by senior leadership in Sandton, you should consider dressing more conventionally and toning down the cultural expressions." When I stated I was comfortable with professional standards, he sighed and said "I\'m just giving you friendly advice if you care about staying around."',
    peopleInvolvedSummary: 'Derek B. (Senior Manager - Primary Actor)',
    attachedEvidenceCount: 0,
    perceivedImpactSummary: 'Feeling cultural identity is policed as condition of advancement; veiled threat to tenure ("staying around").',
    workflowStage: 'initial_review',
    urgency: 'routine',
    assignedOfficer: 'Sipho Ndlovu (Employee Relations Advisor)',
    reviewDueDate: '2026-11-05',
    administrativeNotes: 'Anonymous report received with valid tracking token. Assessing whether pattern exists within 4th Floor Operations.',
    interventions: [
      {
        id: 'int-04',
        type: 'policy_review',
        title: 'Operations Diversity & Dress Code Policy Circular',
        assignedTo: 'Sipho Ndlovu',
        targetDate: '2026-11-08',
        status: 'planned',
        notes: 'Prepare cross-departmental reminder regarding Employment Equity Act protections against cultural and linguistic stereotyping.',
        loggedAt: '2026-10-29T10:00:00Z'
      }
    ],
    auditTrail: [
      {
        id: 'aud-04',
        timestamp: '2026-10-28T16:21:00Z',
        performedBy: 'System Encrypted Ingest',
        action: 'Report Received',
        details: 'Anonymous submission logged with tracking token DIG-8924-M42X.'
      },
      {
        id: 'aud-05',
        timestamp: '2026-10-29T08:45:00Z',
        performedBy: 'Sipho Ndlovu',
        action: 'Initial Review Opened',
        details: 'Reviewing historical departmental climate metrics.'
      }
    ],
    encryptedEmployeeNotes: [
      {
        timestamp: '2026-10-29T09:00:00Z',
        officer: 'Sipho Ndlovu (HR)',
        message: 'Your anonymous report has been received. Your privacy is fully preserved. We are examining operational climate patterns in this unit while safeguarding your confidentiality.'
      }
    ]
  },
  {
    id: 'DIG-2026-9102',
    trackingToken: 'DIG-9102-S77Q',
    title: 'Unwelcome after-hours remarks and quid-pro-quo promotion intimations',
    submissionTimestamp: '2026-10-29T11:10:00Z',
    incidentDate: '2026-10-27',
    incidentTime: '19:45',
    departmentContext: 'Sales & Client Solutions',
    locationMedium: 'Offsite Client Dinner / Private Transportation',
    categories: ['Sexual Harassment', 'Intimidation'],
    isAnonymous: false,
    reporterIdentity: {
      name: 'Naledi M.',
      email: 'naledi.m@organization.co.za',
      jobTitle: 'Key Account Executive'
    },
    originalSubmittedAccount: 'Following the client gala dinner, regional head insisted on sharing private transport and repeatedly touched my hand and arm, suggesting that "my fast-track promotion to regional director would be virtually guaranteed if we spent more private time together outside the office." When I pulled away and stated this was inappropriate, he commented: "Don\'t act naive; everyone knows how deals get signed in this industry."',
    peopleInvolvedSummary: 'Craig P. (Regional Sales Head - Primary Actor)',
    attachedEvidenceCount: 3,
    perceivedImpactSummary: 'Severe emotional trauma, nausea, dread regarding mandatory regional sales summits, fear of career derailment if rebuffed.',
    workflowStage: 'investigation_referral',
    urgency: 'critical_safety',
    assignedOfficer: 'Thandiwe Khumalo & Legal Counsel',
    reviewDueDate: '2026-10-31',
    administrativeNotes: 'High-severity sexual harassment allegation under Item 5 of 2022 Harassment Code. Immediate independent advocate appointed. Direct reporting line severed pending investigation.',
    interventions: [
      {
        id: 'int-05',
        type: 'workplace_adjustment',
        title: 'Immediate Reporting Line Severance & Travel Freeze',
        assignedTo: 'Chief People Officer',
        targetDate: '2026-10-29',
        status: 'completed',
        notes: 'Complainant reassigned to report directly to National Commercial Director; all shared offsite travel suspended.',
        loggedAt: '2026-10-29T12:30:00Z'
      },
      {
        id: 'int-06',
        type: 'formal_investigation',
        title: 'Appointment of External Independent Legal Investigator',
        assignedTo: 'Advocate J. Mthembu (Independent Bar)',
        targetDate: '2026-11-06',
        status: 'in_progress',
        notes: 'Appointed independent external practitioner to preserve impartiality under EEA Item 8.',
        loggedAt: '2026-10-29T15:00:00Z'
      }
    ],
    auditTrail: [
      {
        id: 'aud-06',
        timestamp: '2026-10-29T11:12:00Z',
        performedBy: 'System Encrypted Ingest',
        action: 'Report Received',
        details: 'Critical safety report routed to Senior ER Lead with expedited SLA.'
      },
      {
        id: 'aud-07',
        timestamp: '2026-10-29T12:00:00Z',
        performedBy: 'Thandiwe Khumalo',
        action: 'Urgent Intervention Enacted',
        details: 'Emergency safety and reporting adjustments enacted.'
      }
    ],
    encryptedEmployeeNotes: [
      {
        timestamp: '2026-10-29T12:35:00Z',
        officer: 'Thandiwe Khumalo (HR)',
        message: 'Your safety and professional dignity are our highest priority. We have immediately decoupled your reporting line and travel schedules so you do not have to interact with Craig P. An independent legal investigator has been engaged to conduct an impartial inquiry under complete confidentiality.'
      }
    ]
  },
  {
    id: 'DIG-2026-6310',
    trackingToken: 'DIG-6310-W18F',
    title: 'Directive to sign off uninspected equipment safety certification',
    submissionTimestamp: '2026-10-15T09:30:00Z',
    incidentDate: '2026-10-14',
    incidentTime: '16:00',
    departmentContext: 'Mining & Heavy Infrastructure',
    locationMedium: 'Physical Operational Site (Rustenburg Hub)',
    categories: ['Unlawful Directive', 'Retaliation', 'Intimidation'],
    isAnonymous: false,
    reporterIdentity: {
      name: 'Bongani Z.',
      email: 'bongani.z@organization.co.za',
      jobTitle: 'Site Safety Inspector'
    },
    originalSubmittedAccount: 'Plant manager instructed me in writing to issue compliance sign-offs on three hydraulic drill units that had not undergone compulsory statutory load testing, citing export deadlines. When I refused, he threatened that "troublemaking safety inspectors don\'t last their probation in this region."',
    peopleInvolvedSummary: 'Gert V. (Site Operations Manager)',
    attachedEvidenceCount: 4,
    perceivedImpactSummary: 'Stress over criminal liability under Mine Health and Safety Act; fear of termination.',
    workflowStage: 'follow_up',
    urgency: 'elevated',
    assignedOfficer: 'Compliance & Safety Lead',
    reviewDueDate: '2026-11-10',
    administrativeNotes: 'Whistleblower protected disclosure under Protected Disclosures Act 26 of 2000. Statutory audit conducted; equipment grounded. Employee probation confirmed with neutral review panel.',
    interventions: [
      {
        id: 'int-07',
        type: 'policy_review',
        title: 'Statutory Safety Audit & Grounding of Uninspected Units',
        assignedTo: 'Chief Safety Officer',
        targetDate: '2026-10-18',
        status: 'completed',
        notes: 'Units grounded until verified inspection completed. Formal notice issued under MHSA.',
        loggedAt: '2026-10-16T11:00:00Z'
      },
      {
        id: 'int-08',
        type: 'workplace_adjustment',
        title: 'Probation Confirmation & Anti-Retaliation Protection Order',
        assignedTo: 'Senior HR Director',
        targetDate: '2026-10-22',
        status: 'completed',
        notes: 'Probation confirmed based on objective competency review; plant manager cautioned under PDA.',
        loggedAt: '2026-10-22T14:00:00Z'
      }
    ],
    auditTrail: [
      {
        id: 'aud-08',
        timestamp: '2026-10-15T09:35:00Z',
        performedBy: 'System Encrypted Ingest',
        action: 'Protected Disclosure Logged',
        details: 'Whistleblower disclosure recorded with statutory protections.'
      },
      {
        id: 'aud-09',
        timestamp: '2026-10-23T10:00:00Z',
        performedBy: 'Compliance Officer',
        action: 'Transitioned to Follow-Up',
        details: 'Safety corrective actions completed; monitoring employee for any occupational detriment.'
      }
    ],
    encryptedEmployeeNotes: [
      {
        timestamp: '2026-10-22T15:00:00Z',
        officer: 'Senior HR Director',
        message: 'Your disclosure is confirmed as a Protected Disclosure under Act 26 of 2000. Your probation has been successfully signed off by an independent technical committee. The uninspected units were grounded and remediated. We are monitoring your workplace environment continuously to guarantee zero occupational detriment.'
      }
    ]
  },
  {
    id: 'DIG-2026-5044',
    trackingToken: 'DIG-5044-D31C',
    title: 'Derogatory ethnic remarks in shared financial communications channel',
    submissionTimestamp: '2026-09-20T14:15:00Z',
    incidentDate: '2026-09-19',
    incidentTime: '15:20',
    departmentContext: 'Finance & Accounting',
    locationMedium: 'Written Channel (Slack Public Channel)',
    categories: ['Racial Discrimination', 'Bullying'],
    isAnonymous: false,
    reporterIdentity: {
      name: 'Farai N.',
      email: 'farai.n@organization.co.za',
      jobTitle: 'Financial Analyst'
    },
    originalSubmittedAccount: 'In an open department channel regarding month-end ledger audits, senior partner mocked my country of origin and accented financial notations, posting demeaning memes implying foreign analysts were incompetent.',
    peopleInvolvedSummary: 'Johan K. (Senior Partner)',
    attachedEvidenceCount: 2,
    perceivedImpactSummary: 'Public humiliation in front of 24 colleagues, reluctance to post audit discrepancies.',
    workflowStage: 'administratively_closed',
    urgency: 'routine',
    assignedOfficer: 'Thandiwe Khumalo',
    reviewDueDate: '2026-10-15',
    administrativeNotes: 'Formal grievance conciliation completed. Written apology issued to channel, disciplinary counseling recorded on manager file, mandatory anti-discrimination workshop completed for department.',
    interventions: [
      {
        id: 'int-09',
        type: 'training',
        title: 'Departmental Harassment & Diversity Workshop (EEA Code 2022)',
        assignedTo: 'External Facilitator',
        targetDate: '2026-10-05',
        status: 'completed',
        notes: 'Mandatory workshop for all Finance leadership completed with 100% attendance.',
        loggedAt: '2026-09-25T11:00:00Z'
      }
    ],
    auditTrail: [
      {
        id: 'aud-10',
        timestamp: '2026-09-20T14:20:00Z',
        performedBy: 'System Encrypted Ingest',
        action: 'Report Received',
        details: 'Report registered.'
      },
      {
        id: 'aud-11',
        timestamp: '2026-10-15T16:00:00Z',
        performedBy: 'Thandiwe Khumalo',
        action: 'Administrative Closure',
        details: 'All agreed remedial and training actions completed; complainant confirmed satisfaction with resolution.'
      }
    ],
    encryptedEmployeeNotes: [
      {
        timestamp: '2026-10-15T16:15:00Z',
        officer: 'Thandiwe Khumalo (HR)',
        message: 'Following the completed mediation, written apology, and leadership training session, this matter has been administratively concluded with mutual consent. Your records remain permanently accessible to you under reference DIG-5044-D31C.'
      }
    ]
  }
];

export const DEPARTMENT_METRICS_DATA: DepartmentMetric[] = [
  {
    department: 'Engineering & Infrastructure',
    reportCount: 6,
    openCount: 2,
    closedCount: 4,
    topCategory: 'Bullying & Retaliation',
    trustIndexNote: 'High reporting driven by tech team psychological safety'
  },
  {
    department: 'Sales & Client Solutions',
    reportCount: 5,
    openCount: 2,
    closedCount: 3,
    topCategory: 'Sexual Harassment & Quid Pro Quo',
    trustIndexNote: 'Offsite & after-hours client dinner exposure'
  },
  {
    department: 'Operations & Logistics',
    reportCount: 4,
    openCount: 2,
    closedCount: 2,
    topCategory: 'Microaggressions & Cultural Bias',
    trustIndexNote: 'Supervisory communication style assessments underway'
  },
  {
    department: 'Mining & Heavy Plant',
    reportCount: 3,
    openCount: 1,
    closedCount: 2,
    topCategory: 'Unlawful Directives / Whistleblower',
    trustIndexNote: 'Direct correlation with safety compliance audits'
  },
  {
    department: 'Finance & Administration',
    reportCount: 2,
    openCount: 0,
    closedCount: 2,
    topCategory: 'Racial Discrimination',
    trustIndexNote: 'Remediated with departmental workshop'
  }
];

export const MONTHLY_TREND_DATA = [
  { month: 'Nov 2025', count: 1 },
  { month: 'Dec 2025', count: 1 },
  { month: 'Jan 2026', count: 2 },
  { month: 'Feb 2026', count: 3 },
  { month: 'Mar 2026', count: 2 },
  { month: 'Apr 2026', count: 4 },
  { month: 'May 2026', count: 3 },
  { month: 'Jun 2026', count: 5 },
  { month: 'Jul 2026', count: 4 },
  { month: 'Aug 2026', count: 6 },
  { month: 'Sep 2026', count: 4 },
  { month: 'Oct 2026', count: 7 },
];

export const CATEGORY_BREAKDOWN_DATA = [
  { category: 'Bullying & Mobbing', count: 8, percentage: 28 },
  { category: 'Retaliation / Victimisation', count: 6, percentage: 21 },
  { category: 'Sexual Harassment', count: 5, percentage: 17 },
  { category: 'Racial & Cultural Bias', count: 4, percentage: 14 },
  { category: 'Microaggressions', count: 3, percentage: 10 },
  { category: 'Unlawful Directive', count: 3, percentage: 10 },
];
