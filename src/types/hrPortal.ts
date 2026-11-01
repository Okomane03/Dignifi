export type HrWorkflowStage =
  | 'submitted'
  | 'initial_review'
  | 'assessment'
  | 'action_planning'
  | 'investigation_referral'
  | 'follow_up'
  | 'administratively_closed';

export type HrUrgencyTier = 'routine' | 'elevated' | 'critical_safety';

export type HrInterventionType =
  | 'support_counseling'
  | 'workplace_adjustment'
  | 'policy_review'
  | 'management_consultation'
  | 'training'
  | 'formal_investigation';

export interface HrInterventionRecord {
  id: string;
  type: HrInterventionType;
  title: string;
  assignedTo: string;
  targetDate: string;
  status: 'planned' | 'in_progress' | 'completed';
  notes: string;
  loggedAt: string;
}

export interface HrAuditLogEntry {
  id: string;
  timestamp: string;
  performedBy: string;
  action: string;
  details: string;
}

export interface HrReportCase {
  id: string; // e.g. "DIG-2026-7401"
  trackingToken: string;
  title: string;
  submissionTimestamp: string;
  incidentDate: string;
  incidentTime?: string;
  departmentContext: string;
  locationMedium: string;
  categories: string[];
  isAnonymous: boolean;
  reporterIdentity?: {
    name: string;
    email: string;
    jobTitle: string;
  };
  originalSubmittedAccount: string; // Immutable contemporaneous narrative
  peopleInvolvedSummary: string;
  attachedEvidenceCount: number;
  perceivedImpactSummary: string;
  
  // Administrative Workflow
  workflowStage: HrWorkflowStage;
  urgency: HrUrgencyTier;
  assignedOfficer: string;
  reviewDueDate: string;
  administrativeNotes: string;

  // Interventions & Remediation
  interventions: HrInterventionRecord[];

  // Immutable Governance Audit Trail
  auditTrail: HrAuditLogEntry[];

  // Encrypted Outbound Messages to Employee
  encryptedEmployeeNotes: Array<{
    timestamp: string;
    officer: string;
    message: string;
  }>;

  // Employee Post-Closure Agency & Feedback
  closureFeedback?: import('./incident').CaseClosureFeedback;
}

export interface DepartmentMetric {
  department: string;
  reportCount: number;
  openCount: number;
  closedCount: number;
  topCategory: string;
  trustIndexNote: string;
}
