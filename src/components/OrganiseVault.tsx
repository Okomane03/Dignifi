import React, { useState } from 'react';
import {
  Search,
  Filter,
  Lock,
  Calendar,
  Clock,
  MapPin,
  Users,
  Paperclip,
  CheckCircle2,
  ChevronRight,
  Shield,
  Send,
  Eye,
  Plus,
  HardDriveDownload,
  FileCode,
  Terminal,
} from 'lucide-react';
import { IncidentRecord, IncidentCategory } from '../types/incident';
import { downloadDignifiHtml, downloadDignifiPython } from '../data/offlineSuiteData';

interface OrganiseVaultProps {
  records: IncidentRecord[];
  onSelectRecord: (record: IncidentRecord) => void;
  onNewIncident: () => void;
  onSubmitToHr: (record: IncidentRecord) => void;
  onOpenOfflineModal: () => void;
}

export const OrganiseVault: React.FC<OrganiseVaultProps> = ({
  records,
  onSelectRecord,
  onNewIncident,
  onSubmitToHr,
  onOpenOfflineModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredRecords = records.filter(record => {
    // Search query match
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      record.title.toLowerCase().includes(q) ||
      record.contemporaneousNarrative.toLowerCase().includes(q) ||
      record.locationDetails.toLowerCase().includes(q) ||
      record.peopleInvolved.some(p => p.nameOrRole.toLowerCase().includes(q));

    // Status match
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'submitted' && record.status === 'submitted_to_hr') ||
      (selectedStatus === 'vault' && record.status !== 'submitted_to_hr');

    // Category match
    const matchesCat =
      selectedCategory === 'all' ||
      record.categories.includes(selectedCategory as IncidentCategory);

    return matchesSearch && matchesStatus && matchesCat;
  });

  const categoryNames: Record<IncidentCategory, string> = {
    bullying: 'Bullying & Mobbing',
    sexual_harassment: 'Sexual Harassment',
    racial_discrimination: 'Racial / Ethnic Bias',
    gender_discrimination: 'Gender Discrimination',
    microaggression: 'Microaggression',
    intimidation: 'Intimidation & Coercion',
    retaliation: 'Retaliation',
    unethical_directive: 'Unlawful Directive',
    general_harassment: 'Hostile Environment'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#59695B] font-medium mb-1">
            <span>2. Organise</span>
            <span>·</span>
            <span>Contemporaneous Record Log & Metadata Classification</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C261E]">
            My Report Log & Incident Vault
          </h2>
          <p className="text-xs sm:text-sm text-[#617263] mt-1">
            {records.length} documented workplace incident{records.length === 1 ? '' : 's'} organised chronologically by incident date and category.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenOfflineModal}
            className="px-4 py-2.5 bg-[#EAEFE6] hover:bg-[#DFE8DA] text-[#2D4335] border border-[#CCD7C8] text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <HardDriveDownload className="w-4 h-4 text-[#2D4335]" />
            <span>Download Version 22 Suite</span>
          </button>

          <button
            onClick={onNewIncident}
            className="px-5 py-2.5 bg-[#2D4335] hover:bg-[#233529] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Document New Incident</span>
          </button>
        </div>
      </div>

      {/* Offline Download Banner */}
      <div className="bg-[#FAFBF9] border border-[#D5DFD1] rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2D4335] text-white flex items-center justify-center shrink-0 mt-0.5">
            <HardDriveDownload className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#1C261E]">
              Dignifi Version 22 Offline Package
            </h4>
            <p className="text-xs text-[#5D6F60] mt-0.5">
              Download the standalone single-file HTML app (<code className="font-mono text-[#2D4335]">Dignifi_Version_22.html</code>) and Python standard library runner (<code className="font-mono text-[#2D4335]">dignifi_version_22.py</code>) for offline testing on localhost.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={downloadDignifiHtml}
            className="px-3 py-1.5 bg-white border border-[#CCD7C8] hover:bg-[#F2F6EF] text-[#2D4335] text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FileCode className="w-3.5 h-3.5 text-[#2D4335]" />
            <span>HTML File</span>
          </button>

          <button
            onClick={downloadDignifiPython}
            className="px-3 py-1.5 bg-white border border-[#CCD7C8] hover:bg-[#F2F6EF] text-[#2D4335] text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Terminal className="w-3.5 h-3.5 text-[#2D4335]" />
            <span>Python Script</span>
          </button>

          <button
            onClick={onOpenOfflineModal}
            className="px-3 py-1.5 bg-[#2D4335] hover:bg-[#203126] text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            All Downloads & Guide
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#E0E7DC] rounded-2xl p-4 sm:p-5 mb-6 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#758476] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search records, names, locations, quotes..."
            className="w-full pl-9 pr-3.5 py-2 bg-[#F9FAF7] border border-[#D5DFD1] rounded-xl text-xs sm:text-sm text-[#1C261E] focus:outline-none focus:ring-1 focus:ring-[#2D4335]"
          />
        </div>

        {/* Functional Filter Tabs (interactive button-based segmented controls) */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 p-1 bg-[#EEF2EB] rounded-xl text-xs font-medium shrink-0">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedStatus === 'all' ? 'bg-white text-[#2D4335] shadow-xs font-semibold' : 'text-[#5E6D60] hover:text-[#1C261E]'
              }`}
            >
              All Records ({records.length})
            </button>
            <button
              onClick={() => setSelectedStatus('vault')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedStatus === 'vault' ? 'bg-white text-[#2D4335] shadow-xs font-semibold' : 'text-[#5E6D60] hover:text-[#1C261E]'
              }`}
            >
              Private Vault ({records.filter(r => r.status !== 'submitted_to_hr').length})
            </button>
            <button
              onClick={() => setSelectedStatus('submitted')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedStatus === 'submitted' ? 'bg-white text-[#2D4335] shadow-xs font-semibold' : 'text-[#5E6D60] hover:text-[#1C261E]'
              }`}
            >
              Submitted to HR ({records.filter(r => r.status === 'submitted_to_hr').length})
            </button>
          </div>
        </div>

      </div>

      {/* Record Cards Timeline */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white border border-[#E0E7DC] rounded-2xl p-12 text-center">
          <Lock className="w-10 h-10 text-[#718473] mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-[#1C261E] mb-1">No Records Found</h3>
          <p className="text-xs sm:text-sm text-[#667768] max-w-md mx-auto mb-5">
            {searchQuery
              ? 'No documented incidents match your current search criteria.'
              : 'Your private vault is ready. You have complete control over what is documented.'}
          </p>
          <button
            onClick={onNewIncident}
            className="px-4 py-2 bg-[#2D4335] text-white text-xs font-semibold rounded-lg hover:bg-[#233529] cursor-pointer"
          >
            Start First Documentation
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map(record => {
            const hasHrSubmission = record.status === 'submitted_to_hr';
            return (
              <div
                key={record.id}
                className="bg-white border border-[#DFE6DA] hover:border-[#CCD8C6] rounded-2xl p-5 sm:p-6 transition-all hover:shadow-xs group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    {/* Unboxed Metadata with Typographic Separators */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5D6F60] mb-1.5">
                      <span className="font-mono text-[#2D4335] font-semibold">{record.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>{record.incidentDate} {record.incidentTime && `at ${record.incidentTime}`}</span>
                      <span aria-hidden="true">·</span>
                      <span>{record.locationDetails}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-[#203324]">
                        {record.categories.map(c => categoryNames[c] || c).join(', ')}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectRecord(record)}
                      className="font-serif text-lg sm:text-xl font-bold text-[#1C261E] group-hover:text-[#2D4335] transition-colors cursor-pointer"
                    >
                      {record.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {record.hrCaseDetails?.hrStatus === 'case_concluded' ? (
                      record.hrCaseDetails.closureFeedback?.status === 'satisfied' ? (
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-md flex items-center gap-1 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Case Concluded &middot; Satisfied</span>
                        </span>
                      ) : record.hrCaseDetails.closureFeedback?.status === 'unhappy_follow_up_requested' ? (
                        <span className="text-[11px] font-semibold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-amber-300">
                          <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                          <span>Active Follow-Up Reopened</span>
                        </span>
                      ) : record.hrCaseDetails.closureFeedback?.status === 'resubmitted_for_escalation' ? (
                        <span className="text-[11px] font-semibold text-purple-900 bg-purple-100 px-2.5 py-1 rounded-md flex items-center gap-1 border border-purple-300">
                          <span>⚖️ Resubmitted / Escalated</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-950 bg-amber-200/90 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-amber-400 shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-amber-700 animate-pulse" />
                          <span>Case Closed &middot; Feedback Needed</span>
                        </span>
                      )
                    ) : hasHrSubmission ? (
                      <span className="text-[11px] font-semibold text-[#2D4335] bg-[#E7EFE4] px-2.5 py-1 rounded-md flex items-center gap-1 border border-[#D5E1D1]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2D4335]" />
                        <span>Submitted to HR</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-[#647466] bg-[#F3F6F0] px-2.5 py-1 rounded-md flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#4A6450]" />
                        <span>Private Vault Only</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Excerpt of Contemporaneous Narrative */}
                <p className="text-xs sm:text-sm text-[#465448] leading-relaxed line-clamp-3 mb-4 bg-[#F9FAF7] p-3.5 rounded-xl border border-[#EDF2EA]">
                  "{record.contemporaneousNarrative}"
                </p>

                {/* Footer Metadata & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#F0F4ED] text-xs">
                  
                  <div className="flex flex-wrap items-center gap-3 text-[#627364]">
                    {record.peopleInvolved.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#4D6652]" />
                        <span>{record.peopleInvolved.length} individual{record.peopleInvolved.length === 1 ? '' : 's'} recorded</span>
                      </span>
                    )}

                    {record.subsequentNotes.length > 0 && (
                      <span className="flex items-center gap-1">
                        <span aria-hidden="true">·</span>
                        <span>{record.subsequentNotes.length} subsequent note{record.subsequentNotes.length === 1 ? '' : 's'}</span>
                      </span>
                    )}

                    {record.evidenceItems.length > 0 && (
                      <span className="flex items-center gap-1">
                        <span aria-hidden="true">·</span>
                        <Paperclip className="w-3.5 h-3.5 text-[#4D6652]" />
                        <span>{record.evidenceItems.length} artifact{record.evidenceItems.length === 1 ? '' : 's'}</span>
                      </span>
                    )}

                    <span className="hidden md:inline font-mono text-[10px] text-[#718274] bg-[#EEF3EA] px-2 py-0.5 rounded">
                      SHA: {record.cryptographicHash.substring(0, 12)}...
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectRecord(record)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-[#2D4335] bg-[#EBF2E8] hover:bg-[#DEE8DB] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Manage Record</span>
                    </button>

                    {!hasHrSubmission && (
                      <button
                        onClick={() => onSubmitToHr(record)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2D4335] hover:bg-[#203126] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit to HR</span>
                      </button>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
