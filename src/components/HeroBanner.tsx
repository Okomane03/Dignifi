import React from 'react';
import { Shield, Lock, FileText, CheckCircle2, ChevronRight, HardDriveDownload, Sparkles } from 'lucide-react';
import { IncidentRecord } from '../types/incident';
import { DignifiLogo } from './DignifiLogo';

interface HeroBannerProps {
  records: IncidentRecord[];
  onStartDocumentation: () => void;
  onOpenVault: () => void;
  onOpenOfflineModal: () => void;
  onOpenIntegrationsModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  records,
  onStartDocumentation,
  onOpenVault,
  onOpenOfflineModal,
  onOpenIntegrationsModal,
}) => {
  const verifiedRecordsCount = records.length;
  const hrSubmittedCount = records.filter(r => r.status === 'submitted_to_hr').length;

  return (
    <section className="relative overflow-hidden pt-8 pb-12 border-b border-[#E2E8DC] bg-gradient-to-b from-[#F4F6F0]/60 via-[#F8F9F5] to-[#F8F9F5]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Brand Statement & Primary Controls */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EFE4] text-[#2D4335] text-xs font-medium w-fit mb-4 border border-[#D5E1D0]">
              <Shield className="w-3.5 h-3.5 text-[#3E5C45]" />
              <span>Privacy-Conscious · Employee-Centred · Air-Gapped</span>
            </div>

            <div className="mb-3">
              <DignifiLogo size="lg" />
            </div>

            <p className="text-xl sm:text-2xl font-serif text-[#3E5643] mb-4 font-normal">
              Workplace Dignity & Documentation OS
            </p>

            <p className="text-base sm:text-lg text-[#556356] leading-relaxed mb-6 max-w-2xl">
              A structured, protected space for individuals who have experienced or witnessed potentially harmful workplace conduct. Document experiences in your own words, organise records with records-management integrity, and explore South African labour options without corporate surveillance.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mb-6">
              <button
                onClick={onStartDocumentation}
                className="px-6 py-3 bg-[#2D4335] hover:bg-[#233529] text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2 group cursor-pointer"
              >
                <span>Document An Incident</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onOpenOfflineModal}
                className="px-5 py-3 bg-[#EAEFE6] hover:bg-[#DFE8DA] text-[#2D4335] border border-[#CCD7C8] rounded-xl text-sm font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <HardDriveDownload className="w-4 h-4 text-[#2D4335]" />
                <span>Download Suite (Version 22)</span>
              </button>

              <button
                onClick={onOpenVault}
                className="px-5 py-3 bg-white hover:bg-[#F2F6EF] text-[#2D4335] border border-[#CCD7C8] rounded-xl text-sm font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#43644B]" />
                <span>Open Secure Vault</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#6B796D] mb-8">
              <Lock className="w-3.5 h-3.5 text-[#4D6953]" />
              <span>Instant local access · Excluded from employer telemetry · Zero external AI transmission</span>
            </div>

            {/* 3 Trust Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#DFE7DB]">
              <div>
                <p className="font-serif text-lg font-bold text-[#1C261E]">100% Private</p>
                <p className="text-xs text-[#5E6D60]">Local sandboxed storage on your device only</p>
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-[#1C261E]">Zero Telemetry</p>
                <p className="text-xs text-[#5E6D60]">Shielded from company monitoring systems</p>
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-[#1C261E]">SA Law Aligned</p>
                <p className="text-xs text-[#5E6D60]">CCMA Form 7.11 & 2022 Harassment Code ready</p>
              </div>
            </div>

          </div>

          {/* Right Column: Inspired by the Phone Showcase in the user attachment */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Outer soft ambient background halo */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#DCE7D6]/70 via-[#EAF2E7]/50 to-transparent rounded-3xl filter blur-xl opacity-70" />

              {/* Phone mockup container mimicking the design reference */}
              <div className="relative bg-gradient-to-b from-[#FAFBF8] to-[#F2F5EE] border-2 border-[#DCE4D6] rounded-[36px] p-4 shadow-xl overflow-hidden">
                
                {/* Phone Speaker & Dynamic Island */}
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-4 bg-[#1C261E]/90 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#354838] ml-auto mr-3" />
                  </div>
                </div>

                {/* Inner Screen Mockup Content */}
                <div className="bg-white rounded-[26px] p-5 border border-[#E3EBDC] shadow-inner flex flex-col gap-4 text-[#1C261E]">
                  
                  {/* Greeting & Intention */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[11px] text-[#697A6B]">Safe & Protected</p>
                      <h3 className="font-serif text-lg font-bold text-[#203125]">Dignifi Vault</h3>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#EAF2E6] flex items-center justify-center text-[#2D4335]">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Vault Status Card */}
                  <div className="bg-[#F6F9F3] border border-[#DEE8D8] rounded-xl p-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#5B6D5E] font-medium">Contemporaneous Integrity</span>
                      <span className="font-mono text-[10px] text-[#2D4335] bg-[#E3EEDF] px-1.5 py-0.5 rounded font-bold">
                        SHA-256
                      </span>
                    </div>
                    <p className="text-xs font-serif text-[#1C261E]">
                      {verifiedRecordsCount} Verified Incident{verifiedRecordsCount === 1 ? '' : 's'} in Local Vault
                    </p>
                    <div className="w-full bg-[#DEE8D8] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#3D5C45] h-full rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>

                  {/* 5 Pillar Step Buttons inside phone */}
                  <div>
                    <p className="text-[11px] font-semibold text-[#5B6E5F] uppercase tracking-wider mb-2">
                      Structured Workflow
                    </p>
                    <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-medium text-[#465749]">
                      <div className="p-1.5 bg-[#F4F7F1] rounded-lg border border-[#E1EADC]">
                        <FileText className="w-3.5 h-3.5 mx-auto mb-1 text-[#2D4335]" />
                        <span>Document</span>
                      </div>
                      <div className="p-1.5 bg-[#F4F7F1] rounded-lg border border-[#E1EADC]">
                        <CheckCircle2 className="w-3.5 h-3.5 mx-auto mb-1 text-[#2D4335]" />
                        <span>Organise</span>
                      </div>
                      <div className="p-1.5 bg-[#F4F7F1] rounded-lg border border-[#E1EADC]">
                        <Lock className="w-3.5 h-3.5 mx-auto mb-1 text-[#2D4335]" />
                        <span>Manage</span>
                      </div>
                      <div className="p-1.5 bg-[#F4F7F1] rounded-lg border border-[#E1EADC]">
                        <Sparkles className="w-3.5 h-3.5 mx-auto mb-1 text-[#2D4335]" />
                        <span>Reflect</span>
                      </div>
                      <div className="p-1.5 bg-[#F4F7F1] rounded-lg border border-[#E1EADC]">
                        <Shield className="w-3.5 h-3.5 mx-auto mb-1 text-[#2D4335]" />
                        <span>Decide</span>
                      </div>
                    </div>
                  </div>

                  {/* Active submission summary inside phone */}
                  <div className="border border-[#E2EBDC] rounded-xl p-3 bg-[#FAFBF9]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5B6D5E]">HR Case Link</span>
                      <span className="text-[11px] font-semibold text-[#2D4335]">
                        {hrSubmittedCount > 0 ? `${hrSubmittedCount} Encrypted Case Dispatched` : 'Private Vault Only'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#718274] mt-1">
                      No employer access without your explicit authorization.
                    </p>
                  </div>

                  {/* Seamless HR & Comm Integrations prompt */}
                  <button
                    onClick={onOpenIntegrationsModal}
                    className="w-full py-2 bg-[#E6ECE3] hover:bg-[#DCE4D8] text-[#2D4335] text-xs font-medium rounded-lg transition-colors text-center cursor-pointer"
                  >
                    View HRIS & Comm Tool Sandboxing
                  </button>

                </div>

                <div className="mt-3 text-center">
                  <span className="font-serif text-[11px] text-[#5A6D5E] tracking-widest uppercase">
                    Dignifi Version 22 · Self-Contained OS
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
