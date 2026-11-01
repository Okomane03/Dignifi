export type IncidentCategory =
  | 'bullying'
  | 'sexual_harassment'
  | 'racial_discrimination'
  | 'gender_discrimination'
  | 'microaggression'
  | 'intimidation'
  | 'retaliation'
  | 'unethical_directive'
  | 'general_harassment';

export type RecordStatus =
  | 'private_draft'
  | 'vault_secured'
  | 'consultation_ready'
  | 'submitted_to_hr';

export type LocationType =
  | 'in-person-office'
  | 'remote-video-call'
  | 'chat-or-email'
  | 'work-event-offsite'
  | 'hybrid-other';

export interface PersonInvolved {
  id: string;
  nameOrRole: string;
  roleInIncident: 'primary_actor' | 'co_actor' | 'witness' | 'support_person' | 'management_notified';
  department?: string;
  approximateSeniority?: 'peer' | 'direct_manager' | 'senior_executive' | 'subordinate' | 'third_party_client';
}

export interface SubsequentNote {
  id: string;
  timestamp: string;
  authorLabel: string;
  content: string;
  noteType: 'additional_recollection' | 'witness_conversation' | 'retaliatory_aftermath' | 'medical_consultation';
}

export interface ReflectionAnswer {
  promptId: string;
  question: string;
  answer: string;
  answeredAt: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: 'email' | 'screenshot' | 'chat_log' | 'calendar_invite' | 'document' | 'audio_voice_memo' | 'performance_review';
  dateAttached: string;
  summary: string;
  fileReferenceName?: string;
  tamperChecksum: string;
}

export interface CaseClosureFeedback {
  status: 'pending_employee_response' | 'satisfied' | 'unhappy_follow_up_requested' | 'resubmitted_for_escalation';
  closedAt: string;
  closingSummary?: string;
  employeeResponseAt?: string;
  satisfactionRating?: number; // 1-5
  employeeFeedbackNotes?: string;
  followUpRequestReason?: 'unresolved_retaliation' | 'insufficient_interventions' | 'procedural_unfairness' | 'new_incidents_occurred' | 'external_escalation';
  requestedResolution?: string;
  resubmittedNewEvidence?: string;
}

export interface HrCaseRecord {
  submittedAt: string;
  isAnonymous: boolean;
  trackingToken: string;
  assignedOfficer: string;
  urgency: 'routine' | 'elevated' | 'critical_safety';
  hrStatus: 'received' | 'under_preliminary_review' | 'formal_inquiry_opened' | 'informal_mediation' | 'corrective_action_enacted' | 'case_concluded';
  hrActionLogs: Array<{
    timestamp: string;
    actionBy: string;
    actionDescription: string;
    isSharedWithEmployee: boolean;
  }>;
  secureNotesToEmployee?: Array<{
    timestamp: string;
    officer: string;
    message: string;
  }>;
  closureFeedback?: CaseClosureFeedback;
}

export interface IncidentRecord {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  incidentDate: string;
  incidentTime?: string;
  locationType: LocationType;
  locationDetails: string;
  categories: IncidentCategory[];
  
  // Records Management separation of concerns:
  contemporaneousNarrative: string; // Original, immutable first-hand account
  subsequentNotes: SubsequentNote[]; // Timestamped subsequent observations
  reflectionResponses: ReflectionAnswer[]; // Responses to system reflection prompts
  
  peopleInvolved: PersonInvolved[];
  perceivedImpact: {
    psychologicalSafety: string;
    professionalImpact: string;
    physicalWellbeing: string;
    severityScore: 1 | 2 | 3 | 4 | 5;
  };
  evidenceItems: EvidenceItem[];
  status: RecordStatus;
  
  // Verification & Integrity
  cryptographicHash: string; // SHA-256 digest of core contemporaneous facts
  isEncryptedInVault: boolean;
  
  // HR Submission details (if employee elects to submit)
  hrCaseDetails?: HrCaseRecord;
}

export interface UserProfile {
  id: string;
  displayName: string;
  workDepartment: string;
  vaultEncryptionEnabled: boolean;
  quickExitPin: string;
}
