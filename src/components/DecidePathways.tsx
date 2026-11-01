import React, { useState } from 'react';
import {
  Scale,
  PhoneCall,
  Clock,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  LifeBuoy,
} from 'lucide-react';
import { SOUTH_AFRICA_PATHWAYS, SOUTH_AFRICA_SUPPORT_RESOURCES, LegalPathway } from '../data/southAfricaFramework';

interface DecidePathwaysProps {
  onOpenVault: () => void;
}

export const DecidePathways: React.FC<DecidePathwaysProps> = ({ onOpenVault }) => {
  const [selectedPathway, setSelectedPathway] = useState<LegalPathway>(SOUTH_AFRICA_PATHWAYS[0]);
  const [activeTab, setActiveTab] = useState<'pathways' | 'helplines' | 'timelines'>('pathways');

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-[#5C6E5F] font-medium mb-1">
          <span>5. Decide</span>
          <span>·</span>
          <span>South African Labour Framework & Support Resources (Non-Coercive)</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C261E]">
          Workplace Rights, Pathways & Helplines
        </h2>
        <p className="text-sm text-[#5C6D5F] mt-1.5 max-w-3xl leading-relaxed">
          Access factual information on South African workplace legislation and available support pathways. Dignifi does not provide legal advice or pressure you to report—these resources exist to empower informed decisions on your own terms.
        </p>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mt-6 border-b border-[#E0E7DC] pb-3">
          <button
            onClick={() => setActiveTab('pathways')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'pathways' ? 'bg-[#2D4335] text-white shadow-xs' : 'text-[#586A5A] hover:bg-[#EEF3EC]'
            }`}
          >
            Statutory Pathways & Options
          </button>
          <button
            onClick={() => setActiveTab('helplines')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'helplines' ? 'bg-[#2D4335] text-white shadow-xs' : 'text-[#586A5A] hover:bg-[#EEF3EC]'
            }`}
          >
            South Africa Support Helplines & Crisis Lines
          </button>
          <button
            onClick={() => setActiveTab('timelines')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'timelines' ? 'bg-[#2D4335] text-white shadow-xs' : 'text-[#586A5A] hover:bg-[#EEF3EC]'
            }`}
          >
            CCMA & Dispute Time Limits
          </button>
        </div>
      </div>

      {/* TAB 1: STATUTORY PATHWAYS */}
      {activeTab === 'pathways' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Pathway Selector List */}
          <div className="lg:col-span-5 space-y-3">
            <label className="text-xs font-semibold text-[#546656] uppercase tracking-wider block mb-2">
              Select A Pathway To Inspect:
            </label>
            {SOUTH_AFRICA_PATHWAYS.map(p => {
              const isSelected = selectedPathway.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPathway(p)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-[#2D4335] shadow-sm'
                      : 'bg-[#FAFBF9] border-[#E0E7DC] hover:border-[#CCD7C8]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#203225]' : 'text-[#1C261E]'}`}>
                      {p.title}
                    </span>
                    <span className="text-[10px] text-[#556756] font-mono">
                      {p.isExternalStatutory ? 'External Statutory' : 'Internal'}
                    </span>
                  </div>
                  <p className="text-xs text-[#637565] line-clamp-2 mb-2 leading-relaxed">
                    {p.subtitle} · {p.legislation}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#4F6452]">
                    <Clock className="w-3 h-3" />
                    <span>Time Limit: {p.timeLimit}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pathway Detailed Breakdown */}
          <div className="lg:col-span-7 bg-white border border-[#E0E7DC] rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-[#EDF2EA]">
              <div>
                <span className="text-xs font-semibold text-[#2D4335] uppercase tracking-wider">
                  {selectedPathway.legislation}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1C261E] mt-1">
                  {selectedPathway.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5B6D5E] mt-1">
                  {selectedPathway.subtitle}
                </p>
              </div>

              {selectedPathway.ccmaFormRequired && (
                <span className="text-[11px] font-mono bg-[#EAF2E6] text-[#2D4335] font-bold px-2.5 py-1 rounded-md shrink-0 border border-[#D5E1D1]">
                  {selectedPathway.ccmaFormRequired}
                </span>
              )}
            </div>

            <div className="space-y-5 text-xs sm:text-sm text-[#384A3B]">
              <div>
                <strong className="text-[#1C261E] block mb-1">Statutory Context & Scope:</strong>
                <p className="leading-relaxed text-[#4A5D4D]">{selectedPathway.description}</p>
              </div>

              <div className="p-3.5 bg-[#FAFBF9] border border-[#DEE7DA] rounded-xl text-xs">
                <strong className="text-[#203325] block mb-1">Applicability:</strong>
                <p className="text-[#556858]">{selectedPathway.whoItAppliesTo}</p>
                <div className="mt-2 text-[#435947]">
                  <strong>Strict Time Limit:</strong> {selectedPathway.timeLimit}
                </div>
              </div>

              <div>
                <strong className="text-[#1C261E] block mb-2">Procedural Steps in South Africa:</strong>
                <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-[#465848] leading-relaxed">
                  {selectedPathway.stepByStep.map((step, idx) => (
                    <li key={idx} className="pl-1">{step}</li>
                  ))}
                </ol>
              </div>

              <div className="p-4 bg-[#F5F8F2] border border-[#D7E4D3] rounded-xl text-xs text-[#3E5342]">
                <strong className="block text-[#1E3023] mb-1">Key Legal Considerations:</strong>
                <ul className="list-disc list-inside space-y-1">
                  {selectedPathway.keyConsiderations.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-xs text-[#637565]">
                  Need your contemporaneous records to prepare?
                </span>
                <button
                  onClick={onOpenVault}
                  className="px-4 py-2 bg-[#2D4335] hover:bg-[#203126] text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Retrieve Records from Vault
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: HELPLINES & CRISIS SUPPORT */}
      {activeTab === 'helplines' && (
        <div>
          <p className="text-xs sm:text-sm text-[#5D6F60] mb-6">
            Confidential, external South African organizations providing psychosocial counseling, trauma debriefing, and free legal aid.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOUTH_AFRICA_SUPPORT_RESOURCES.map(resource => (
              <div
                key={resource.id}
                className="bg-white border border-[#E0E7DC] rounded-2xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#5E7060] mb-2">
                    <span className="capitalize">{resource.category.replace('_', ' ')}</span>
                    <span className="text-[11px] font-semibold text-[#2D4335] bg-[#E8EFE5] px-2 py-0.5 rounded">
                      {resource.cost}
                    </span>
                  </div>

                  <h4 className="font-serif text-base font-bold text-[#1C261E] mb-2">
                    {resource.name}
                  </h4>

                  <p className="text-xs text-[#4F6051] leading-relaxed mb-4">
                    {resource.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EEF3EA] space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-[#2D4335] font-bold">
                    <PhoneCall className="w-3.5 h-3.5 text-[#3E5C46]" />
                    <span className="text-sm font-mono">{resource.contactPhone}</span>
                  </div>

                  {resource.alternateContact && (
                    <p className="text-[11px] text-[#637566]">
                      {resource.alternateContact}
                    </p>
                  )}

                  <p className="text-[11px] text-[#718274]">
                    Hours: {resource.operatingHours}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TIMELINES & CCMA RULES */}
      {activeTab === 'timelines' && (
        <div className="bg-white border border-[#E0E7DC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#1C261E]">
            Statutory Dispute Time Limits in South Africa
          </h3>
          <p className="text-xs sm:text-sm text-[#586A5A]">
            Missing these deadlines requires applying for condonation from the CCMA, where you must prove good cause for any delay. Contemporaneous records help establish timelines.
          </p>

          <div className="space-y-4 text-xs sm:text-sm">
            
            <div className="p-4 bg-[#FAFBF9] border border-[#DEE7DA] rounded-xl flex items-start gap-4">
              <Clock className="w-5 h-5 text-[#2D4335] shrink-0 mt-0.5" />
              <div>
                <strong className="text-base text-[#1C261E] block mb-1">
                  6 Months — Unfair Discrimination & Harassment (EEA Section 10)
                </strong>
                <p className="text-[#4E6150] leading-relaxed">
                  Employees have six months from the date of the act or omission to refer an unfair discrimination or workplace harassment dispute to the CCMA. If harassment has been ongoing over multiple months, the six months typically runs from the most recent occurrence.
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#FAFBF9] border border-[#DEE7DA] rounded-xl flex items-start gap-4">
              <Clock className="w-5 h-5 text-[#8B3A2B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-base text-[#1C261E] block mb-1">
                  30 Calendar Days — Constructive Dismissal (LRA Section 186(1)(e))
                </strong>
                <p className="text-[#4E6150] leading-relaxed">
                  If an employee is compelled to resign because working conditions became intolerable, the referral to the CCMA must be served on the employer and lodged within <strong>30 calendar days</strong> of the resignation date.
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#FAFBF9] border border-[#DEE7DA] rounded-xl flex items-start gap-4">
              <Clock className="w-5 h-5 text-[#2D4335] shrink-0 mt-0.5" />
              <div>
                <strong className="text-base text-[#1C261E] block mb-1">
                  90 Calendar Days — Unfair Labour Practice (LRA Section 186(2))
                </strong>
                <p className="text-[#4E6150] leading-relaxed">
                  Disputes regarding unfair disciplinary action short of dismissal, unfair suspension, or failure to provide promised benefits must be lodged within 90 days.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
