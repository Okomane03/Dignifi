import { IncidentRecord } from '../types/incident';

export const INITIAL_MOCK_INCIDENTS: IncidentRecord[] = [
  {
    id: 'DIG-KK8G-N5A9',
    title: 'Workplace conduct & unfair treatment report (Ref: DIG-KK8G-N5A9)',
    createdAt: '2026-10-30T10:15:00Z',
    updatedAt: '2026-10-30T10:15:00Z',
    incidentDate: '2026-10-29',
    incidentTime: '14:00',
    locationType: 'in-person-office',
    locationDetails: 'Boardroom 4B & Teams Hybrid Call',
    categories: ['bullying', 'retaliation', 'general_harassment'],
    contemporaneousNarrative: 'Documented and submitted directly via Dignifi Employee Vault with tracking token DIG-KK8G-N5A9. The incident records contemporaneous details regarding hostile workplace interactions, repeated undermining in team settings, and concerns regarding potential retaliation after raising operational questions.',
    subsequentNotes: [
      {
        id: 'note-kk8g-01',
        timestamp: '2026-10-30T10:20:00Z',
        authorLabel: 'Employee Observation',
        content: 'Report formally transmitted to HR Case Portal under tracking reference DIG-KK8G-N5A9.',
        noteType: 'additional_recollection'
      }
    ],
    reflectionResponses: [
      {
        promptId: 'prompt_recurrence',
        question: 'Has a similar interaction or atmosphere occurred before with the same person, group, or setting?',
        answer: 'Yes, subtle undermining and exclusionary behavior has been recurring over the past several team cycles.',
        answeredAt: '2026-10-30T10:16:00Z'
      }
    ],
    peopleInvolved: [
      {
        id: 'p-kk8g-01',
        nameOrRole: 'Operations & Engineering Lead',
        roleInIncident: 'primary_actor',
        department: 'Operations & Engineering',
        approximateSeniority: 'senior_executive'
      }
    ],
    perceivedImpact: {
      psychologicalSafety: 'High anxiety and stress regarding job security and team relations.',
      professionalImpact: 'Repeated exclusion impacting workflow deliverable reviews.',
      physicalWellbeing: 'Headaches and sleep disruption.',
      severityScore: 4
    },
    evidenceItems: [
      {
        id: 'ev-kk8g-01',
        title: 'Meeting Notes & Email Thread',
        type: 'email',
        dateAttached: '2026-10-29',
        summary: 'Documentation of operational query and hostile response.',
        fileReferenceName: 'email_exchange_oct29.pdf',
        tamperChecksum: 'a8f9c1e2...55b2'
      }
    ],
    status: 'submitted_to_hr',
    cryptographicHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    isEncryptedInVault: true,
    hrCaseDetails: {
      submittedAt: '2026-10-30T10:15:00Z',
      isAnonymous: false,
      trackingToken: 'DIG-KK8G-N5A9',
      assignedOfficer: 'Thandiwe Khumalo (Senior Employee Relations)',
      urgency: 'elevated',
      hrStatus: 'received',
      hrActionLogs: [
        {
          timestamp: '2026-10-30T10:15:00Z',
          actionBy: 'Dignifi Encrypted Bridge',
          actionDescription: 'Encrypted report registered in HR Case Portal with Tracking Token DIG-KK8G-N5A9.',
          isSharedWithEmployee: true
        }
      ],
      secureNotesToEmployee: [
        {
          timestamp: '2026-10-30T10:15:00Z',
          officer: 'HR Employee Relations Officer',
          message: 'Your report (Tracking Token: DIG-KK8G-N5A9) has been received in the HR portal for preliminary triage under the 2022 Harassment Code.'
        }
      ]
    }
  },
  {
    id: 'INC-2026-7401',
    title: 'Exclusion from project committee following safety query',
    createdAt: '2026-10-18T10:14:22Z',
    updatedAt: '2026-10-24T16:45:00Z',
    incidentDate: '2026-10-17',
    incidentTime: '14:30',
    locationType: 'remote-video-call',
    locationDetails: 'Microsoft Teams Sprint Architecture Catch-up',
    categories: ['retaliation', 'intimidation', 'bullying'],
    contemporaneousNarrative: 'During the quarterly systems sprint review on Teams with 8 attendees, I raised an operational compliance query regarding data backup protocols. The team director, Mark V., interrupted, raised his voice, and stated: "If you continue to question project governance, you will find yourself excluded from client meetings and off this team." He then muted my microphone on the call without explanation.',
    subsequentNotes: [
      {
        id: 'note-01',
        timestamp: '2026-10-20T08:30:00Z',
        authorLabel: 'Employee Note',
        content: 'Received calendar invite updates for the November steering committee; my name has indeed been removed from all 3 recurring client sessions.',
        noteType: 'retaliatory_aftermath'
      },
      {
        id: 'note-02',
        timestamp: '2026-10-22T11:15:00Z',
        authorLabel: 'Employee Note',
        content: 'Colleague Sarah M. sent me a private message asking if I was okay after what happened during the sprint call, stating she felt Mark\'s tone was unusually aggressive.',
        noteType: 'witness_conversation'
      }
    ],
    reflectionResponses: [
      {
        promptId: 'prompt_recurrence',
        question: 'Has a similar interaction or atmosphere occurred before with the same person, group, or setting?',
        answer: 'Yes, during two previous sprint reviews in August and September, Mark reacted with hostility whenever deadlines or governance compliance were questioned.',
        answeredAt: '2026-10-18T10:20:00Z'
      },
      {
        promptId: 'prompt_support_clarity',
        question: 'What immediate step, boundary, or supportive conversation would feel most helpful right now?',
        answer: 'I need to know my protections under the Protected Disclosures Act and discuss this securely with HR or an independent labor advisor.',
        answeredAt: '2026-10-18T10:25:00Z'
      }
    ],
    peopleInvolved: [
      {
        id: 'person-01',
        nameOrRole: 'Mark V. (Engineering Director)',
        roleInIncident: 'primary_actor',
        department: 'Core Infrastructure',
        approximateSeniority: 'senior_executive'
      },
      {
        id: 'person-02',
        nameOrRole: 'Sarah M. (Lead Systems Analyst)',
        roleInIncident: 'witness',
        department: 'Core Infrastructure',
        approximateSeniority: 'peer'
      }
    ],
    perceivedImpact: {
      psychologicalSafety: 'High anxiety, sleep disturbance, feeling isolated and fearful of speaking up in upcoming meetings.',
      professionalImpact: 'Removal from key client-facing steering committee directly threatens project deliverables and promotion review.',
      physicalWellbeing: 'Tension headaches and elevated stress levels.',
      severityScore: 4
    },
    evidenceItems: [
      {
        id: 'ev-01',
        title: 'Teams Meeting Attendees Screenshot',
        type: 'screenshot',
        dateAttached: '2026-10-18',
        summary: 'Timestamped screenshot showing active meeting roster and muted microphone status.',
        fileReferenceName: 'teams_call_roster_oct17.png',
        tamperChecksum: 'b7a493df12...c901'
      },
      {
        id: 'ev-02',
        title: 'Meeting Invite Revocation Email',
        type: 'email',
        dateAttached: '2026-10-20',
        summary: 'System notification confirming calendar removal from Client Executive Briefing.',
        fileReferenceName: 'calendar_cancellation_notice.eml',
        tamperChecksum: '3c8e90aa41...8921'
      }
    ],
    status: 'submitted_to_hr',
    cryptographicHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    isEncryptedInVault: true,
    hrCaseDetails: {
      submittedAt: '2026-10-24T16:45:00Z',
      isAnonymous: false,
      trackingToken: 'DIG-7401-K89W',
      assignedOfficer: 'Thandiwe Khumalo (Senior Employee Relations Partner)',
      urgency: 'elevated',
      hrStatus: 'under_preliminary_review',
      hrActionLogs: [
        {
          timestamp: '2026-10-24T16:46:12Z',
          actionBy: 'HR Portal System',
          actionDescription: 'Encrypted case received and dispatched to secure Employee Relations inbox.',
          isSharedWithEmployee: true
        },
        {
          timestamp: '2026-10-25T09:12:00Z',
          actionBy: 'Thandiwe Khumalo',
          actionDescription: 'Case triaged as Elevated Priority (Retaliation allegation). Assigned independent case handler.',
          isSharedWithEmployee: true
        },
        {
          timestamp: '2026-10-26T14:00:00Z',
          actionBy: 'Thandiwe Khumalo',
          actionDescription: 'Requested neutral calendar hold on steering committee changes pending inquiry.',
          isSharedWithEmployee: true
        }
      ],
      secureNotesToEmployee: [
        {
          timestamp: '2026-10-25T09:20:00Z',
          officer: 'Thandiwe Khumalo (HR)',
          message: 'Thank you for submitting your structured documentation via Dignifi. Your report has been securely registered. We treat potential retaliation with utmost seriousness under the 2022 Harassment Code. We have placed an interim request to ensure your committee access remains undisturbed while we review this with confidentiality.'
        }
      ]
    }
  },
  {
    id: 'INC-2026-8924',
    title: 'Repeated microaggressions and personal boundary remarks in 1-on-1',
    createdAt: '2026-10-28T16:20:00Z',
    updatedAt: '2026-10-28T16:40:00Z',
    incidentDate: '2026-10-28',
    incidentTime: '11:00',
    locationType: 'in-person-office',
    locationDetails: '4th Floor Executive Meeting Room B',
    categories: ['microaggression', 'general_harassment'],
    contemporaneousNarrative: 'During a scheduled quarterly check-in, supervisor made unsolicited personal comments about my cultural attire and accent, stating: "If you want to be taken seriously by senior leadership in Sandton, you should consider dressing more conventionally and toning down the cultural expressions." When I stated I was comfortable with professional standards, he sighed and said "I\'m just giving you friendly advice if you care about staying around."',
    subsequentNotes: [],
    reflectionResponses: [
      {
        promptId: 'prompt_immediate_impact',
        question: 'How did your body, mood, or focus respond during and immediately following this event?',
        answer: 'Felt deeply invalidated and humiliated. Had difficulty focusing during afternoon workshops.',
        answeredAt: '2026-10-28T16:30:00Z'
      }
    ],
    peopleInvolved: [
      {
        id: 'person-03',
        nameOrRole: 'Derek B. (Senior Manager)',
        roleInIncident: 'primary_actor',
        department: 'Operations',
        approximateSeniority: 'direct_manager'
      }
    ],
    perceivedImpact: {
      psychologicalSafety: 'Feeling that my cultural identity is being policed as a condition of professional advancement.',
      professionalImpact: 'Veiled threat to job security ("if you care about staying around").',
      physicalWellbeing: 'Mild insomnia and stomach discomfort.',
      severityScore: 3
    },
    evidenceItems: [],
    status: 'vault_secured',
    cryptographicHash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    isEncryptedInVault: true
  }
];
