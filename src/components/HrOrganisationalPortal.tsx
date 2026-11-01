import React, { useState } from 'react';
import {
  Building,
  BarChart3,
  FileText,
  GitBranch,
  ShieldAlert,
  ShieldCheck,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Send,
  Lock,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
  HeartHandshake,
  TrendingUp,
  FileCheck,
  ChevronRight,
  ChevronLeft,
  Check,
  HelpCircle,
  Sparkles,
  Eye,
  Info,
  X,
} from 'lucide-react';
import { HrReportCase, HrWorkflowStage, HrInterventionRecord, HrInterventionType, HrAuditLogEntry } from '../types/hrPortal';
import { IncidentRecord } from '../types/incident';
import {
  INITIAL_HR_CASES,
  DEPARTMENT_METRICS_DATA,
  MONTHLY_TREND_DATA,
  CATEGORY_BREAKDOWN_DATA,
} from '../data/mockHrPortalData';

interface HrOrganisationalPortalProps {
  onOpenOfflineModal: () => void;
  onOpenIntegrationsModal: () => void;
  records?: IncidentRecord[];
  onUpdateRecord?: (updated: IncidentRecord) => void;
}

const HR_STORAGE_KEY = 'dignifi_hr_cases_v22';

const categoryNamesMap: Record<string, string> = {
  bullying: 'Bullying & Mobbing',
  sexual_harassment: 'Sexual Harassment',
  racial_discrimination: 'Racial / Ethnic Bias',
  gender_discrimination: 'Gender Discrimination',
  microaggression: 'Microaggression',
  intimidation: 'Intimidation & Coercion',
  retaliation: 'Retaliation / Victimization',
  unethical_directive: 'Unlawful / Unethical Directive',
  general_harassment: 'Hostile Environment'
};

function convertIncidentToHrCase(rec: IncidentRecord): HrReportCase {
  const hrDetails = rec.hrCaseDetails;
  const token = hrDetails?.trackingToken || rec.id;
  const isAnon = hrDetails?.isAnonymous ?? false;

  const peopleSummary = rec.peopleInvolved && rec.peopleInvolved.length > 0
    ? rec.peopleInvolved.map(p => `${p.nameOrRole} (${p.roleInIncident.replace(/_/g, ' ')}${p.department ? ` - ${p.department}` : ''})`).join(', ')
    : 'Documented by employee; pending intake triage.';

  const impactSummary = rec.perceivedImpact
    ? `${rec.perceivedImpact.psychologicalSafety || ''} ${rec.perceivedImpact.professionalImpact || ''}`.trim() || 'Contemporaneous record logged.'
    : 'Preserved in personal vault.';

  const cats = (rec.categories || []).map(c => categoryNamesMap[c] || c);

  let stage: HrWorkflowStage = 'submitted';
  if (hrDetails?.hrStatus === 'under_preliminary_review') stage = 'initial_review';
  else if (hrDetails?.hrStatus === 'formal_inquiry_opened') stage = 'investigation_referral';
  else if (hrDetails?.hrStatus === 'corrective_action_enacted' || hrDetails?.hrStatus === 'informal_mediation') stage = 'action_planning';
  else if (hrDetails?.hrStatus === 'case_concluded') stage = 'administratively_closed';

  return {
    id: token,
    trackingToken: token,
    title: rec.title || `Incident Report (Ref: ${token})`,
    submissionTimestamp: hrDetails?.submittedAt || rec.updatedAt || rec.createdAt,
    incidentDate: rec.incidentDate || new Date().toISOString().split('T')[0],
    incidentTime: rec.incidentTime || '14:00',
    departmentContext: rec.peopleInvolved?.[0]?.department || 'Operations & Client Delivery',
    locationMedium: rec.locationDetails || rec.locationType || 'Workplace setting',
    categories: cats.length > 0 ? cats : ['Bullying & Mobbing'],
    isAnonymous: isAnon,
    reporterIdentity: isAnon ? undefined : {
      name: 'Employee (Verified Dignifi User)',
      email: 'employee@organization.co.za',
      jobTitle: 'Staff Member'
    },
    originalSubmittedAccount: rec.contemporaneousNarrative || 'Contemporaneous narrative recorded by employee.',
    peopleInvolvedSummary: peopleSummary,
    attachedEvidenceCount: rec.evidenceItems?.length || 0,
    perceivedImpactSummary: impactSummary,
    workflowStage: stage,
    urgency: hrDetails?.urgency || 'elevated',
    assignedOfficer: hrDetails?.assignedOfficer || 'Thandiwe Khumalo (Senior ER Partner)',
    reviewDueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    administrativeNotes: hrDetails?.secureNotesToEmployee?.[0]?.message || 'Submitted via Dignifi encrypted employee vault. Ready for triage under Section 60 of the Employment Equity Act.',
    interventions: [],
    encryptedEmployeeNotes: hrDetails?.secureNotesToEmployee || [
      {
        timestamp: hrDetails?.submittedAt || rec.createdAt,
        officer: hrDetails?.assignedOfficer || 'HR Case Officer',
        message: `Your report (Ref: ${token}) has been received in the HR portal for preliminary triage.`
      }
    ],
    auditTrail: [
      {
        id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: hrDetails?.submittedAt || rec.createdAt,
        performedBy: 'Encrypted Dignifi Bridge',
        action: 'Report Submitted to HR',
        details: `Incident submitted by employee (Tracking Ref: ${token}). Urgency: ${hrDetails?.urgency || 'elevated'}.`
      }
    ]
  };
}

function mergeSubmittedRecords(baseCases: HrReportCase[], employeeRecords: IncidentRecord[]): HrReportCase[] {
  const caseMap = new Map<string, HrReportCase>();

  // Add base cases first
  baseCases.forEach(c => {
    caseMap.set(c.id, c);
    if (c.trackingToken) caseMap.set(c.trackingToken, c);
  });

  // Pull records from storage if employeeRecords is empty
  let sourceRecords = employeeRecords;
  if (sourceRecords.length === 0 && typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('dignifi_workplace_vault_v22');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) sourceRecords = parsed;
      }
    } catch {}
  }

  // Convert all submitted employee reports
  sourceRecords.forEach(rec => {
    const hasKk8g = rec.id === 'DIG-KK8G-N5A9' || (rec.hrCaseDetails && rec.hrCaseDetails.trackingToken === 'DIG-KK8G-N5A9');
    const isSubmitted = rec.status === 'submitted_to_hr' || Boolean(rec.hrCaseDetails) || Boolean(hasKk8g);

    if (isSubmitted) {
      const converted = convertIncidentToHrCase(rec);
      const existingKey = caseMap.has(converted.id)
        ? converted.id
        : converted.trackingToken && caseMap.has(converted.trackingToken)
        ? converted.trackingToken
        : null;

      if (existingKey) {
        const existing = caseMap.get(existingKey)!;
        caseMap.set(existing.id, {
          ...existing,
          title: converted.title,
          originalSubmittedAccount: converted.originalSubmittedAccount,
          categories: converted.categories,
          peopleInvolvedSummary: converted.peopleInvolvedSummary,
          attachedEvidenceCount: converted.attachedEvidenceCount,
          perceivedImpactSummary: converted.perceivedImpactSummary,
        });
      } else {
        caseMap.set(converted.id, converted);
      }
    }
  });

  const list: HrReportCase[] = Array.from(caseMap.values());
  const uniqueList = Array.from(new Map(list.map(c => [c.id, c])).values());
  // Sort so DIG-KK8G-N5A9 and newest submissions appear at the top
  uniqueList.sort((a, b) => {
    if (a.id === 'DIG-KK8G-N5A9' || a.trackingToken === 'DIG-KK8G-N5A9') return -1;
    if (b.id === 'DIG-KK8G-N5A9' || b.trackingToken === 'DIG-KK8G-N5A9') return 1;
    return new Date(b.submissionTimestamp).getTime() - new Date(a.submissionTimestamp).getTime();
  });

  return uniqueList;
}

export const HrOrganisationalPortal: React.FC<HrOrganisationalPortalProps> = ({
  onOpenOfflineModal,
  onOpenIntegrationsModal,
  records = [],
  onUpdateRecord,
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'reports' | 'workflow' | 'interventions' | 'analytics' | 'governance' | 'prevention'
  >('dashboard');

  const [cases, setCases] = useState<HrReportCase[]>(() => {
    let initialList = INITIAL_HR_CASES;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(HR_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            initialList = parsed;
          }
        }
      } catch {}
    }
    return mergeSubmittedRecords(initialList, records);
  });

  // Re-sync when records prop updates
  React.useEffect(() => {
    setCases(prev => {
      const merged = mergeSubmittedRecords(prev, records);
      try {
        localStorage.setItem(HR_STORAGE_KEY, JSON.stringify(merged));
      } catch {}
      return merged;
    });
  }, [records]);

  const [selectedCaseId, setSelectedCaseId] = useState<string>(() => {
    const hasKk8g = INITIAL_HR_CASES.some(c => c.id === 'DIG-KK8G-N5A9' || c.trackingToken === 'DIG-KK8G-N5A9');
    return hasKk8g ? 'DIG-KK8G-N5A9' : INITIAL_HR_CASES[0]?.id || '';
  });

  // Dashboard Quick Search & Status Filter state
  const [dashSearch, setDashSearch] = useState('');
  const [dashStatusFilter, setDashStatusFilter] = useState('all');

  // Search & Filter state for Reports grid
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');

  // New intervention form state
  const [newInterventionTitle, setNewInterventionTitle] = useState('');
  const [newInterventionType, setNewInterventionType] = useState<HrInterventionType>('support_counseling');
  const [newInterventionAssignee, setNewInterventionAssignee] = useState('');
  const [newInterventionTargetDate, setNewInterventionTargetDate] = useState('');
  const [newInterventionNotes, setNewInterventionNotes] = useState('');

  // Outbound message to employee state
  const [outboundMessage, setOutboundMessage] = useState('');

  // Interactive Case Lifecycle & Transition state
  const [transitionTargetStage, setTransitionTargetStage] = useState<HrWorkflowStage | null>(null);
  const [transitionRationale, setTransitionRationale] = useState('');
  const [notifyEmployeeOnTransition, setNotifyEmployeeOnTransition] = useState(true);
  const [lifecycleFeedback, setLifecycleFeedback] = useState<{ message: string; timestamp: string } | null>(null);
  const [showCurrentStageDetails, setShowCurrentStageDetails] = useState<boolean>(false);
  const [showNonJudicialExplainModal, setShowNonJudicialExplainModal] = useState<boolean>(false);

  const currentCase = cases.find(c => c.id === selectedCaseId || c.trackingToken === selectedCaseId) || cases[0];

  // Derived counts for KPI strip
  const totalReports = cases.length;
  const awaitingReview = cases.filter(c => c.workflowStage === 'submitted' || c.workflowStage === 'initial_review').length;
  const underAssessment = cases.filter(c => c.workflowStage === 'assessment' || c.workflowStage === 'action_planning').length;
  const requiringFollowUp = cases.filter(c => c.workflowStage === 'investigation_referral' || c.workflowStage === 'follow_up').length;
  const closedReports = cases.filter(c => c.workflowStage === 'administratively_closed').length;

  const filteredCases = cases.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.id.toLowerCase().includes(q) ||
      (c.trackingToken && c.trackingToken.toLowerCase().includes(q)) ||
      c.title.toLowerCase().includes(q) ||
      c.departmentContext.toLowerCase().includes(q) ||
      (c.reporterIdentity?.name && c.reporterIdentity.name.toLowerCase().includes(q)) ||
      (c.reporterIdentity?.email && c.reporterIdentity.email.toLowerCase().includes(q)) ||
      (c.originalSubmittedAccount && c.originalSubmittedAccount.toLowerCase().includes(q)) ||
      c.categories.some(cat => cat.toLowerCase().includes(q));

    const matchesDept = filterDepartment === 'all' || c.departmentContext === filterDepartment;
    const matchesStage = filterStage === 'all' || c.workflowStage === filterStage;
    const matchesUrgency = filterUrgency === 'all' || c.urgency === filterUrgency;

    return matchesSearch && matchesDept && matchesStage && matchesUrgency;
  });

  const dashFilteredCases = cases.filter(c => {
    const q = dashSearch.toLowerCase().trim();
    const matchesQuery =
      !q ||
      c.id.toLowerCase().includes(q) ||
      (c.trackingToken && c.trackingToken.toLowerCase().includes(q)) ||
      c.title.toLowerCase().includes(q) ||
      c.departmentContext.toLowerCase().includes(q) ||
      (c.reporterIdentity?.name && c.reporterIdentity.name.toLowerCase().includes(q)) ||
      (c.originalSubmittedAccount && c.originalSubmittedAccount.toLowerCase().includes(q)) ||
      c.categories.some(cat => cat.toLowerCase().includes(q));

    const matchesStatus =
      dashStatusFilter === 'all' || c.workflowStage === dashStatusFilter;

    return matchesQuery && matchesStatus;
  });

  interface WorkflowStageMeta {
    id: HrWorkflowStage;
    stepNumber: number;
    label: string;
    desc: string;
    sla: string;
    statutoryPurpose: string;
    proceduralChecklist: string[];
    defaultRationale: string;
  }

  const workflowStagesList: WorkflowStageMeta[] = [
    {
      id: 'submitted',
      stepNumber: 1,
      label: '1. Submitted',
      desc: 'Securely received via authorized pathway',
      sla: 'Immediate / < 24 Hours',
      statutoryPurpose: 'Formal receipt via employee-controlled reporting gateway. Cryptographic token and immutable contemporaneous timestamp created.',
      proceduralChecklist: [
        'Acknowledge receipt to employee tracking token',
        'Verify named vs protected anonymity status',
        'Conduct initial screening for immediate safety risks'
      ],
      defaultRationale: 'Report officially acknowledged and logged into secure HR administrative desk.'
    },
    {
      id: 'initial_review',
      stepNumber: 2,
      label: '2. Initial Review',
      desc: 'SLA triage and preliminary jurisdictional check',
      sla: 'Within 48 Hours',
      statutoryPurpose: 'Urgency tier assignment and jurisdictional screening under EEA Section 60 and employer anti-harassment policy.',
      proceduralChecklist: [
        'Confirm workplace scope (premises, digital channels, or work events)',
        'Assign responsible HR Case Officer / Employee Relations partner',
        'Evaluate need for immediate interim protective adjustments'
      ],
      defaultRationale: 'Preliminary triage completed; workplace jurisdiction verified under anti-harassment policy.'
    },
    {
      id: 'assessment',
      stepNumber: 3,
      label: '3. Assessment',
      desc: 'Factual assessment under 2022 Harassment Code',
      sla: '3 - 5 Business Days',
      statutoryPurpose: 'Neutral factual evaluation against 2022 Code of Good Practice on Harassment definitions (bullying, intimidation, sexual harassment, microaggressions) without judicial determinations.',
      proceduralChecklist: [
        'Assess conduct frequency, pattern, and reported power imbalance',
        'Determine appropriate resolution track (informal support vs formal inquiry)',
        'Ensure trauma-informed communication with reporting party'
      ],
      defaultRationale: 'Factual assessment underway under 2022 Code of Good Practice guidelines.'
    },
    {
      id: 'action_planning',
      stepNumber: 4,
      label: '4. Action Planning',
      desc: 'Workplace adjustment and support planning',
      sla: '5 - 7 Business Days',
      statutoryPurpose: 'Formulation of tailored interventions: EAP psychological support, interim desk/shift reassignment, or executive coaching.',
      proceduralChecklist: [
        'Log measurable action items with assigned owners and deadlines',
        'Enact non-punitive accommodations for affected personnel',
        'Establish agreed milestones and anti-retaliation check-in schedule'
      ],
      defaultRationale: 'Action plan approved with interim support measures and allocated case responsibilities.'
    },
    {
      id: 'investigation_referral',
      stepNumber: 5,
      label: '5. Investigation Referral',
      desc: 'Independent fact-finding where appropriate',
      sla: '10 - 20 Business Days',
      statutoryPurpose: 'Referral to independent investigator or grievance panel when facts are contested or serious disciplinary breach is alleged, adhering to audi alteram partem.',
      proceduralChecklist: [
        'Draft clear, impartial terms of reference for investigation',
        'Secure written confidentiality undertakings from all interviewees',
        'Maintain protective wall between investigator and administrative HR'
      ],
      defaultRationale: 'Referred to independent investigation panel in accordance with formal disciplinary procedure.'
    },
    {
      id: 'follow_up',
      stepNumber: 6,
      label: '6. Follow-Up',
      desc: 'Monitoring culture and anti-retaliation adherence',
      sla: '30 - 60 Day Monitoring Window',
      statutoryPurpose: 'Post-intervention monitoring of workplace climate and strict enforcement of anti-victimization protections.',
      proceduralChecklist: [
        'Conduct 30-day and 60-day check-ins with affected employee',
        'Review departmental sentiment and manager conduct compliance',
        'Verify that all corrective or developmental actions remain in effect'
      ],
      defaultRationale: 'Case transitioned to active follow-up monitoring to ensure zero retaliation and sustained support.'
    },
    {
      id: 'administratively_closed',
      stepNumber: 7,
      label: '7. Closure',
      desc: 'Administrative closure & permanent record retention',
      sla: 'Final Archival',
      statutoryPurpose: 'Formal conclusion of administrative lifecycle, closing file with POPIA-compliant encryption and statutory retention schedule.',
      proceduralChecklist: [
        'Confirm all logged interventions are finalized or permanently integrated',
        'Send final closure milestone update to employee tracking token',
        'Seal case audit trail into immutable compliance archive'
      ],
      defaultRationale: 'All administrative milestones and support interventions completed. Case file sealed for statutory retention.'
    }
  ];

  const handleAdvanceWorkflowStage = (
    newStage: HrWorkflowStage,
    rationaleText?: string,
    sendEmployeeNotice: boolean = true
  ) => {
    if (!currentCase) return;
    const nowIso = new Date().toISOString();
    const stageMeta = workflowStagesList.find(s => s.id === newStage);
    const stageLabel = stageMeta ? stageMeta.label : newStage;
    const rationale =
      rationaleText?.trim() ||
      stageMeta?.defaultRationale ||
      `Administrative milestone transitioned to ${stageLabel}. Process tracking updated in compliance with EEA 2022 Code of Good Practice.`;

    const newAuditEntry: HrAuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: nowIso,
      performedBy: 'HR Case Officer (You)',
      action: `Workflow Stage Transition: ${stageLabel}`,
      details: rationale,
    };

    const newNotice = sendEmployeeNotice
      ? {
          timestamp: nowIso,
          officer: 'HR Case Desk',
          message: `[Administrative Milestone Update] Case status transitioned to: ${stageLabel}. Rationale: ${rationale}`,
        }
      : null;

    const updated = cases.map(c => {
      if (c.id === currentCase.id || c.trackingToken === currentCase.trackingToken) {
        return {
          ...c,
          workflowStage: newStage,
          encryptedEmployeeNotes: newNotice
            ? [newNotice, ...c.encryptedEmployeeNotes]
            : c.encryptedEmployeeNotes,
          auditTrail: [newAuditEntry, ...c.auditTrail],
        };
      }
      return c;
    });

    setCases(updated);
    try {
      localStorage.setItem(HR_STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    // Sync back to employee record if matching
    if (onUpdateRecord) {
      const match = records.find(
        r =>
          r.id === currentCase.id ||
          r.hrCaseDetails?.trackingToken === currentCase.trackingToken ||
          r.hrCaseDetails?.trackingToken === currentCase.id
      );
      if (match && match.hrCaseDetails) {
        onUpdateRecord({
          ...match,
          updatedAt: nowIso,
          hrCaseDetails: {
            ...match.hrCaseDetails,
            hrStatus:
              newStage === 'administratively_closed'
                ? 'case_concluded'
                : newStage === 'investigation_referral'
                ? 'formal_inquiry_opened'
                : 'under_preliminary_review',
          },
        });
      }
    }

    setLifecycleFeedback({
      message: `Case Ref ${currentCase.id} successfully transitioned to ${stageLabel}. Audit log and employee token updated.`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    });
    setTransitionTargetStage(null);
    setTransitionRationale('');
    setShowCurrentStageDetails(false);
  };

  const handleStageBlockClick = (stageId: HrWorkflowStage) => {
    if (!currentCase) return;
    if (stageId === currentCase.workflowStage) {
      // Toggle details for the active stage
      setShowCurrentStageDetails(prev => !prev);
    } else {
      // Open transition confirmation modal for target stage
      const targetMeta = workflowStagesList.find(s => s.id === stageId);
      setTransitionTargetStage(stageId);
      setTransitionRationale(targetMeta?.defaultRationale || '');
      setNotifyEmployeeOnTransition(true);
    }
  };

  const handleAddIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCase || !newInterventionTitle.trim()) return;

    const newIntervention: HrInterventionRecord = {
      id: `int-${Date.now()}`,
      type: newInterventionType,
      title: newInterventionTitle.trim(),
      assignedTo: newInterventionAssignee.trim() || 'Employee Relations Lead',
      targetDate: newInterventionTargetDate || new Date().toISOString().split('T')[0],
      status: 'planned',
      notes: newInterventionNotes.trim() || 'Intervention logged by HR case partner.',
      loggedAt: new Date().toISOString()
    };

    const updated = cases.map(c => {
      if (c.id === currentCase.id) {
        return {
          ...c,
          interventions: [newIntervention, ...c.interventions],
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              performedBy: 'HR Case Officer (You)',
              action: 'Action Logged',
              details: `Enacted new intervention: ${newIntervention.title} (${newIntervention.type})`
            },
            ...c.auditTrail
          ]
        };
      }
      return c;
    });

    setCases(updated);
    setNewInterventionTitle('');
    setNewInterventionNotes('');
    setNewInterventionAssignee('');
    alert('Action & intervention successfully logged.');
  };

  const handleSendOutboundNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCase || !outboundMessage.trim()) return;

    const newNotice = {
      timestamp: new Date().toISOString(),
      officer: 'HR Case Desk',
      message: outboundMessage.trim()
    };

    const updated = cases.map(c => {
      if (c.id === currentCase.id) {
        return {
          ...c,
          encryptedEmployeeNotes: [newNotice, ...c.encryptedEmployeeNotes],
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              performedBy: 'HR Case Desk',
              action: 'Dispatched Encrypted Notice',
              details: `Sent official progress communication to employee tracking token (${c.trackingToken}).`
            },
            ...c.auditTrail
          ]
        };
      }
      return c;
    });

    setCases(updated);
    setOutboundMessage('');
    alert(`Encrypted notice sent to employee tracking token ${currentCase.trackingToken}.`);
  };



  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Title */}
      <div className="bg-[#2D4335] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#C2D8C7] mb-1 font-semibold uppercase tracking-wider">
              <Building className="w-4 h-4 text-[#A7C8AE]" />
              <span>Dignifi – HR Organisational Insights & Report Management Portal</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Organisational Report Management & Prevention Hub
            </h1>
            <p className="text-xs sm:text-sm text-[#DFEBE2] mt-1.5 max-w-3xl leading-relaxed">
              A structured organizational space to manage workplace reports, coordinate human-centred interventions, and spot systemic patterns without compromising individual employee privacy or dignity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <span className="text-[11px] font-mono bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-[#E5EFE8]">
              Compliance Mode: Active
            </span>
            <button
              onClick={onOpenOfflineModal}
              className="px-3.5 py-1.5 bg-white text-[#2D4335] text-xs font-bold rounded-xl hover:bg-[#F2F6EF] cursor-pointer shadow-xs transition-colors"
            >
              Export Suite (v22)
            </button>
          </div>
        </div>

        {/* Subtle background ambient glow */}
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#3E5C47] rounded-full filter blur-2xl opacity-40 pointer-events-none" />
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E0E7DC] text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'dashboard' ? 'bg-[#2D4335] text-white shadow-xs' : 'text-[#566858] hover:bg-[#EEF2EB]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>1. Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'reports' ? 'bg-[#2D4335] text-white shadow-xs' : 'text-[#566858] hover:bg-[#EEF2EB]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. Report Management ({cases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('workflow')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'workflow' ? 'bg-[#2D4335] text-white shadow-xs' : 'text-[#566858] hover:bg-[#EEF2EB]'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>3. Workflow & Review</span>
        </button>

        <button
          onClick={() => setActiveTab('interventions')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'interventions' ? 'bg-[#2D4335] text-white shadow-xs' : 'text-[#566858] hover:bg-[#EEF2EB]'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>4. Action & Interventions</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'analytics' ? 'bg-[#2D4335] text-white shadow-xs' : 'text-[#566858] hover:bg-[#EEF2EB]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>5. Organisational Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('governance')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'governance' ? 'bg-[#2D4335] text-white shadow-xs' : 'text-[#566858] hover:bg-[#EEF2EB]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>6. Governance & Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('prevention')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'prevention' ? 'bg-[#2D4335] text-white shadow-xs' : 'text-[#566858] hover:bg-[#EEF2EB]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>7. Prevention Resources</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ORGANISATIONAL DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          
          {/* Summary Metric Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-lg font-bold text-[#1C261E]">
                Executive Report Portfolio Summary
              </h2>
              <span className="text-[11px] text-[#5A6D5D] bg-[#EEF3EC] px-2.5 py-1 rounded-md font-mono">
                Source: Fictional Demonstration Data
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white border border-[#DFE7DB] rounded-2xl p-5 shadow-xs">
                <span className="text-xs font-semibold text-[#5B6E5E] block mb-1">Total Submitted</span>
                <p className="font-serif text-3xl font-extrabold text-[#1C261E]">{totalReports}</p>
                <p className="text-[11px] text-[#697A6B] mt-1">Authorized dispatches</p>
              </div>

              <div className="bg-white border border-[#DFE7DB] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8C5D00] block mb-1">Awaiting Review</span>
                  <span className="w-2 h-2 rounded-full bg-[#E5A93C]" />
                </div>
                <p className="font-serif text-3xl font-extrabold text-[#1C261E]">{awaitingReview}</p>
                <p className="text-[11px] text-[#8C5D00] mt-1 font-medium">Within 48h SLA</p>
              </div>

              <div className="bg-white border border-[#DFE7DB] rounded-2xl p-5 shadow-xs">
                <span className="text-xs font-semibold text-[#2D4335] block mb-1">Under Review / Assessment</span>
                <p className="font-serif text-3xl font-extrabold text-[#1C261E]">{underAssessment}</p>
                <p className="text-[11px] text-[#556756] mt-1">Active case triage</p>
              </div>

              <div className="bg-white border border-[#DFE7DB] rounded-2xl p-5 shadow-xs">
                <span className="text-xs font-semibold text-[#8B3A2B] block mb-1">Requires Follow-Up</span>
                <p className="font-serif text-3xl font-extrabold text-[#1C261E]">{requiringFollowUp}</p>
                <p className="text-[11px] text-[#8B3A2B] mt-1">Remedial actions active</p>
              </div>

              <div className="bg-white border border-[#DFE7DB] rounded-2xl p-5 shadow-xs">
                <span className="text-xs font-semibold text-[#48594A] block mb-1">Administratively Closed</span>
                <p className="font-serif text-3xl font-extrabold text-[#1C261E]">{closedReports}</p>
                <p className="text-[11px] text-[#697A6B] mt-1">Resolved with retention</p>
              </div>
            </div>
          </div>

          {/* Quick Incident Search & Status Filter on Dashboard */}
          <div className="bg-white border border-[#DFE7DB] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1C261E] flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#2D4335]" />
                  <span>Quick Incident Report Finder & Status Filter</span>
                </h3>
                <p className="text-xs text-[#5E7060] mt-0.5">
                  Find specific incident reports instantly by tracking token (e.g. DIG-KK8G-N5A9) or filter by workflow status.
                </p>
              </div>

              {(dashSearch || dashStatusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setDashSearch('');
                    setDashStatusFilter('all');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[#8B3A2B] hover:text-[#6F2E22] font-semibold cursor-pointer shrink-0 self-start md:self-auto"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Filter</span>
                </button>
              )}
            </div>

            {/* Filter Controls Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8 relative">
                <Search className="w-4 h-4 text-[#7A8A7B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={dashSearch}
                  onChange={e => setDashSearch(e.target.value)}
                  placeholder="Enter tracking token (e.g. DIG-KK8G-N5A9), reference ID, title, or keyword..."
                  className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-[#1C261E] placeholder:text-[#889889] focus:outline-none focus:ring-1 focus:ring-[#2D4335]"
                />
                {dashSearch && (
                  <button
                    onClick={() => setDashSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8A7B] hover:text-[#1C261E] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="md:col-span-4 relative">
                <Filter className="w-3.5 h-3.5 text-[#7A8A7B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={dashStatusFilter}
                  onChange={e => setDashStatusFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-[#1C261E] focus:outline-none focus:ring-1 focus:ring-[#2D4335] cursor-pointer"
                >
                  <option value="all">All Report Statuses ({cases.length})</option>
                  <option value="submitted">1. Submitted ({cases.filter(c => c.workflowStage === 'submitted').length})</option>
                  <option value="initial_review">2. Initial Review ({cases.filter(c => c.workflowStage === 'initial_review').length})</option>
                  <option value="assessment">3. Assessment ({cases.filter(c => c.workflowStage === 'assessment').length})</option>
                  <option value="action_planning">4. Action Planning ({cases.filter(c => c.workflowStage === 'action_planning').length})</option>
                  <option value="investigation_referral">5. Investigation Referral ({cases.filter(c => c.workflowStage === 'investigation_referral').length})</option>
                  <option value="follow_up">6. Follow-Up ({cases.filter(c => c.workflowStage === 'follow_up').length})</option>
                  <option value="administratively_closed">7. Administratively Closed ({cases.filter(c => c.workflowStage === 'administratively_closed').length})</option>
                </select>
              </div>
            </div>

            {/* Quick Results Panel */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2 text-xs text-[#5E7060]">
                <span>
                  Showing <strong>{dashFilteredCases.length}</strong> {dashFilteredCases.length === 1 ? 'incident report' : 'incident reports'}
                  {dashSearch && <span> matching "<strong className="text-[#1C261E]">{dashSearch}</strong>"</span>}
                  {dashStatusFilter !== 'all' && <span> in status <strong className="text-[#1C261E]">{dashStatusFilter.replace(/_/g, ' ')}</strong></span>}
                </span>
                {dashFilteredCases.length > 3 && (
                  <button
                    onClick={() => {
                      setSearchQuery(dashSearch);
                      setFilterStage(dashStatusFilter);
                      setActiveTab('reports');
                    }}
                    className="text-[#2D4335] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all in Report Management</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {dashFilteredCases.length === 0 ? (
                <div className="py-8 text-center bg-[#FAFBF9] border border-dashed border-[#DFE7DB] rounded-xl">
                  <p className="text-xs text-[#5E7060]">No reports found matching your search or status filter.</p>
                  <button
                    onClick={() => {
                      setDashSearch('');
                      setDashStatusFilter('all');
                    }}
                    className="mt-2 text-xs font-semibold text-[#2D4335] underline cursor-pointer"
                  >
                    Clear filters and show all reports
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {dashFilteredCases.slice(0, 4).map(item => {
                    const isSelected = item.id === selectedCaseId || item.trackingToken === selectedCaseId;
                    const stageBadge = {
                      submitted: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
                      initial_review: 'bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]',
                      assessment: 'bg-[#E0E7FF] text-[#3730A3] border-[#C7D2FE]',
                      action_planning: 'bg-[#EAEFE6] text-[#2D4335] border-[#CCD7C8]',
                      investigation_referral: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]',
                      follow_up: 'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]',
                      administratively_closed: 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]'
                    }[item.workflowStage] || 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]';

                    const urgencyBadge = {
                      routine: 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]',
                      elevated: 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
                      critical_safety: 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]'
                    }[item.urgency] || 'bg-gray-100 text-gray-700';

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#F4F8F3] border-[#2D4335] shadow-xs'
                            : 'bg-[#FAFBF9] border-[#DFE7DB] hover:bg-white hover:border-[#CCD7C8]'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#2D4335] bg-white px-2 py-0.5 rounded border border-[#CCD7C8]">
                              {item.id}
                            </span>
                            {item.trackingToken && item.trackingToken !== item.id && (
                              <span className="font-mono text-[11px] text-[#556756] bg-[#EEF2EB] px-2 py-0.5 rounded">
                                Token: {item.trackingToken}
                              </span>
                            )}
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase ${stageBadge}`}>
                              {item.workflowStage.replace(/_/g, ' ')}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase ${urgencyBadge}`}>
                              {item.urgency.replace(/_/g, ' ')}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-semibold text-[#1C261E] truncate">
                              {item.title}
                            </h4>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#5E7060]">
                            <span>Dept: <strong className="text-[#1C261E]">{item.departmentContext}</strong></span>
                            <span>&middot;</span>
                            <span>Incident Date: <strong className="text-[#1C261E]">{item.incidentDate}</strong></span>
                            <span>&middot;</span>
                            <span>Reporter: <strong className="text-[#1C261E]">{item.isAnonymous ? 'Anonymous' : item.reporterIdentity?.name || 'Verified Employee'}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => {
                              setSelectedCaseId(item.id);
                              setActiveTab('workflow');
                            }}
                            className="px-3 py-1.5 bg-[#2D4335] hover:bg-[#203126] text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                          >
                            <span>Open in Workflow</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCaseId(item.id);
                              setActiveTab('reports');
                            }}
                            className="px-3 py-1.5 bg-white hover:bg-[#F2F6EF] text-[#2D4335] border border-[#CCD7C8] text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Visualisations Grid: Categories & 12-Month Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Incident Categories Breakdown */}
            <div className="lg:col-span-6 bg-white border border-[#DFE7DB] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1C261E]">
                    Incident Categories Distribution
                  </h3>
                  <p className="text-xs text-[#5E7060]">Proportion of reported conduct facets</p>
                </div>
                <BarChart3 className="w-5 h-5 text-[#2D4335]" />
              </div>

              <div className="space-y-3 pt-2">
                {CATEGORY_BREAKDOWN_DATA.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-[#1C261E]">{cat.category}</span>
                      <span className="text-[#5A6C5B] font-mono">{cat.count} reports ({cat.percentage}%)</span>
                    </div>
                    <div className="w-full bg-[#EEF2EB] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#2D4335] h-full rounded-full transition-all duration-500"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 12-Month Reporting Volume Trends */}
            <div className="lg:col-span-6 bg-white border border-[#DFE7DB] rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif text-base font-bold text-[#1C261E]">
                    12-Month Reporting Volume Trend
                  </h3>
                  <TrendingUp className="w-5 h-5 text-[#2D4335]" />
                </div>
                <p className="text-xs text-[#5E7060]">
                  Aggregated report submissions across operational calendar
                </p>
              </div>

              <div className="h-44 flex items-end justify-between gap-1.5 pt-6 pb-2 border-b border-[#EEF2EB]">
                {MONTHLY_TREND_DATA.map((item, idx) => {
                  const heightPercent = Math.max(15, (item.count / 8) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                      <div className="text-[10px] font-mono text-[#586A5A] opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.count}
                      </div>
                      <div
                        className="w-full bg-[#3B5442] group-hover:bg-[#203126] rounded-t transition-all"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[9px] text-[#6E8070] truncate w-full text-center">
                        {item.month.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-[#FAFBF9] border border-[#DEE7DA] rounded-xl text-xs text-[#556756] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#2D4335] shrink-0" />
                <span>
                  <strong>Insight:</strong> Uptick in Q3 coincides with roll-out of the Dignifi self-documentation app, showing enhanced reporting accessibility rather than spike in harm.
                </span>
              </div>
            </div>

          </div>

          {/* Departmental Pattern Matrix */}
          <div className="bg-white border border-[#DFE7DB] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1C261E]">
              Departmental Patterns & Operational Context
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EDF2EA] text-[#556756] uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 font-semibold">Department Unit</th>
                    <th className="py-2.5 font-semibold">Total Reports</th>
                    <th className="py-2.5 font-semibold">Active Inquiries</th>
                    <th className="py-2.5 font-semibold">Resolved</th>
                    <th className="py-2.5 font-semibold">Predominant Facet</th>
                    <th className="py-2.5 font-semibold">Climate Analysis Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5EE]">
                  {DEPARTMENT_METRICS_DATA.map((d, i) => (
                    <tr key={i} className="hover:bg-[#F9FAF7]">
                      <td className="py-3 font-semibold text-[#1C261E]">{d.department}</td>
                      <td className="py-3 font-mono font-bold text-[#2D4335]">{d.reportCount}</td>
                      <td className="py-3 font-mono">{d.openCount}</td>
                      <td className="py-3 font-mono">{d.closedCount}</td>
                      <td className="py-3 text-[#3B4F3E]">{d.topCategory}</td>
                      <td className="py-3 text-[#647565]">{d.trustIndexNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INCIDENT REPORT MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1C261E]">
                Incident Report Management
              </h2>
              <p className="text-xs sm:text-sm text-[#5D6F60]">
                Structured case management for reports deliberately submitted through the employee portal.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white border border-[#DFE7DB] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#7A8A7B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search reference, title, department..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-[#1C261E] focus:outline-none focus:ring-1 focus:ring-[#2D4335]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={filterStage}
                onChange={e => setFilterStage(e.target.value)}
                className="text-xs bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl px-2.5 py-2 text-[#1C261E]"
              >
                <option value="all">All Stages</option>
                <option value="submitted">1. Submitted</option>
                <option value="initial_review">2. Initial Review</option>
                <option value="assessment">3. Assessment</option>
                <option value="action_planning">4. Action Planning</option>
                <option value="investigation_referral">5. Investigation Referral</option>
                <option value="follow_up">6. Follow-Up</option>
                <option value="administratively_closed">7. Closed</option>
              </select>

              <select
                value={filterUrgency}
                onChange={e => setFilterUrgency(e.target.value)}
                className="text-xs bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl px-2.5 py-2 text-[#1C261E]"
              >
                <option value="all">All Urgency</option>
                <option value="routine">Routine</option>
                <option value="elevated">Elevated</option>
                <option value="critical_safety">Critical Safety</option>
              </select>
            </div>
          </div>

          {/* Cases Table */}
          <div className="bg-white border border-[#DFE7DB] rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAFBF9] border-b border-[#EDF2EA] text-[#556756] uppercase tracking-wider text-[11px]">
                    <th className="p-3.5 font-semibold">Reference</th>
                    <th className="p-3.5 font-semibold">Title & Context</th>
                    <th className="p-3.5 font-semibold">Submission Date</th>
                    <th className="p-3.5 font-semibold">Incident Date</th>
                    <th className="p-3.5 font-semibold">Category</th>
                    <th className="p-3.5 font-semibold">Urgency</th>
                    <th className="p-3.5 font-semibold">Workflow Stage</th>
                    <th className="p-3.5 font-semibold">Assigned Officer</th>
                    <th className="p-3.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5EE]">
                  {filteredCases.map(item => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F9FAF7] transition-colors"
                    >
                      <td className="p-3.5 font-mono font-bold text-[#2D4335] whitespace-nowrap">
                        {item.id}
                      </td>
                      <td className="p-3.5 max-w-xs">
                        <p className="font-semibold text-[#1C261E] truncate">{item.title}</p>
                        <p className="text-[11px] text-[#697B6B] truncate">{item.departmentContext}</p>
                      </td>
                      <td className="p-3.5 text-[#556756] whitespace-nowrap">
                        {new Date(item.submissionTimestamp).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 text-[#556756] whitespace-nowrap">
                        {item.incidentDate}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="text-[#2D4335] font-medium">{item.categories.slice(0, 2).join(', ')}</span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          item.urgency === 'critical_safety'
                            ? 'bg-[#FCE8E6] text-[#A82A2A]'
                            : item.urgency === 'elevated'
                            ? 'bg-[#FEF3D6] text-[#8C5D00]'
                            : 'bg-[#EAF2E7] text-[#2D4335]'
                        }`}>
                          {item.urgency}
                        </span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-medium text-[#203225]">
                          {item.workflowStage.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 text-[#556756] whitespace-nowrap">
                        {item.assignedOfficer}
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedCaseId(item.id);
                            setActiveTab('workflow');
                          }}
                          className="px-3 py-1 bg-[#EAEFE6] hover:bg-[#DEE7DA] text-[#2D4335] text-xs font-semibold rounded-lg cursor-pointer"
                        >
                          Review Case
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: REPORT WORKFLOW & CASE REVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'workflow' && currentCase && (
        <div className="space-y-8 animate-in fade-in duration-150">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDF2EA]">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#596B5B] mb-1">
                <span className="font-mono font-bold text-[#2D4335]">Ref: {currentCase.id}</span>
                <span>&middot;</span>
                <span>Tracking Token: {currentCase.trackingToken}</span>
                <span>&middot;</span>
                <span>Mode: {currentCase.isAnonymous ? 'Protected Anonymity' : `Named (${currentCase.reporterIdentity?.name})`}</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#1C261E]">
                {currentCase.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 bg-[#EEF3EC] text-[#2D4335] rounded-xl border border-[#D5DFD1]">
                Urgency: {currentCase.urgency.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Milestone Transition Feedback Notification Banner */}
          {lifecycleFeedback && (
            <div className="p-4 bg-[#EAF5EC] border border-[#A7CCA8] rounded-2xl flex items-center justify-between gap-3 text-xs text-[#1C261E] animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#2D4335] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="font-bold text-[#2D4335]">Milestone Updated ({lifecycleFeedback.timestamp}):</span>{' '}
                  <span>{lifecycleFeedback.message}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLifecycleFeedback(null)}
                className="text-[#526654] hover:text-[#1C261E] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 7-Stage Workflow Progression Tracker & Milestone Action Engine */}
          {(() => {
            const currentStageIndex = workflowStagesList.findIndex(s => s.id === currentCase.workflowStage);
            const currentStageMeta = workflowStagesList[currentStageIndex] || workflowStagesList[0];
            const hasPrev = currentStageIndex > 0;
            const hasNext = currentStageIndex < workflowStagesList.length - 1;
            const prevStage = hasPrev ? workflowStagesList[currentStageIndex - 1] : null;
            const nextStage = hasNext ? workflowStagesList[currentStageIndex + 1] : null;

            return (
              <div className="bg-white border border-[#DFE7DB] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
                {/* Tracker Header & Educational Trigger */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EDF2EA]">
                  <div>
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-[#2D4335]" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#2D4335]">
                        Case Administrative Lifecycle (Non-Judicial Tracker)
                      </h3>
                      <span className="text-[11px] font-mono px-2 py-0.5 bg-[#EEF3EC] text-[#2D4335] rounded-md font-semibold">
                        Stage {currentStageIndex + 1} of 7
                      </span>
                    </div>
                    <p className="text-xs text-[#5D6F60] mt-1">
                      Statutory due process tracking under South African EEA Section 60 & 2022 Harassment Code. Click any milestone to transition or inspect.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowCurrentStageDetails(prev => !prev)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                        showCurrentStageDetails
                          ? 'bg-[#2D4335] text-white border-[#2D4335]'
                          : 'bg-[#FAFBF9] border-[#DFE7DB] text-[#2D4335] hover:bg-[#EEF3EC]'
                      }`}
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>{showCurrentStageDetails ? 'Hide Stage Guide' : 'Stage Guidance'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowNonJudicialExplainModal(true)}
                      className="px-3 py-1.5 text-xs font-semibold bg-[#FAFBF9] border border-[#DFE7DB] text-[#445645] hover:text-[#1C261E] hover:border-[#CCD8C8] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-[#5A6E5D]" />
                      <span>Why Non-Judicial?</span>
                    </button>
                  </div>
                </div>

                {/* 7-Stage Interactive Pipeline Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
                  {workflowStagesList.map((stg, idx) => {
                    const isCurrent = idx === currentStageIndex;
                    const isPast = idx < currentStageIndex;
                    const isFuture = idx > currentStageIndex;

                    return (
                      <button
                        key={stg.id}
                        type="button"
                        onClick={() => handleStageBlockClick(stg.id)}
                        className={`group relative p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
                          isCurrent
                            ? 'bg-[#2D4335] text-white border-[#2D4335] shadow-md ring-2 ring-[#2D4335]/25'
                            : isPast
                            ? 'bg-[#F4F8F3] border-[#C8DAC6] text-[#233526] hover:border-[#2D4335] hover:bg-[#EDF5EC]'
                            : 'bg-[#FAFBF9] border-[#DFE7DB] text-[#445645] hover:border-[#2D4335] hover:bg-white hover:shadow-xs'
                        }`}
                      >
                        {/* Top step badge */}
                        <div className="flex items-center justify-between gap-1 w-full mb-1.5">
                          <span
                            className={`text-[10px] font-mono font-bold tracking-wider uppercase ${
                              isCurrent ? 'text-[#BCE0C3]' : isPast ? 'text-[#3E5C43]' : 'text-[#7D8F7F]'
                            }`}
                          >
                            Step {stg.stepNumber}
                          </span>

                          {isCurrent ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-[#A7C8AE] text-[#1C261E] px-1.5 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
                              ACTIVE
                            </span>
                          ) : isPast ? (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded-full">
                              <Check className="w-2.5 h-2.5 text-emerald-700" />
                              Done
                            </span>
                          ) : (
                            <span className="text-[9px] font-medium text-[#7D8F7F] bg-[#EEF2EB] px-1.5 py-0.5 rounded-full">
                              Pending
                            </span>
                          )}
                        </div>

                        {/* Title & Description */}
                        <div>
                          <span
                            className={`block text-xs font-bold leading-tight ${
                              isCurrent ? 'text-white' : 'text-[#1C261E]'
                            }`}
                          >
                            {stg.label.replace(/^\d+\.\s*/, '')}
                          </span>
                          <span
                            className={`text-[10px] mt-1 line-clamp-2 leading-snug block ${
                              isCurrent ? 'text-[#D3E4D6]' : 'text-[#697B6B]'
                            }`}
                          >
                            {stg.desc}
                          </span>
                        </div>

                        {/* Bottom Click Hint */}
                        <div className="pt-2 mt-auto border-t border-black/5 flex items-center justify-between text-[10px]">
                          {isCurrent ? (
                            <span className="text-[#C2D8C7] font-medium flex items-center gap-1">
                              <span>● In Review</span>
                            </span>
                          ) : isPast ? (
                            <span className="text-[#415C45] font-medium group-hover:underline">
                              Cleared &middot; Revisit
                            </span>
                          ) : (
                            <span className="text-[#2D4335] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                              Advance <ChevronRight className="w-3 h-3" />
                            </span>
                          )}
                          <span
                            className={`text-[9px] font-mono ${
                              isCurrent ? 'text-[#A7C8AE]' : 'text-[#849586]'
                            }`}
                          >
                            {stg.sla.includes('Hours') || stg.sla.includes('Days') ? stg.sla.split('/')[0] : ''}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Sequential Stage Navigation Bar */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAFBF9] border border-[#E3ECE0] rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={!hasPrev}
                      onClick={() => prevStage && handleStageBlockClick(prevStage.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1 transition-all ${
                        hasPrev
                          ? 'bg-white border-[#D5DFD1] text-[#2D4335] hover:bg-[#EEF3EC] cursor-pointer'
                          : 'bg-transparent border-transparent text-[#A5B5A7] cursor-not-allowed opacity-50'
                      }`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>{prevStage ? `Previous: ${prevStage.label}` : 'At Beginning'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={!hasNext}
                      onClick={() => nextStage && handleStageBlockClick(nextStage.id)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-xs ${
                        hasNext
                          ? 'bg-[#2D4335] text-white hover:bg-[#233526] cursor-pointer'
                          : 'bg-[#D3E0D1] text-[#718473] cursor-not-allowed opacity-60'
                      }`}
                    >
                      <span>{nextStage ? `Advance to Stage ${currentStageIndex + 2}: ${nextStage.label.replace(/^\d+\.\s*/, '')}` : 'Lifecycle Completed'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right text-[11px] text-[#556957]">
                    <span className="font-semibold text-[#1C261E]">Current Status: </span>
                    <span className="font-mono bg-[#EAF0E8] px-2 py-0.5 rounded text-[#2D4335] font-bold">
                      {currentStageMeta.label}
                    </span>
                    <span className="ml-2 font-mono text-[#6A7F6C]">SLA: {currentStageMeta.sla}</span>
                  </div>
                </div>

                {/* Active Stage Guidance Panel (Collapsible) */}
                {showCurrentStageDetails && (
                  <div className="bg-[#FAFBF9] border border-[#CCDBC8] rounded-xl p-4 sm:p-5 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between border-b border-[#E3ECE0] pb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#2D4335]" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D4335]">
                          Active Milestone Guidance: {currentStageMeta.label}
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono text-[#526654] bg-[#EDF3EB] px-2 py-0.5 rounded">
                        Target SLA: {currentStageMeta.sla}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#243327]">
                      <div className="space-y-1.5">
                        <span className="font-bold text-[#1C261E] block">Statutory Objective (EEA 2022 Code):</span>
                        <p className="text-[#4E6250] leading-relaxed">
                          {currentStageMeta.statutoryPurpose}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="font-bold text-[#1C261E] block">HR Procedural Checklist:</span>
                        <ul className="space-y-1">
                          {currentStageMeta.proceduralChecklist.map((chk, cIdx) => (
                            <li key={cIdx} className="flex items-start gap-1.5 text-[#3E5241]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#2D4335] shrink-0 mt-0.5" />
                              <span>{chk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-[#697B6B] border-t border-[#E3ECE0]">
                      <span>* Remind: All case notes remain strictly in the HR Case Desk and are never altered retroactively.</span>
                      {hasNext && nextStage && (
                        <button
                          type="button"
                          onClick={() => handleStageBlockClick(nextStage.id)}
                          className="font-bold text-[#2D4335] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          Ready to transition? Move to {nextStage.label} →
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-[#697B6B]">
                  * Note: Advancing administrative workflow reflects process tracking and statutory compliance milestones under South African labour law, not a determination of employee guilt or formal disciplinary conviction.
                </p>
              </div>
            );
          })()}

          {/* ================================================================= */}
          {/* MODAL 1: STAGE TRANSITION CONFIRMATION & RATIONALE MODAL */}
          {/* ================================================================= */}
          {transitionTargetStage && (() => {
            const currentStageIndex = workflowStagesList.findIndex(s => s.id === currentCase.workflowStage);
            const targetMeta = workflowStagesList.find(s => s.id === transitionTargetStage);
            const targetIndex = workflowStagesList.findIndex(s => s.id === transitionTargetStage);
            if (!targetMeta) return null;

            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
                <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#DFE7DB] shadow-2xl space-y-6">
                  {/* Modal Header */}
                  <div className="flex items-start justify-between gap-4 border-b border-[#EDF2EA] pb-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D4335] mb-1">
                        <GitBranch className="w-4 h-4" />
                        <span>Administrative Milestone Transition</span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#1C261E]">
                        Update Workflow Status
                      </h3>
                      <p className="text-xs text-[#5D6F60] mt-0.5">
                        Ref: {currentCase.id} &middot; Tracking Token: {currentCase.trackingToken}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTransitionTargetStage(null)}
                      className="p-1 text-[#6B7D6E] hover:text-[#1C261E] rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Visual Step Transition Pathway */}
                  <div className="p-4 bg-[#FAFBF9] border border-[#DEE7DA] rounded-2xl flex items-center justify-between gap-2 text-xs">
                    <div className="flex-1">
                      <span className="text-[10px] uppercase font-bold text-[#6D8070] block">Current Stage</span>
                      <span className="font-bold text-[#1C261E]">
                        Stage {currentStageIndex + 1}: {workflowStagesList[currentStageIndex]?.label.replace(/^\d+\.\s*/, '')}
                      </span>
                    </div>

                    <div className="px-3 flex items-center text-[#2D4335]">
                      <ArrowRight className="w-5 h-5" />
                    </div>

                    <div className="flex-1 text-right">
                      <span className="text-[10px] uppercase font-bold text-[#2D4335] block">Target Stage</span>
                      <span className="font-bold text-[#2D4335] bg-[#EEF5EC] px-2 py-0.5 rounded">
                        Stage {targetIndex + 1}: {targetMeta.label.replace(/^\d+\.\s*/, '')}
                      </span>
                    </div>
                  </div>

                  {/* Statutory Purpose Info Card */}
                  <div className="p-3.5 bg-[#F6FAF5] border border-[#CFDFCD] rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between text-[#2D4335] font-semibold">
                      <span>Statutory Purpose (EEA 2022 Code)</span>
                      <span className="font-mono text-[11px]">SLA: {targetMeta.sla}</span>
                    </div>
                    <p className="text-[#4E6250] leading-relaxed text-[11px]">
                      {targetMeta.statutoryPurpose}
                    </p>
                  </div>

                  {/* Transition Rationale Field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#1C261E]">
                        Administrative Transition Rationale <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-[#697B6B]">Recorded in immutable audit trail</span>
                    </div>

                    <textarea
                      rows={3}
                      value={transitionRationale}
                      onChange={e => setTransitionRationale(e.target.value)}
                      placeholder="Detail the procedural basis, triage findings, or meeting outcomes warranting this milestone transition..."
                      className="w-full p-3 text-xs bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-[#1C261E] focus:outline-none focus:ring-1 focus:ring-[#2D4335]"
                    />

                    {/* Quick Rationale Presets */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] text-[#697B6B] self-center mr-1">Quick Presets:</span>
                      {[
                        'Preliminary criteria verified under 2022 Harassment Code',
                        'Interim support & protective adjustments enacted',
                        'Independent fact-finding review panel convened',
                        'Follow-up monitoring window completed satisfactorily'
                      ].map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setTransitionRationale(preset)}
                          className="text-[10px] px-2 py-0.5 bg-[#FAFBF9] border border-[#DDE6DC] text-[#425745] hover:border-[#2D4335] hover:bg-[#EEF5EC] rounded-lg transition-all cursor-pointer"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Employee Notification Toggle */}
                  <div className="p-3 bg-[#FAFBF9] border border-[#E0E7DC] rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-[#1C261E] block">
                        Notify Reporting Employee Tracking Token
                      </span>
                      <span className="text-[11px] text-[#5C6E5E]">
                        Transmits a secure, encrypted milestone update to token {currentCase.trackingToken}.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyEmployeeOnTransition}
                        onChange={e => setNotifyEmployeeOnTransition(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#D5DFD1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2D4335]" />
                    </label>
                  </div>

                  {/* Legal Safeguard Notice */}
                  <p className="text-[11px] text-[#6E7F70] leading-snug">
                    ⚖️ <strong>Non-Judicial Notice:</strong> Advancing this administrative record reflects organisational compliance tracking under South African labour law. It does not constitute a disciplinary conviction or legal determination of guilt.
                  </p>

                  {/* Modal Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#EDF2EA]">
                    <button
                      type="button"
                      onClick={() => setTransitionTargetStage(null)}
                      className="px-4 py-2 text-xs font-semibold text-[#526654] hover:text-[#1C261E] rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleAdvanceWorkflowStage(
                          targetMeta.id,
                          transitionRationale,
                          notifyEmployeeOnTransition
                        );
                      }}
                      className="px-5 py-2.5 text-xs font-bold bg-[#2D4335] text-white hover:bg-[#233526] rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm Milestone Transition</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ================================================================= */}
          {/* MODAL 2: "WHY NON-JUDICIAL?" EDUCATIONAL GUIDANCE MODAL */}
          {/* ================================================================= */}
          {showNonJudicialExplainModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#DFE7DB] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-4 border-b border-[#EDF2EA] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#EEF5EC] text-[#2D4335] flex items-center justify-center shrink-0">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#1C261E]">
                        Why is this Tracker "Non-Judicial"?
                      </h3>
                      <p className="text-xs text-[#5D6F60] mt-0.5">
                        Understanding Dignifi's administrative role under South African workplace law
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNonJudicialExplainModal(false)}
                    className="p-1 text-[#6B7D6E] hover:text-[#1C261E] rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Core Principles Grid */}
                <div className="space-y-4 text-xs text-[#243327]">
                  <div className="p-4 bg-[#FAFBF9] border border-[#DEE7DA] rounded-2xl space-y-1.5">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#1C261E]">
                      <span className="w-5 h-5 rounded-full bg-[#2D4335] text-white flex items-center justify-center text-[11px]">1</span>
                      <span>Administrative Process vs. Judicial Determination</span>
                    </div>
                    <p className="text-[#4E6250] leading-relaxed pl-7">
                      Dignifi functions as an employee-centred documentation bridge and organisational accountability tool. It is <strong>not</strong> a criminal court, CCMA arbitration, or internal disciplinary tribunal. The 7 lifecycle stages track procedural milestones (receipt, triage, risk assessment, support interventions, independent referral, monitoring, and archival), rather than rendering a verdict of innocence or guilt.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAFBF9] border border-[#DEE7DA] rounded-2xl space-y-1.5">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#1C261E]">
                      <span className="w-5 h-5 rounded-full bg-[#2D4335] text-white flex items-center justify-center text-[11px]">2</span>
                      <span>Section 60 of the Employment Equity Act (EEA)</span>
                    </div>
                    <p className="text-[#4E6250] leading-relaxed pl-7">
                      Under South African labour law (EEA Section 60 and the <em>2022 Code of Good Practice on the Prevention and Elimination of Harassment</em>), an employer notified of alleged conduct has a statutory obligation to consult all parties and take necessary proactive steps. By methodically progressing through these 7 non-judicial milestones, the organisation demonstrates due diligence and proactive compliance without trampling procedural rights.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAFBF9] border border-[#DEE7DA] rounded-2xl space-y-1.5">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#1C261E]">
                      <span className="w-5 h-5 rounded-full bg-[#2D4335] text-white flex items-center justify-center text-[11px]">3</span>
                      <span>Preserving Procedural Fairness (Audi Alteram Partem)</span>
                    </div>
                    <p className="text-[#4E6250] leading-relaxed pl-7">
                      Before formal disciplinary action can be taken against an accused employee, fair labour standards require the right to be heard (<em>audi alteram partem</em>). Dignifi ensures that preliminary support accommodations (e.g., separating reporting lines or granting counselling) are recognized as protective and non-punitive, preventing pre-judgment.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAFBF9] border border-[#DEE7DA] rounded-2xl space-y-1.5">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#1C261E]">
                      <span className="w-5 h-5 rounded-full bg-[#2D4335] text-white flex items-center justify-center text-[11px]">4</span>
                      <span>Separation of Immutable Records from Administrative Notes</span>
                    </div>
                    <p className="text-[#4E6250] leading-relaxed pl-7">
                      The reporting employee's contemporaneous account remains permanently immutable. Administrative case progress, HR interventions, and investigator referrals are documented in an append-only audit trail, ensuring complete integrity under the Protection of Personal Information Act (POPIA).
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end pt-3 border-t border-[#EDF2EA]">
                  <button
                    type="button"
                    onClick={() => setShowNonJudicialExplainModal(false)}
                    className="px-5 py-2.5 text-xs font-bold bg-[#2D4335] text-white hover:bg-[#233526] rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Understood &middot; Close Guide
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Case Details Split: Original Account vs Administrative Desk */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Original Employee Submitted Account (Preserved & Unmodified) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-white border border-[#DFE7DB] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EDF2EA]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#2D4335]" />
                    <h3 className="font-serif text-base font-bold text-[#1C261E]">
                      Original Submitted Contemporaneous Account
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#5C6E5E] bg-[#EEF2EB] px-2 py-0.5 rounded">
                    Immutable Master Text
                  </span>
                </div>

                <div className="p-4 bg-[#FAFBF9] border border-[#DEE7DA] rounded-xl text-xs sm:text-sm text-[#1C261E] leading-relaxed whitespace-pre-wrap">
                  {currentCase.originalSubmittedAccount}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-3 bg-[#FAFBF9] border border-[#E0E7DC] rounded-xl">
                    <span className="font-semibold text-[#1C261E] block mb-1">Actors & Observers Reported:</span>
                    <p className="text-[#516352]">{currentCase.peopleInvolvedSummary}</p>
                  </div>

                  <div className="p-3 bg-[#FAFBF9] border border-[#E0E7DC] rounded-xl">
                    <span className="font-semibold text-[#1C261E] block mb-1">Perceived Harm & Impact:</span>
                    <p className="text-[#516352]">{currentCase.perceivedImpactSummary}</p>
                  </div>
                </div>
              </div>

              {/* Two-Way Encrypted Notice Dispatcher */}
              <div className="bg-white border border-[#DFE7DB] rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="font-serif text-base font-bold text-[#1C261E] flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#2D4335]" />
                  <span>Dispatch Encrypted Official Notice to Employee</span>
                </h3>
                <p className="text-xs text-[#5D6F60]">
                  This communication appears in the employee's personal tracking log (Token: {currentCase.trackingToken}).
                </p>

                <form onSubmit={handleSendOutboundNotice} className="space-y-3">
                  <textarea
                    rows={3}
                    value={outboundMessage}
                    onChange={e => setOutboundMessage(e.target.value)}
                    placeholder="Provide an empathetic, factual update regarding case intake, interim adjustments, or procedural milestones..."
                    className="w-full p-3 text-xs bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-[#1C261E] focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!outboundMessage.trim()}
                      className="px-4 py-2 bg-[#2D4335] hover:bg-[#203126] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Encrypted Notice</span>
                    </button>
                  </div>
                </form>

                {currentCase.encryptedEmployeeNotes.length > 0 && (
                  <div className="pt-3 border-t border-[#EDF2EA] space-y-2">
                    <span className="text-xs font-semibold text-[#2D4335]">Prior Outbound Notices:</span>
                    {currentCase.encryptedEmployeeNotes.map((note, i) => (
                      <div key={i} className="p-3 bg-[#FAFBF9] border border-[#DEE7DA] rounded-xl text-xs">
                        <div className="flex justify-between text-[#687B6A] text-[11px] mb-1">
                          <span className="font-semibold text-[#1C261E]">{note.officer}</span>
                          <span>{new Date(note.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-[#3F5141]">{note.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right: Administrative Assessment & Case Handler Notes */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white border border-[#DFE7DB] rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="font-serif text-base font-bold text-[#1C261E]">
                  Administrative Case Parameters
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[#596B5B] block mb-1">Assigned Case Lead:</label>
                    <input
                      type="text"
                      value={currentCase.assignedOfficer}
                      onChange={e => {
                        const val = e.target.value;
                        setCases(cases.map(c => c.id === currentCase.id ? { ...c, assignedOfficer: val } : c));
                      }}
                      className="w-full px-3 py-2 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-xs font-medium text-[#1C261E]"
                    />
                  </div>

                  <div>
                    <label className="text-[#596B5B] block mb-1">Target Review SLA Date:</label>
                    <input
                      type="date"
                      value={currentCase.reviewDueDate}
                      onChange={e => {
                        const val = e.target.value;
                        setCases(cases.map(c => c.id === currentCase.id ? { ...c, reviewDueDate: val } : c));
                      }}
                      className="w-full px-3 py-2 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-xs font-medium text-[#1C261E]"
                    />
                  </div>

                  <div>
                    <label className="text-[#596B5B] block mb-1">Confidential ER Assessment Summary:</label>
                    <textarea
                      rows={4}
                      value={currentCase.administrativeNotes}
                      onChange={e => {
                        const val = e.target.value;
                        setCases(cases.map(c => c.id === currentCase.id ? { ...c, administrativeNotes: val } : c));
                      }}
                      className="w-full p-3 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-xs text-[#1C261E]"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Actions List for This Case */}
              <div className="bg-white border border-[#DFE7DB] rounded-2xl p-6 shadow-xs space-y-3">
                <h3 className="font-serif text-base font-bold text-[#1C261E]">
                  Active Interventions ({currentCase.interventions.length})
                </h3>
                <div className="space-y-2">
                  {currentCase.interventions.map(int => (
                    <div key={int.id} className="p-3 bg-[#FAFBF9] border border-[#DEE7DA] rounded-xl text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[#1C261E]">{int.title}</span>
                        <span className="text-[10px] font-semibold text-[#2D4335] bg-[#E8EFE5] px-2 py-0.5 rounded">
                          {int.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#556756]">{int.notes}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('interventions')}
                  className="w-full py-2 bg-[#EEF2EB] hover:bg-[#DEE7DA] text-[#2D4335] text-xs font-semibold rounded-xl cursor-pointer text-center"
                >
                  Manage All Interventions &rarr;
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ACTION AND INTERVENTION MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'interventions' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1C261E]">
              Action & Intervention Management Desk
            </h2>
            <p className="text-xs sm:text-sm text-[#5D6F60]">
              Coordinate institutional remedies, psychological counseling, management training, and neutral workplace adjustments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form to log new intervention */}
            <div className="lg:col-span-5 bg-white border border-[#DFE7DB] rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-[#1C261E]">
                Log New Preventative / Remedial Action
              </h3>

              <form onSubmit={handleAddIntervention} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-[#1C261E] mb-1">Associated Case</label>
                  <select
                    value={selectedCaseId}
                    onChange={e => setSelectedCaseId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-xs"
                  >
                    {cases.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.id} - {c.title.substring(0, 35)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1C261E] mb-1">Intervention Category</label>
                  <select
                    value={newInterventionType}
                    onChange={e => setNewInterventionType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-xs"
                  >
                    <option value="support_counseling">Employee Support / EAP Psychological Counseling</option>
                    <option value="workplace_adjustment">Workplace Adjustment (Reporting Line / Calendar)</option>
                    <option value="management_consultation">Management Consultation & Climate Audit</option>
                    <option value="training">Targeted Harassment Code Training</option>
                    <option value="policy_review">Policy Review & Departmental Circular</option>
                    <option value="formal_investigation">Independent Investigation Referral</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1C261E] mb-1">Action Title / Directive</label>
                  <input
                    type="text"
                    value={newInterventionTitle}
                    onChange={e => setNewInterventionTitle(e.target.value)}
                    placeholder="e.g. Schedule mediation session with independent ombud"
                    className="w-full px-3 py-2 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#1C261E] mb-1">Assigned Personnel</label>
                    <input
                      type="text"
                      value={newInterventionAssignee}
                      onChange={e => setNewInterventionAssignee(e.target.value)}
                      placeholder="e.g. Senior ER Partner"
                      className="w-full px-3 py-2 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#1C261E] mb-1">Target Completion Date</label>
                    <input
                      type="date"
                      value={newInterventionTargetDate}
                      onChange={e => setNewInterventionTargetDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#1C261E] mb-1">Implementation Notes</label>
                  <textarea
                    rows={3}
                    value={newInterventionNotes}
                    onChange={e => setNewInterventionNotes(e.target.value)}
                    placeholder="Details regarding scope, confidentiality, and agreed milestones..."
                    className="w-full p-2.5 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#2D4335] hover:bg-[#203126] text-white font-semibold rounded-xl cursor-pointer"
                >
                  Record Action Plan
                </button>
              </form>
            </div>

            {/* Comprehensive Interventions Feed */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-serif text-base font-bold text-[#1C261E]">
                Active Organisational Remediation Portfolio
              </h3>

              <div className="space-y-3">
                {cases.flatMap(c => c.interventions.map(i => ({ ...i, caseRef: c.id, caseTitle: c.title }))).map(item => (
                  <div key={item.id} className="bg-white border border-[#DFE7DB] rounded-2xl p-5 shadow-xs space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#2D4335]">{item.caseRef}</span>
                        <span className="text-xs font-bold text-[#1C261E]">{item.title}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        item.status === 'completed' ? 'bg-[#E7EFE4] text-[#2D4335]' : 'bg-[#FEF3D6] text-[#8C5D00]'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-[#526353]">{item.notes}</p>

                    <div className="flex items-center justify-between text-[11px] text-[#697B6A] pt-2 border-t border-[#F0F5EE]">
                      <span>Assigned to: <strong>{item.assignedTo}</strong></span>
                      <span>Target: {item.targetDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ORGANISATIONAL ANALYTICS & ETHICAL GUARDRAILS */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1C261E]">
              Organisational Analytics & Emerging-Concern Detection
            </h2>
            <p className="text-xs sm:text-sm text-[#5D6F60]">
              Diagnostic insights to identify systemic patterns, training opportunities, and cultural hot-spots.
            </p>
          </div>

          {/* Mandatory Ethical Guardrail Banner */}
          <div className="bg-[#FAFBF9] border-2 border-[#D7E3D4] rounded-2xl p-5 space-y-2 text-xs text-[#354838]">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#2D4335]">
              <ShieldAlert className="w-4 h-4 text-[#2D4335]" />
              <span>Ethical Analytics & Dignity-Preserving Standard</span>
            </div>
            <p className="leading-relaxed">
              This analytics suite follows strict human-centred ethical boundaries:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[#465749]">
              <div className="p-3 bg-white rounded-xl border border-[#DFE7DB]">
                <strong>No Employee Risk Scoring:</strong> Dignifi strictly rejects algorithmic profiling, predictive perpetrator scoring, or automated credibility scoring.
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#DFE7DB]">
                <strong>Reporting ≠ Prevalence:</strong> High reporting frequency in a department indicates <em>psychological safety and trust to report</em>, not necessarily worse misconduct prevalence.
              </div>
            </div>
          </div>

          {/* Emerging Concern Indicators (Human Assessment Triggers) */}
          <div className="bg-white border border-[#DFE7DB] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1C261E] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#8C5D00]" />
              <span>Emerging-Concern Indicators for Human Review</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              <div className="p-4 bg-[#FAFBF9] border border-[#DFE7DB] rounded-xl space-y-2">
                <span className="font-bold text-[#1C261E] block">Repeat Pattern Indicator</span>
                <p className="text-[#556756] leading-relaxed">
                  2 separate reports within the Engineering infrastructure unit reference retaliatory threats following governance queries.
                </p>
                <span className="inline-block text-[10px] font-bold bg-[#FEF3D6] text-[#8C5D00] px-2 py-0.5 rounded">
                  Requires Leadership Culture Review
                </span>
              </div>

              <div className="p-4 bg-[#FAFBF9] border border-[#DFE7DB] rounded-xl space-y-2">
                <span className="font-bold text-[#1C261E] block">Offsite Environment Cluster</span>
                <p className="text-[#556756] leading-relaxed">
                  Sales summits and client dinners account for 100% of reported severe harassment allegations over the last 6 months.
                </p>
                <span className="inline-block text-[10px] font-bold bg-[#FCE8E6] text-[#A82A2A] px-2 py-0.5 rounded">
                  Policy Review on Travel Guidelines Needed
                </span>
              </div>

              <div className="p-4 bg-[#FAFBF9] border border-[#DFE7DB] rounded-xl space-y-2">
                <span className="font-bold text-[#1C261E] block">Probationary Retention Safety</span>
                <p className="text-[#556756] leading-relaxed">
                  Whistleblower report logged in heavy plant operations. Zero detrimental employment actions recorded to date.
                </p>
                <span className="inline-block text-[10px] font-bold bg-[#E7EFE4] text-[#2D4335] px-2 py-0.5 rounded">
                  Whistleblower Protected Status Active
                </span>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: GOVERNANCE AND ACCOUNTABILITY */}
      {/* ========================================================================= */}
      {activeTab === 'governance' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1C261E]">
              Governance, Access Controls & Audit Accountability
            </h2>
            <p className="text-xs sm:text-sm text-[#5D6F60]">
              Demonstrates compliance with POPIA, EEA Section 60 due diligence, and immutable records integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Role-Based Permissions & Separation */}
            <div className="lg:col-span-5 bg-white border border-[#DFE7DB] rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-[#1C261E]">
                Role-Based Permission Matrix
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-[#FAFBF9] border border-[#DFE7DB] rounded-xl">
                  <div className="flex justify-between font-bold text-[#1C261E] mb-1">
                    <span>Employee Role</span>
                    <span className="text-[#2D4335]">Local Master Vault</span>
                  </div>
                  <p className="text-[#586A5A]">Full private editing, encryption, export. Zero visibility to HR until explicitly submitted.</p>
                </div>

                <div className="p-3 bg-[#FAFBF9] border border-[#DFE7DB] rounded-xl">
                  <div className="flex justify-between font-bold text-[#1C261E] mb-1">
                    <span>Case Reviewer / HR Officer</span>
                    <span className="text-[#2D4335]">Authorized Reports Only</span>
                  </div>
                  <p className="text-[#586A5A]">Triage submitted cases, enact interventions, transmit encrypted notices back to token.</p>
                </div>

                <div className="p-3 bg-[#FAFBF9] border border-[#DFE7DB] rounded-xl">
                  <div className="flex justify-between font-bold text-[#1C261E] mb-1">
                    <span>Compliance / Auditor</span>
                    <span className="text-[#2D4335]">Governance Audit Trail</span>
                  </div>
                  <p className="text-[#586A5A]">Inspect timestamped audit trail proving employer due diligence under EEA Code.</p>
                </div>
              </div>
            </div>

            {/* Audit Trail Log */}
            <div className="lg:col-span-7 bg-white border border-[#DFE7DB] rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-[#1C261E]">
                Consolidated Governance Audit Trail
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {cases.flatMap(c => c.auditTrail.map(a => ({ ...a, caseRef: c.id }))).map(item => (
                  <div key={item.id} className="p-3 bg-[#FAFBF9] border border-[#DEE7DA] rounded-xl text-xs space-y-1">
                    <div className="flex justify-between text-[#687A69] text-[11px]">
                      <span className="font-mono font-bold text-[#2D4335]">{item.caseRef}</span>
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="font-semibold text-[#1C261E]">{item.action}</p>
                    <p className="text-[#4D6050] text-[11px]">{item.details} (By: {item.performedBy})</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: PREVENTION AND POLICY HUB */}
      {/* ========================================================================= */}
      {activeTab === 'prevention' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1C261E]">
              Prevention Resources & Statutory Guidance
            </h2>
            <p className="text-xs sm:text-sm text-[#5D6F60]">
              Institutional guidelines, training materials, and South African statutory compliance resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white border border-[#DFE7DB] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#2D4335] bg-[#EEF2EB] px-2 py-0.5 rounded">
                  Statutory Code (2022)
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1C261E] mt-2 mb-2">
                  Code of Good Practice on Prevention & Elimination of Harassment
                </h3>
                <p className="text-xs text-[#526353] leading-relaxed mb-4">
                  Government Gazette No. 46056 (March 2022). Comprehensive guidance on employer liability under Section 60, proactive workplace climate surveys, and informal conciliation frameworks.
                </p>
              </div>
              <button
                onClick={() => alert('Opening South African Harassment Code 2022 Summary Document.')}
                className="w-full py-2 bg-[#EAEFE6] hover:bg-[#DEE7DA] text-[#2D4335] text-xs font-semibold rounded-xl cursor-pointer"
              >
                View Statutory Checklist
              </button>
            </div>

            <div className="bg-white border border-[#DFE7DB] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#2D4335] bg-[#EEF2EB] px-2 py-0.5 rounded">
                  Manager Toolkit
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1C261E] mt-2 mb-2">
                  Anti-Retaliation Protocol for People Leaders
                </h3>
                <p className="text-xs text-[#526353] leading-relaxed mb-4">
                  Step-by-step guidance ensuring supervisors understand that performance reviews, shift scheduling, or committee allocations cannot be altered following a workplace query.
                </p>
              </div>
              <button
                onClick={() => alert('Downloading Anti-Retaliation Leader Guidance PDF template.')}
                className="w-full py-2 bg-[#EAEFE6] hover:bg-[#DEE7DA] text-[#2D4335] text-xs font-semibold rounded-xl cursor-pointer"
              >
                Download Manager Guide
              </button>
            </div>

            <div className="bg-white border border-[#DFE7DB] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#2D4335] bg-[#EEF2EB] px-2 py-0.5 rounded">
                  EAP & Mental Health
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1C261E] mt-2 mb-2">
                  Trauma-Informed Support & Crisis Dispatch
                </h3>
                <p className="text-xs text-[#526353] leading-relaxed mb-4">
                  Directory of South African accredited external psychological support providers (SADAG, Life EHS, TEARS Foundation) for confidential trauma debriefing.
                </p>
              </div>
              <button
                onClick={() => alert('Displaying EAP Referral Hotlines & Provider Roster.')}
                className="w-full py-2 bg-[#EAEFE6] hover:bg-[#DEE7DA] text-[#2D4335] text-xs font-semibold rounded-xl cursor-pointer"
              >
                View EAP Dispatch Directory
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
