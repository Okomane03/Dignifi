import React, { useState } from 'react';
import {
  ShieldCheck,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Lock,
  MessageSquare,
  FileText,
  UserCheck,
  Send,
  Plus,
  Clock,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { IncidentRecord, HrCaseRecord } from '../types/incident';

interface HrPortalProps {
  records: IncidentRecord[];
  onUpdateRecord: (updated: IncidentRecord) => void;
  onOpenIntegrationsModal: () => void;
}

export const HrPortal: React.FC<HrPortalProps> = ({
  records,
  onUpdateRecord,
  onOpenIntegrationsModal,
}) => {
  const hrCases = records.filter(r => r.status === 'submitted_to_hr' || r.hrCaseDetails);

  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    hrCases.length > 0 ? hrCases[0].id : ''
  );
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // New HR Action log state
  const [actionDesc, setActionDesc] = useState('');
  const [shareWithEmployee, setShareWithEmployee] = useState(true);

  // New Secure Note to employee state
  const [employeeNote, setEmployeeNote] = useState('');

  const currentCase = hrCases.find(c => c.id === selectedCaseId);

  const handleAddActionLog = () => {
    if (!currentCase || !actionDesc.trim() || !currentCase.hrCaseDetails) return;

    const newLog = {
      timestamp: new Date().toISOString(),
      actionBy: 'HR Case Partner (You)',
      actionDescription: actionDesc.trim(),
      isSharedWithEmployee: shareWithEmployee
    };

    const updatedCase: IncidentRecord = {
      ...currentCase,
      updatedAt: new Date().toISOString(),
      hrCaseDetails: {
        ...currentCase.hrCaseDetails,
        hrActionLogs: [newLog, ...(currentCase.hrCaseDetails.hrActionLogs || [])]
      }
    };

    onUpdateRecord(updatedCase);
    setActionDesc('');
  };

  const handleSendNoteToEmployee = () => {
    if (!currentCase || !employeeNote.trim() || !currentCase.hrCaseDetails) return;

    const newNote = {
      timestamp: new Date().toISOString(),
      officer: 'HR Employee Relations Officer',
      message: employeeNote.trim()
    };

    const updatedCase: IncidentRecord = {
      ...currentCase,
      updatedAt: new Date().toISOString(),
      hrCaseDetails: {
        ...currentCase.hrCaseDetails,
        secureNotesToEmployee: [newNote, ...(currentCase.hrCaseDetails.secureNotesToEmployee || [])]
      }
    };

    onUpdateRecord(updatedCase);
    setEmployeeNote('');
    alert('Encrypted acknowledgment dispatched to employee portal.');
  };

  const handleUpdateStatus = (newStatus: HrCaseRecord['hrStatus']) => {
    if (!currentCase || !currentCase.hrCaseDetails) return;

    const updatedCase: IncidentRecord = {
      ...currentCase,
      updatedAt: new Date().toISOString(),
      hrCaseDetails: {
        ...currentCase.hrCaseDetails,
        hrStatus: newStatus,
        hrActionLogs: [
          {
            timestamp: new Date().toISOString(),
            actionBy: 'HR Case Officer',
            actionDescription: `Case status changed to: ${newStatus.replace(/_/g, ' ')}`,
            isSharedWithEmployee: true
          },
          ...(currentCase.hrCaseDetails.hrActionLogs || [])
        ]
      }
    };

    onUpdateRecord(updatedCase);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      
      {/* Top HR Banner & Notification Alert */}
      <div className="bg-[#2D4335] text-white rounded-2xl p-6 sm:p-7 shadow-md mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#C5D8C9] mb-1 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#A7C8AE]" />
              <span>Encrypted HR Case Management Portal</span>
              <span>·</span>
              <span>South African Harassment Code Protocol</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Employee Relations & Case Governance
            </h2>
            <p className="text-xs sm:text-sm text-[#DFEBE2] mt-1 max-w-2xl leading-relaxed">
              When an employee submits an incident via Dignifi, an immediate encrypted notification is routed here for swift triage, objective inquiry, and audit-proof compliance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenIntegrationsModal}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 border border-white/20 cursor-pointer"
            >
              <span>HRIS & Webhook Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Cases List vs Case Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Submitted Cases List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#1C261E]">
              Submitted Incidents ({hrCases.length})
            </h3>
            <span className="text-xs text-[#5D6F60]">
              Real-Time Encrypted Stream
            </span>
          </div>

          {hrCases.length === 0 ? (
            <div className="bg-white border border-[#E0E7DC] rounded-2xl p-8 text-center text-xs text-[#637566]">
              <Lock className="w-8 h-8 text-[#8B9D8D] mx-auto mb-2" />
              <p className="font-semibold text-sm text-[#1C261E] mb-1">No Active HR Submissions</p>
              <p>Employees are currently holding their records in their private offline vaults.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {hrCases.map(item => {
                const isSelected = selectedCaseId === item.id;
                const details = item.hrCaseDetails;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCaseId(item.id)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-[#2D4335] shadow-sm'
                        : 'bg-[#FAFBF9] border-[#DFE7DB] hover:border-[#CCD8C8]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-[#2D4335]">
                        {details?.trackingToken || item.id}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        details?.urgency === 'critical_safety'
                          ? 'bg-[#FCE8E6] text-[#A82A2A]'
                          : details?.urgency === 'elevated'
                          ? 'bg-[#FEF3D6] text-[#8C5D00]'
                          : 'bg-[#EAF2E7] text-[#2D4335]'
                      }`}>
                        {details?.urgency || 'elevated'}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-[#1C261E] mb-1 line-clamp-1">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-[#657667] mb-2">
                      <span>Occurred: {item.incidentDate}</span>
                      <span>·</span>
                      <span>{item.categories.slice(0, 2).join(', ')}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#EDF2EA]">
                      <span className="text-[#3F5342] font-medium">
                        Status: {details?.hrStatus.replace(/_/g, ' ') || 'Received'}
                      </span>
                      <span className="text-[#728374]">
                        {details?.isAnonymous ? 'Anonymous' : 'Named Employee'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Case Governance & Investigation Desk */}
        <div className="lg:col-span-7">
          {currentCase && currentCase.hrCaseDetails ? (
            <div className="bg-white border border-[#E0E7DC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              
              {/* Case Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-5 border-b border-[#EDF2EA]">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#5C6E5F] mb-1">
                    <span className="font-mono font-bold text-[#2D4335]">
                      Token: {currentCase.hrCaseDetails.trackingToken}
                    </span>
                    <span>·</span>
                    <span>Received: {new Date(currentCase.hrCaseDetails.submittedAt).toLocaleString()}</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C261E]">
                    {currentCase.title}
                  </h3>
                  <p className="text-xs text-[#607162] mt-0.5">
                    Reporter Mode: <strong>{currentCase.hrCaseDetails.isAnonymous ? 'Protected Anonymous Reporter' : 'Named Employee Submission'}</strong>
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-xs font-semibold text-[#2D4335] bg-[#E8EFE5] px-2.5 py-1 rounded-md">
                    Urgency: {currentCase.hrCaseDetails.urgency.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-[#6E8070]">
                    Lead: {currentCase.hrCaseDetails.assignedOfficer}
                  </span>
                </div>
              </div>

              {/* Status Selector */}
              <div className="p-4 bg-[#F8FAF6] border border-[#DEE8DB] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-semibold text-[#203225]">
                  Case Lifecycle Stage:
                </span>
                <select
                  value={currentCase.hrCaseDetails.hrStatus}
                  onChange={e => handleUpdateStatus(e.target.value as any)}
                  className="text-xs font-semibold bg-white border border-[#D5DFD1] rounded-lg px-3 py-1.5 text-[#1C261E] focus:outline-none"
                >
                  <option value="received">1. Received & Logged</option>
                  <option value="under_preliminary_review">2. Under Preliminary Review</option>
                  <option value="formal_inquiry_opened">3. Formal Inquiry Opened</option>
                  <option value="informal_mediation">4. Informal Mediation Offered</option>
                  <option value="corrective_action_enacted">5. Corrective Action Enacted</option>
                  <option value="case_concluded">6. Case Concluded & Retained</option>
                </select>
              </div>

              {/* Employee Contemporaneous Account */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#203225]">
                    Documented Contemporaneous Account
                  </h4>
                  <span className="font-mono text-[10px] text-[#697B6B] bg-[#EEF4EC] px-2 py-0.5 rounded">
                    SHA-256 Verified
                  </span>
                </div>
                <div className="p-4 bg-[#FAFBF9] border border-[#DEE7DA] rounded-xl text-xs sm:text-sm text-[#1C261E] leading-relaxed whitespace-pre-wrap">
                  {currentCase.contemporaneousNarrative}
                </div>
              </div>

              {/* People Involved & Perceived Impact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-[#FAFBF9] border border-[#DEE7DA] rounded-xl">
                  <span className="font-semibold text-[#1C261E] block mb-1">Reported Actors & Witnesses:</span>
                  <ul className="space-y-1 text-[#4B5E4E]">
                    {currentCase.peopleInvolved.map((p, i) => (
                      <li key={i}>
                        • {p.nameOrRole} ({p.roleInIncident.replace('_', ' ')})
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-[#FAFBF9] border border-[#DEE7DA] rounded-xl">
                  <span className="font-semibold text-[#1C261E] block mb-1">Perceived Workplace Impact:</span>
                  <p className="text-[#4B5E4E]">{currentCase.perceivedImpact.psychologicalSafety}</p>
                  <p className="text-[#4B5E4E] mt-1">{currentCase.perceivedImpact.professionalImpact}</p>
                </div>
              </div>

              {/* Dispatch Secure Response to Employee */}
              <div className="border-t border-[#EDF2EA] pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#203225] mb-2">
                  Dispatch Encrypted Response / Notice to Employee
                </h4>
                <p className="text-xs text-[#637565] mb-3">
                  This note is transmitted directly to the employee's Dignifi vault (tracking token: {currentCase.hrCaseDetails.trackingToken}).
                </p>
                <textarea
                  rows={3}
                  value={employeeNote}
                  onChange={e => setEmployeeNote(e.target.value)}
                  placeholder="e.g. We have received your documentation and initiated immediate steps under Section 8 of our Harassment Policy. Your position is protected against retaliation..."
                  className="w-full p-3 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-xs text-[#1C261E] focus:outline-none mb-2"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSendNoteToEmployee}
                    className="px-4 py-2 bg-[#2D4335] hover:bg-[#203126] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Encrypted Notice</span>
                  </button>
                </div>
              </div>

              {/* Confidential HR Action & Audit Log */}
              <div className="border-t border-[#EDF2EA] pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#203225] mb-3">
                  Case Action & Audit Trail ({currentCase.hrCaseDetails.hrActionLogs?.length || 0})
                </h4>

                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {currentCase.hrCaseDetails.hrActionLogs?.map((log, i) => (
                    <div key={i} className="p-3 bg-[#FAFBF9] border border-[#DEE7DA] rounded-xl text-xs">
                      <div className="flex justify-between text-[#68796A] text-[11px] mb-1">
                        <span className="font-semibold text-[#1C261E]">{log.actionBy}</span>
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-[#3D4F40]">{log.actionDescription}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={actionDesc}
                    onChange={e => setActionDesc(e.target.value)}
                    placeholder="Log an internal action (e.g. Consulted legal partner; issued interim calendar hold)..."
                    className="flex-1 px-3 py-2 text-xs bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-[#1C261E] focus:outline-none"
                  />
                  <button
                    onClick={handleAddActionLog}
                    className="px-4 py-2 bg-[#EAEFE6] hover:bg-[#DEE7DA] text-[#2D4335] text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Add Log Entry
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-[#E0E7DC] rounded-2xl p-12 text-center text-xs text-[#637565]">
              <p>Select a case from the list on the left to review documentation and manage case actions.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
