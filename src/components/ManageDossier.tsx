import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Calendar,
  Clock,
  MapPin,
  Users,
  Paperclip,
  Printer,
  Download,
  Send,
  Plus,
  Trash2,
  FileCheck,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Star,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  AlertTriangle,
  Check,
  Bell,
  X,
  ExternalLink,
} from 'lucide-react';
import { IncidentRecord, SubsequentNote, EvidenceItem, CaseClosureFeedback } from '../types/incident';
import { generateTrackingToken } from '../utils/crypto';

interface ManageDossierProps {
  record: IncidentRecord;
  onUpdateRecord: (updated: IncidentRecord) => void;
  onDeleteRecord: (id: string) => void;
  onBack: () => void;
  onSubmitToHr: (record: IncidentRecord, isAnonymous: boolean, urgency: 'routine' | 'elevated' | 'critical_safety') => void;
  onFollowUpClosure?: (
    recordId: string,
    response: {
      status: 'satisfied' | 'unhappy_follow_up_requested' | 'resubmitted_for_escalation';
      satisfactionRating?: number;
      employeeFeedbackNotes?: string;
      followUpRequestReason?: 'unresolved_retaliation' | 'insufficient_interventions' | 'procedural_unfairness' | 'new_incidents_occurred' | 'external_escalation';
      requestedResolution?: string;
      resubmittedNewEvidence?: string;
    }
  ) => void;
}

export const ManageDossier: React.FC<ManageDossierProps> = ({
  record,
  onUpdateRecord,
  onDeleteRecord,
  onBack,
  onSubmitToHr,
  onFollowUpClosure,
}) => {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteType, setNewNoteType] = useState<SubsequentNote['noteType']>('additional_recollection');
  
  // Submit to HR modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isAnonymousSubmit, setIsAnonymousSubmit] = useState(false);
  const [urgencySubmit, setUrgencySubmit] = useState<'routine' | 'elevated' | 'critical_safety'>('elevated');

  // Case Closure & Employee Agency Review state
  const [selectedClosureDecision, setSelectedClosureDecision] = useState<'satisfied' | 'unhappy' | null>(null);
  const [satisfactionRating, setSatisfactionRating] = useState<number>(5);
  const [closureFeedbackNotes, setClosureFeedbackNotes] = useState('');
  const [followUpReason, setFollowUpReason] = useState<'unresolved_retaliation' | 'insufficient_interventions' | 'procedural_unfairness' | 'new_incidents_occurred' | 'external_escalation'>('unresolved_retaliation');
  const [requestedResolution, setRequestedResolution] = useState('');
  const [resubmittedNewEvidence, setResubmittedNewEvidence] = useState('');
  const [followUpActionType, setFollowUpActionType] = useState<'reopen_hr' | 'escalate_ccma'>('reopen_hr');
  const [showClosureForm, setShowClosureForm] = useState(false);
  const [closureSubmittedToast, setClosureSubmittedToast] = useState<string | null>(null);

  // CCMA Form viewer state
  const [showCcmaModal, setShowCcmaModal] = useState(false);

  const handleAddSubsequentNote = () => {
    if (!newNoteContent.trim()) return;

    const newNote: SubsequentNote = {
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
      authorLabel: 'Employee Observation',
      content: newNoteContent.trim(),
      noteType: newNoteType
    };

    const updated: IncidentRecord = {
      ...record,
      updatedAt: new Date().toISOString(),
      subsequentNotes: [...record.subsequentNotes, newNote]
    };

    onUpdateRecord(updated);
    setNewNoteContent('');
  };

  const handleSubmitClosureResponse = (isSatisfied: boolean) => {
    const feedbackData = {
      status: (isSatisfied
        ? 'satisfied'
        : followUpActionType === 'escalate_ccma'
        ? 'resubmitted_for_escalation'
        : 'unhappy_follow_up_requested') as 'satisfied' | 'unhappy_follow_up_requested' | 'resubmitted_for_escalation',
      satisfactionRating: isSatisfied ? satisfactionRating : 1,
      employeeFeedbackNotes: closureFeedbackNotes.trim() || (isSatisfied ? 'Employee confirmed satisfaction with outcome and support received.' : 'Dissatisfied with case closure.'),
      followUpRequestReason: isSatisfied ? undefined : followUpReason,
      requestedResolution: isSatisfied ? undefined : (requestedResolution.trim() || 'Active review and workplace intervention enforcement.'),
      resubmittedNewEvidence: isSatisfied ? undefined : resubmittedNewEvidence.trim()
    };

    if (onFollowUpClosure) {
      onFollowUpClosure(record.id, feedbackData);
    } else {
      const nowIso = new Date().toISOString();
      const updatedNotes = [...record.subsequentNotes];
      if (!isSatisfied) {
        updatedNotes.push({
          id: `note-${Date.now()}`,
          timestamp: nowIso,
          authorLabel: 'Employee Follow-Up Request',
          content: `[Post-Closure Follow-Up Requested]\nReason: ${followUpReason.replace(/_/g, ' ')}\nDetails: ${closureFeedbackNotes}\nRequested Resolution: ${requestedResolution}${resubmittedNewEvidence ? `\nNew Evidence: ${resubmittedNewEvidence}` : ''}`,
          noteType: 'retaliatory_aftermath'
        });
      }

      onUpdateRecord({
        ...record,
        updatedAt: nowIso,
        subsequentNotes: updatedNotes,
        hrCaseDetails: record.hrCaseDetails ? {
          ...record.hrCaseDetails,
          hrStatus: isSatisfied ? 'case_concluded' : 'under_preliminary_review',
          closureFeedback: {
            ...feedbackData,
            closedAt: record.hrCaseDetails.closureFeedback?.closedAt || nowIso,
            closingSummary: record.hrCaseDetails.closureFeedback?.closingSummary,
            employeeResponseAt: nowIso
          }
        } : undefined
      });
    }

    setClosureSubmittedToast(
      isSatisfied
        ? '✓ Thank you. Your confirmation of satisfaction has been recorded and synced with the HR case log.'
        : '✓ Your follow-up request has been transmitted with high priority. The case has been re-opened for active review.'
    );
    setShowClosureForm(false);
    setSelectedClosureDecision(null);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(record, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dignifi_record_${record.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatCcmaAnnexure = () => {
    return `COMMISSION FOR CONCILIATION, MEDIATION AND ARBITRATION (CCMA)
ANNEXURE TO FORM 7.11 - STATEMENT OF UNFAIR DISCRIMINATION / HARASSMENT / LABOUR DISPUTE
================================================================================
Generated via Dignifi Workplace Dignity OS · Contemporaneous Record Vault
Record ID: ${record.id}
Date Logged: ${new Date(record.createdAt).toLocaleString()}
Digital Integrity Seal (SHA-256): ${record.cryptographicHash}

1. DETAILS OF THE ALLEGED CONDUCT & CONTEXT:
--------------------------------------------------------------------------------
Primary Category: ${record.categories.join(', ')}
Date of Incident: ${record.incidentDate} ${record.incidentTime ? `at ${record.incidentTime}` : ''}
Workplace Context / Location: ${record.locationDetails} (${record.locationType})

2. CONTEMPORANEOUS ACCOUNT OF WHAT OCCURRED:
(Recorded in the employee's own words at or near the time of the event)
--------------------------------------------------------------------------------
"${record.contemporaneousNarrative}"

3. INDIVIDUALS INVOLVED & OBSERVERS:
--------------------------------------------------------------------------------
${record.peopleInvolved.map((p, i) => `[${i + 1}] ${p.nameOrRole} - Role: ${p.roleInIncident} (Seniority: ${p.approximateSeniority})`).join('\n') || 'None recorded.'}

4. PERCEIVED IMPACT ON THE EMPLOYEE:
--------------------------------------------------------------------------------
Psychological & Safety Impact: ${record.perceivedImpact.psychologicalSafety}
Professional & Career Impact: ${record.perceivedImpact.professionalImpact}
Severity Impact Rating: ${record.perceivedImpact.severityScore}/5

5. SUBSEQUENT CHRONOLOGICAL NOTES & OBSERVATIONS:
--------------------------------------------------------------------------------
${record.subsequentNotes.map((n, i) => `[Note ${i + 1} - ${new Date(n.timestamp).toLocaleString()} - Type: ${n.noteType}]\n${n.content}\n`).join('\n') || 'No subsequent amendments logged.'}

6. EVIDENCE ARTIFACTS ATTACHED:
--------------------------------------------------------------------------------
${record.evidenceItems.map((e, i) => `[Artifact ${i + 1}] ${e.title} (${e.type})\nSummary: ${e.summary}\nLocal Checksum: ${e.tamperChecksum}`).join('\n\n') || 'No external files attached.'}

================================================================================
Note: This document was generated from a tamper-evident records vault conforming
to South African Employment Equity Act Code of Good Practice (2022) guidelines.`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E2E8DC]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#3C5340] hover:text-[#1C261E] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vault</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-white border border-[#D5DFD1] hover:bg-[#F2F6EF] text-[#2D4335] text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier (PDF)</span>
          </button>

          <button
            onClick={() => setShowCcmaModal(true)}
            className="px-3.5 py-1.5 bg-[#EAEFE6] hover:bg-[#DFE8DA] text-[#2D4335] text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>CCMA Form 7.11 Helper</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-3.5 py-1.5 bg-white border border-[#D5DFD1] hover:bg-[#F2F6EF] text-[#556657] text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          {record.status !== 'submitted_to_hr' ? (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-1.5 bg-[#2D4335] hover:bg-[#203126] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit to HR</span>
            </button>
          ) : (
            <span className="px-3 py-1 bg-[#E8EFE4] text-[#2D4335] text-xs font-semibold rounded-lg border border-[#D3E0CE] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2D4335]" />
              <span>Active HR Case: {record.hrCaseDetails?.trackingToken || record.id}</span>
            </span>
          )}

          <button
            onClick={() => {
              if (confirm('Permanently delete this record and its cryptographic verification? This cannot be undone.')) {
                onDeleteRecord(record.id);
              }
            }}
            className="p-1.5 text-[#964B00] hover:text-[#7A3600] rounded-lg transition-colors cursor-pointer"
            title="Permanently Delete Record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toast Notice */}
      {closureSubmittedToast && (
        <div className="mb-6 p-4 bg-[#EAF5EC] border border-[#A7CCA8] rounded-2xl flex items-center justify-between gap-3 text-xs text-[#1C261E] animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#2D4335] text-white flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </span>
            <span className="font-semibold">{closureSubmittedToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setClosureSubmittedToast(null)}
            className="text-[#526654] hover:text-[#1C261E] p-1 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Case Closure Notification Banner at Top of Dossier */}
      {record.hrCaseDetails?.hrStatus === 'case_concluded' && (!record.hrCaseDetails.closureFeedback || record.hrCaseDetails.closureFeedback.status === 'pending_employee_response') && (
        <div className="bg-[#2D4335] text-white p-5 sm:p-6 rounded-2xl shadow-md mb-6 border border-[#3E5A44] flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
              <Bell className="w-5 h-5 text-[#A7C8AE]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#A7C8AE] text-[#1C261E] rounded-md">
                  Action Required &middot; Case Concluded
                </span>
                <span className="text-xs text-[#C5DEC9] font-mono">Ref: {record.hrCaseDetails.trackingToken}</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                Your Report Has Been Closed by the HR Case Desk
              </h3>
              <p className="text-xs text-[#DFEBE1] mt-1 max-w-2xl leading-relaxed">
                The HR Case Desk has concluded this matter. Dignifi ensures that employee agency is respected: please review this outcome to confirm if you are satisfied, or if you need to submit a follow-up or resubmit if you are unhappy.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('closure-review-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              setShowClosureForm(true);
            }}
            className="px-5 py-2.5 bg-white text-[#2D4335] hover:bg-[#EEF5EC] text-xs font-bold rounded-xl shrink-0 shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
          >
            <span>Review Outcome & Respond →</span>
          </button>
        </div>
      )}

      {/* Record Main Container */}
      <div className="bg-white border border-[#E0E7DC] rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
        
        {/* Title & Core Metadata */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C6E5F] mb-2">
            <span className="font-mono text-[#2D4335] font-bold">{record.id}</span>
            <span aria-hidden="true">·</span>
            <span>Recorded {new Date(record.createdAt).toLocaleDateString()}</span>
            <span aria-hidden="true">·</span>
            <span>Status: {record.status === 'submitted_to_hr' ? 'Submitted to HR Case Desk' : 'Encrypted in Personal Vault'}</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C261E] mb-3">
            {record.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#4F6152] bg-[#F7F9F5] p-3 rounded-xl border border-[#EDF2EA]">
            <span><strong>Date Occurred:</strong> {record.incidentDate} {record.incidentTime && `at ${record.incidentTime}`}</span>
            <span aria-hidden="true">·</span>
            <span><strong>Location / Channel:</strong> {record.locationDetails}</span>
            <span aria-hidden="true">·</span>
            <span><strong>Facets:</strong> {record.categories.join(', ')}</span>
          </div>
        </div>

        {/* SECTION 1: CONTEMPORANEOUS FIRST-HAND ACCOUNT (LOCKED & HASHED) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2D4335]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#203324]">
                1. Contemporaneous First-Hand Account
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#586A5A] bg-[#EEF4EC] px-2.5 py-0.5 rounded-full border border-[#DDE7DA]">
              Tamper Hash: {record.cryptographicHash.substring(0, 16)}...
            </span>
          </div>
          <p className="text-[11px] text-[#637565] mb-2.5">
            Preserved exactly as written contemporaneously. This original statement is locked to maintain forensic and labour integrity.
          </p>

          <div className="p-4 bg-[#FAFBF9] border border-[#DEE7DA] rounded-xl text-sm text-[#1C261E] leading-relaxed whitespace-pre-wrap font-sans">
            {record.contemporaneousNarrative}
          </div>
        </div>

        {/* SECTION 2: SUBSEQUENT NOTES & OBSERVATIONS (Strictly Separated) */}
        <div className="mb-8 border-t border-[#EDF2EA] pt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#203324]">
              2. Subsequent Chronological Notes & Updates
            </h2>
            <span className="text-xs text-[#5D6F60]">
              {record.subsequentNotes.length} note{record.subsequentNotes.length === 1 ? '' : 's'} appended
            </span>
          </div>
          <p className="text-[11px] text-[#637565] mb-4">
            Under records-management principles, any new recollections, witness conversations, or retaliation aftermath must be recorded as separate, timestamped additions rather than altering original statements.
          </p>

          {record.subsequentNotes.length > 0 ? (
            <div className="space-y-3 mb-4">
              {record.subsequentNotes.map((note, idx) => (
                <div key={note.id} className="p-3.5 bg-[#F9FAF7] border border-[#DFE7DB] rounded-xl text-xs">
                  <div className="flex items-center justify-between text-[#596B5B] mb-1.5">
                    <span className="font-semibold text-[#203225]">
                      Note #{idx + 1} · {note.noteType.replace('_', ' ')}
                    </span>
                    <span>{new Date(note.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-[#1C261E] leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#718273] italic mb-4">
              No subsequent notes appended yet. Use the form below to record any new observations.
            </p>
          )}

          {/* Add Subsequent Note Box */}
          <div className="p-4 bg-[#F5F8F2] border border-[#D9E4D4] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#203225]">
                Append a New Observation or Update
              </label>
              <select
                value={newNoteType}
                onChange={e => setNewNoteType(e.target.value as any)}
                className="text-xs bg-white border border-[#D5DFD1] px-2.5 py-1 rounded-lg text-[#1C261E]"
              >
                <option value="additional_recollection">Additional Recollection</option>
                <option value="witness_conversation">Witness Conversation</option>
                <option value="retaliatory_aftermath">Retaliatory Aftermath / Detriment</option>
                <option value="medical_consultation">Medical / Counseling Consultation</option>
              </select>
            </div>

            <textarea
              rows={3}
              value={newNoteContent}
              onChange={e => setNewNoteContent(e.target.value)}
              placeholder="Record subsequent information with exact time, who you spoke with, or any subsequent adverse workplace reaction..."
              className="w-full px-3 py-2 bg-white border border-[#D5DFD1] rounded-xl text-xs text-[#1C261E] focus:outline-none focus:ring-1 focus:ring-[#2D4335]"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddSubsequentNote}
                className="px-4 py-2 bg-[#2D4335] hover:bg-[#203126] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Append Note to Record</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: PEOPLE INVOLVED & EVIDENCE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#EDF2EA] pt-6 mb-8">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#203324] mb-3">
              Individuals Involved ({record.peopleInvolved.length})
            </h3>
            {record.peopleInvolved.length > 0 ? (
              <div className="space-y-2">
                {record.peopleInvolved.map(person => (
                  <div key={person.id} className="p-2.5 bg-[#FAFBF9] border border-[#E0E8DC] rounded-lg text-xs">
                    <p className="font-semibold text-[#1C261E]">{person.nameOrRole}</p>
                    <div className="flex items-center gap-2 text-[#647566] text-[11px] mt-0.5">
                      <span>Role: {person.roleInIncident.replace('_', ' ')}</span>
                      <span>·</span>
                      <span>Seniority: {person.approximateSeniority?.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6F8071] italic">No individuals listed.</p>
            )}
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#203324] mb-3">
              Attached Artifacts & Files ({record.evidenceItems.length})
            </h3>
            {record.evidenceItems.length > 0 ? (
              <div className="space-y-2">
                {record.evidenceItems.map(item => (
                  <div key={item.id} className="p-2.5 bg-[#FAFBF9] border border-[#E0E8DC] rounded-lg text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1C261E]">{item.title}</span>
                      <span className="text-[10px] text-[#637465]">({item.type})</span>
                    </div>
                    <p className="text-[11px] text-[#647566] mt-0.5">{item.summary}</p>
                    <p className="font-mono text-[9px] text-[#718273] mt-1">Checksum: {item.tamperChecksum}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6F8071] italic">No evidence files recorded.</p>
            )}
          </div>
        </div>

        {/* SECTION 4: IMPACT STATEMENT & REFLECTION */}
        <div className="border-t border-[#EDF2EA] pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#203324] mb-3">
            Perceived Impact & Personal Reflection
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-[#FAFBF9] border border-[#E0E8DC] rounded-xl">
              <span className="font-semibold text-[#203225] block mb-1">Psychological Safety & Wellbeing:</span>
              <p className="text-[#435446]">{record.perceivedImpact.psychologicalSafety}</p>
            </div>
            <div className="p-3 bg-[#FAFBF9] border border-[#E0E8DC] rounded-xl">
              <span className="font-semibold text-[#203225] block mb-1">Professional & Career Impact:</span>
              <p className="text-[#435446]">{record.perceivedImpact.professionalImpact}</p>
            </div>
          </div>
        </div>

        {/* If this record has active HR Case Status, show HR updates */}
        {record.hrCaseDetails && (
          <div className="mt-8 border-t border-[#DFE7DB] pt-6 bg-[#F6F9F3] p-5 rounded-2xl border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D4335]" />
                <h3 className="text-sm font-bold text-[#1C261E]">
                  HR Case Tracking Portal ({record.hrCaseDetails.trackingToken})
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#2D4335] bg-[#E3EDE0] px-2.5 py-1 rounded-md">
                Status: {record.hrCaseDetails.hrStatus.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs text-[#556757] mb-4">
              Assigned Lead: <strong>{record.hrCaseDetails.assignedOfficer}</strong> · Submitted: {new Date(record.hrCaseDetails.submittedAt).toLocaleDateString()}
            </p>

            {record.hrCaseDetails.secureNotesToEmployee && record.hrCaseDetails.secureNotesToEmployee.length > 0 && (
              <div className="space-y-2 mb-4">
                <label className="text-xs font-semibold text-[#203225]">Messages from HR Case Officer:</label>
                {record.hrCaseDetails.secureNotesToEmployee.map((msg, i) => (
                  <div key={i} className="p-3 bg-white border border-[#D5DFD1] rounded-xl text-xs">
                    <div className="flex justify-between text-[#687869] mb-1 text-[11px]">
                      <span className="font-semibold text-[#1C261E]">{msg.officer}</span>
                      <span>{new Date(msg.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-[#1C261E] leading-relaxed">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Case Closure Notification & Employee Agency Review Section */}
            {(record.hrCaseDetails.hrStatus === 'case_concluded' || record.hrCaseDetails.closureFeedback) && (
              <div id="closure-review-section" className="mt-6 pt-5 border-t border-[#DFE7DB] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2D4335]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C261E]">
                      Case Closure & Employee Agency Review
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-[#E2ECE0] text-[#2D4335] px-2 py-0.5 rounded">
                    {record.hrCaseDetails.closureFeedback?.status === 'satisfied'
                      ? '✓ Closed with Employee Consent'
                      : record.hrCaseDetails.closureFeedback?.status === 'unhappy_follow_up_requested'
                      ? '⚠️ Active Follow-Up Reopened'
                      : record.hrCaseDetails.closureFeedback?.status === 'resubmitted_for_escalation'
                      ? '⚖️ External CCMA Escalation'
                      : 'Pending Employee Response'}
                  </span>
                </div>

                <div className="p-4 bg-white border border-[#D5E0D2] rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between text-[#5D6F60]">
                    <span className="font-semibold text-[#1C261E]">Administrative Closure Record:</span>
                    <span>Closed: {new Date(record.hrCaseDetails.closureFeedback?.closedAt || record.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[#3C4E40] leading-relaxed italic bg-[#F8FAF7] p-2.5 rounded-lg border border-[#EDF2EA]">
                    "{record.hrCaseDetails.closureFeedback?.closingSummary || 'All administrative milestones and support interventions have been concluded under the 2022 Harassment Code.'}"
                  </p>
                </div>

                {/* Interactive Satisfaction Check or Existing Feedback Display */}
                {(!record.hrCaseDetails.closureFeedback || record.hrCaseDetails.closureFeedback.status === 'pending_employee_response' || showClosureForm) ? (
                  <div className="p-5 bg-white border-2 border-[#2D4335]/30 rounded-2xl shadow-xs space-y-4">
                    <div>
                      <h4 className="font-serif text-base font-bold text-[#1C261E]">
                        Are you satisfied with how this report was concluded?
                      </h4>
                      <p className="text-xs text-[#5C6E5F] mt-1 leading-relaxed">
                        In Dignifi, closure by HR is not the final word unless you agree. If the situation has been resolved and you feel protected, please confirm your satisfaction. If you are unhappy, experiencing retaliation, or feel that agreed measures were inadequate, you are entitled to request a follow-up or resubmit for formal escalation.
                      </p>
                    </div>

                    {/* Decision Choice Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedClosureDecision('satisfied')}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                          selectedClosureDecision === 'satisfied'
                            ? 'bg-[#EBF5ED] border-[#2D4335] ring-2 ring-[#2D4335]/20 shadow-xs'
                            : 'bg-[#FAFBF9] border-[#DFE7DB] hover:border-[#2D4335]'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#2D4335] text-white flex items-center justify-center shrink-0 mt-0.5">
                          <ThumbsUp className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-[#1C261E]">
                            Yes, I am satisfied with this outcome
                          </span>
                          <span className="text-[11px] text-[#556958] mt-1 block leading-snug">
                            Workplace adjustments are working, support was provided, and no further action is needed at this time.
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedClosureDecision('unhappy')}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                          selectedClosureDecision === 'unhappy'
                            ? 'bg-[#FFF7ED] border-[#C2410C] ring-2 ring-[#C2410C]/20 shadow-xs'
                            : 'bg-[#FAFBF9] border-[#DFE7DB] hover:border-[#C2410C]'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#C2410C] text-white flex items-center justify-center shrink-0 mt-0.5">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-[#1C261E]">
                            No, I am unhappy / Wish to follow up or resubmit
                          </span>
                          <span className="text-[11px] text-[#556958] mt-1 block leading-snug">
                            Retaliation is occurring, commitments were broken, or I wish to reopen active review or escalate externally.
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* Satisfied Sub-Form */}
                    {selectedClosureDecision === 'satisfied' && (
                      <div className="p-4 bg-[#F5FAF6] border border-[#CCDDC9] rounded-xl space-y-3 animate-in fade-in duration-150 text-xs">
                        <div>
                          <label className="font-semibold text-[#1C261E] block mb-1">
                            Rate your experience with the administrative support received:
                          </label>
                          <div className="flex items-center gap-1.5 pt-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setSatisfactionRating(star)}
                                className="p-1 cursor-pointer transition-transform hover:scale-110"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    star <= satisfactionRating
                                      ? 'fill-amber-400 text-amber-500'
                                      : 'text-[#C5D4C3]'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="text-[11px] text-[#556958] ml-2 font-medium">
                              ({satisfactionRating} of 5 Stars)
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold text-[#1C261E] block mb-1">
                            Optional Closing Reflections:
                          </label>
                          <textarea
                            rows={2}
                            value={closureFeedbackNotes}
                            onChange={e => setClosureFeedbackNotes(e.target.value)}
                            placeholder="Share any comments regarding what went well, team adjustments, or suggestions for the workplace..."
                            className="w-full p-2.5 bg-white border border-[#CCDDC9] rounded-lg text-xs text-[#1C261E] focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          {showClosureForm && (
                            <button
                              type="button"
                              onClick={() => {
                                setShowClosureForm(false);
                                setSelectedClosureDecision(null);
                              }}
                              className="px-3 py-1.5 text-xs text-[#556958] hover:text-[#1C261E] cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleSubmitClosureResponse(true)}
                            className="px-5 py-2 bg-[#2D4335] hover:bg-[#223528] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm & Acknowledge Closure</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Unhappy Sub-Form */}
                    {selectedClosureDecision === 'unhappy' && (
                      <div className="p-4 bg-[#FFF9F2] border border-[#FED7AA] rounded-xl space-y-4 animate-in fade-in duration-150 text-xs">
                        <div>
                          <label className="font-bold text-[#1C261E] block mb-1">
                            Primary reason for dissatisfaction: <span className="text-red-600">*</span>
                          </label>
                          <select
                            value={followUpReason}
                            onChange={e => setFollowUpReason(e.target.value as any)}
                            className="w-full p-2.5 bg-white border border-[#FDBA74] rounded-lg text-xs text-[#1C261E]"
                          >
                            <option value="unresolved_retaliation">Ongoing Retaliation or Backlash from Managers/Colleagues</option>
                            <option value="insufficient_interventions">Agreed Workplace Adjustments or Commitments Were Not Enacted</option>
                            <option value="procedural_unfairness">Procedural Inadequacy / Allegations Were Not Thoroughly Addressed</option>
                            <option value="new_incidents_occurred">New Conduct or Retaliatory Detriment Occurred After Submission</option>
                            <option value="external_escalation">Requesting External Statutory Escalation (CCMA / Bargaining Council)</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-[#1C261E] block mb-1">
                            Explain why you are unhappy and what further action is required: <span className="text-red-600">*</span>
                          </label>
                          <textarea
                            rows={3}
                            value={closureFeedbackNotes}
                            onChange={e => setClosureFeedbackNotes(e.target.value)}
                            placeholder="Detail what went unaddressed, any subtle or overt detriment experienced, or why you disagree with closing this matter..."
                            className="w-full p-2.5 bg-white border border-[#FDBA74] rounded-lg text-xs text-[#1C261E] focus:outline-none focus:ring-1 focus:ring-[#C2410C]"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-[#1C261E] block mb-1">
                            Any new evidence, dates, or witnesses since the report:
                          </label>
                          <textarea
                            rows={2}
                            value={resubmittedNewEvidence}
                            onChange={e => setResubmittedNewEvidence(e.target.value)}
                            placeholder="Mention any new emails, meetings, exclusion from project tasks, or adverse performance actions..."
                            className="w-full p-2.5 bg-white border border-[#FDBA74] rounded-lg text-xs text-[#1C261E] focus:outline-none"
                          />
                        </div>

                        {/* Desired Action Pathway */}
                        <div className="space-y-2 pt-1 border-t border-[#FFEDD5]">
                          <label className="font-bold text-[#1C261E] block">
                            Select desired follow-up pathway:
                          </label>
                          
                          <label className="flex items-start gap-2.5 p-3 bg-white border border-[#FED7AA] rounded-xl cursor-pointer hover:border-[#EA580C]">
                            <input
                              type="radio"
                              name="followUpAction"
                              checked={followUpActionType === 'reopen_hr'}
                              onChange={() => setFollowUpActionType('reopen_hr')}
                              className="mt-0.5 text-[#C2410C] focus:ring-[#C2410C]"
                            />
                            <div>
                              <span className="font-bold text-[#1C261E] block">
                                Reopen Case for Active HR Follow-Up Review
                              </span>
                              <span className="text-[11px] text-[#697B6B] leading-snug block">
                                Re-activates the case in the HR Case Desk under Stage 6 (Follow-Up) with high-priority alert to assign emergency adjustments.
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start gap-2.5 p-3 bg-white border border-[#FED7AA] rounded-xl cursor-pointer hover:border-[#EA580C]">
                            <input
                              type="radio"
                              name="followUpAction"
                              checked={followUpActionType === 'escalate_ccma'}
                              onChange={() => setFollowUpActionType('escalate_ccma')}
                              className="mt-0.5 text-[#C2410C] focus:ring-[#C2410C]"
                            />
                            <div>
                              <span className="font-bold text-[#1C261E] block">
                                Resubmit for External Statutory Escalation (CCMA Referral)
                              </span>
                              <span className="text-[11px] text-[#697B6B] leading-snug block">
                                Reopens case record and prepares statutory CCMA Form 7.11 dispute statement under Section 10 of the Employment Equity Act.
                              </span>
                            </div>
                          </label>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#FFEDD5]">
                          {showClosureForm && (
                            <button
                              type="button"
                              onClick={() => {
                                setShowClosureForm(false);
                                setSelectedClosureDecision(null);
                              }}
                              className="px-3 py-1.5 text-xs text-[#556958] hover:text-[#1C261E] cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={!closureFeedbackNotes.trim()}
                            onClick={() => handleSubmitClosureResponse(false)}
                            className={`px-5 py-2.5 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all ${
                              closureFeedbackNotes.trim()
                                ? 'bg-[#C2410C] hover:bg-[#9A3412] text-white cursor-pointer'
                                : 'bg-[#FED7AA] text-[#7C2D12] cursor-not-allowed opacity-60'
                            }`}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Submit Follow-Up & Reopen Review</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Display existing recorded response */
                  <div className="space-y-3">
                    {record.hrCaseDetails.closureFeedback?.status === 'satisfied' ? (
                      <div className="p-4 bg-[#EDF6EF] border border-[#BCD4BE] rounded-xl text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#2D4335] flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-[#2D4335]" />
                            <span>You Confirmed Satisfaction with Case Closure</span>
                          </span>
                          <span className="text-[11px] text-[#556958]">
                            Recorded: {new Date(record.hrCaseDetails.closureFeedback.employeeResponseAt || '').toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= (record.hrCaseDetails?.closureFeedback?.satisfactionRating || 5)
                                  ? 'fill-amber-400 text-amber-500'
                                  : 'text-[#D0DFCE]'
                              }`}
                            />
                          ))}
                          <span className="text-[11px] text-[#556958] ml-2">
                            ({record.hrCaseDetails.closureFeedback.satisfactionRating || 5} Stars)
                          </span>
                        </div>
                        {record.hrCaseDetails.closureFeedback.employeeFeedbackNotes && (
                          <p className="text-[#3C4F40] bg-white p-2.5 rounded-lg border border-[#CCDDC9]">
                            "{record.hrCaseDetails.closureFeedback.employeeFeedbackNotes}"
                          </p>
                        )}
                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setShowClosureForm(true)}
                            className="text-[11px] text-[#2D4335] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <span>Circumstances changed or new occurrences? Request follow-up →</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-[#FFF7ED] border border-[#FDBA74] rounded-xl text-xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#C2410C] flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-[#C2410C]" />
                            <span>Active Follow-Up / Escalation In Progress</span>
                          </span>
                          <span className="text-[11px] text-[#9A3412]">
                            Logged: {new Date(record.hrCaseDetails.closureFeedback?.employeeResponseAt || '').toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[#7C2D12]">
                          <strong>Dissatisfaction Reason:</strong> {record.hrCaseDetails.closureFeedback?.followUpRequestReason?.replace(/_/g, ' ')}
                        </p>
                        <div className="bg-white p-2.5 rounded-lg border border-[#FED7AA] space-y-1 text-[#431407]">
                          <span className="font-semibold block text-[11px]">Follow-Up Statement:</span>
                          <p className="whitespace-pre-wrap">{record.hrCaseDetails.closureFeedback?.employeeFeedbackNotes}</p>
                          {record.hrCaseDetails.closureFeedback?.resubmittedNewEvidence && (
                            <p className="mt-1 pt-1 border-t border-[#FFEDD5] text-[11px] text-[#7C2D12]">
                              <strong>Supplementary Evidence:</strong> {record.hrCaseDetails.closureFeedback.resubmittedNewEvidence}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-[#9A3412]">
                            HR Case Desk has been alerted with high priority.
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowCcmaModal(true)}
                            className="px-3 py-1 bg-[#C2410C] text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>View CCMA Form 7.11 Helper</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* MODAL: SUBMIT TO HR */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D6DFD2] rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in duration-150">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1C261E]">
                Package & Submit Incident to HR
              </h3>
              <p className="text-xs text-[#5D6F60] mt-1">
                Submitting creates an encrypted transmission directly to the HR Case Officer portal. You retain your local master copy.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Anonymity Option */}
              <div className="p-3.5 bg-[#FAFBF9] border border-[#E0E7DC] rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#1C261E]">
                  <input
                    type="checkbox"
                    checked={isAnonymousSubmit}
                    onChange={e => setIsAnonymousSubmit(e.target.checked)}
                    className="rounded text-[#2D4335] focus:ring-[#2D4335]"
                  />
                  <span>Submit Anonymously</span>
                </label>
                <p className="text-[11px] text-[#657667] mt-1 ml-5">
                  Your identity and name will be stripped from the dossier. You will receive a unique tracking token (e.g. DIG-8921-X) to monitor HR updates privately.
                </p>
              </div>

              {/* Urgency Level */}
              <div>
                <label className="block font-semibold text-[#1C261E] mb-1.5">
                  Triage Urgency Tier
                </label>
                <select
                  value={urgencySubmit}
                  onChange={e => setUrgencySubmit(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-xs text-[#1C261E]"
                >
                  <option value="routine">Routine: Review within 5 business days</option>
                  <option value="elevated">Elevated: Immediate review (Harassment / Retaliation risks)</option>
                  <option value="critical_safety">Critical: Imminent safety hazard / Physical GBV crisis</option>
                </select>
              </div>

              <div className="p-3 bg-[#F4F7F1] border border-[#DDE7DA] rounded-xl text-[11px] text-[#445849]">
                <strong>South African Labour Law Note:</strong> Submitting formal notice to HR triggers your employer's legal duty under Section 60 of the Employment Equity Act to eliminate harassment and investigate without victimizing the reporting employee.
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5A6C5D] hover:text-[#1C261E] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSubmitToHr(record, isAnonymousSubmit, urgencySubmit);
                  setShowSubmitModal(false);
                }}
                className="px-5 py-2 bg-[#2D4335] hover:bg-[#203126] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm Encrypted Submission</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CCMA FORM 7.11 HELPER */}
      {showCcmaModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D6DFD2] rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C261E]">
                  CCMA Form 7.11 Evidentiary Annexure Draft
                </h3>
                <p className="text-xs text-[#5D6F60]">
                  Pre-formatted text compliant with CCMA dispute referral requirements in South Africa.
                </p>
              </div>
              <button
                onClick={() => setShowCcmaModal(false)}
                className="text-xs font-semibold text-[#596B5C] hover:text-[#1C261E]"
              >
                Close
              </button>
            </div>

            <textarea
              readOnly
              value={formatCcmaAnnexure()}
              className="w-full flex-1 p-3 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl font-mono text-xs text-[#1C261E] focus:outline-none min-h-[300px]"
            />

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-[#697A6B]">
                Copy this text to paste into Annexure Section 4 of CCMA Form 7.11.
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(formatCcmaAnnexure());
                  alert('CCMA Annexure text copied to clipboard!');
                }}
                className="px-4 py-2 bg-[#2D4335] hover:bg-[#203126] text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
