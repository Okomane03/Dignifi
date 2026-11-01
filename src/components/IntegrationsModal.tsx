import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Lock,
  Layers,
  MessageSquare,
  Building,
  RefreshCw,
  X,
  Shield,
  EyeOff,
} from 'lucide-react';

interface IntegrationsModalProps {
  onClose: () => void;
}

export const IntegrationsModal: React.FC<IntegrationsModalProps> = ({ onClose }) => {
  const [slackWebhookStatus, setSlackWebhookStatus] = useState<'connected' | 'testing'>('connected');
  const [bambooStatus, setBambooStatus] = useState<'ready' | 'syncing'>('ready');

  const testSlackNotification = () => {
    setSlackWebhookStatus('testing');
    setTimeout(() => {
      setSlackWebhookStatus('connected');
      alert('Mock Encrypted Webhook sent to #hr-confidential-cases: "New Dignifi Case Received [Ref: DIG-7401-K89W] (Protected Anonymity)"');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#D5DFD1] rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#EDF2EA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D4335] text-white flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C261E]">
                Integrations & Surveillance Exclusion Architecture
              </h3>
              <p className="text-xs text-[#5E7060]">
                HR Software Connectors & Corporate Telemetry Air-Gap
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#647565] hover:text-[#1C261E] rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Exclusion from Corporate Surveillance */}
        <div className="p-4 bg-[#F5F8F2] border border-[#D7E4D3] rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2D4335]">
            <EyeOff className="w-4 h-4 text-[#2D4335]" />
            <span>How Dignifi Excludes Corporate Monitoring Systems</span>
          </div>
          <p className="text-xs text-[#445646] leading-relaxed">
            Corporate IT environments often deploy endpoint detection, browser extension monitoring, and proxy inspection. Dignifi enforces four strict privacy-by-design safeguards:
          </p>
          <ul className="text-xs text-[#405242] space-y-1.5 list-disc list-inside">
            <li><strong>Client-Side Vault Encryption:</strong> Contemporaneous narratives and subsequent notes are encrypted on your local machine using WebCrypto SHA-256 and AES before writing to disk.</li>
            <li><strong>No Employer Keylogging or Draft Leakage:</strong> Draft entries are never transmitted to corporate servers or third-party cloud AI while you type.</li>
            <li><strong>Strict Separation of Concerns:</strong> Your private incident logs remain invisible to HR until you explicitly trigger an authorized encrypted dispatch.</li>
            <li><strong>Anonymized Dispatch Envelope:</strong> If selected, employee email, machine IP, and metadata are scrubbed, presenting HR only with a cryptographic case token.</li>
          </ul>
        </div>

        {/* HR Software & Communication Integrations */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#203225]">
            Enterprise HR & Communication Connectors
          </h4>

          {/* Slack / Teams Connector */}
          <div className="p-4 bg-[#FAFBF9] border border-[#DEE6DA] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-[#2D4335]" />
              <div>
                <p className="text-xs font-semibold text-[#1C261E]">Slack & Microsoft Teams Webhook</p>
                <p className="text-[11px] text-[#637565]">
                  Sends instant encrypted notifications to designated HR officers without revealing case details in public channels.
                </p>
              </div>
            </div>
            <button
              onClick={testSlackNotification}
              disabled={slackWebhookStatus === 'testing'}
              className="px-3.5 py-1.5 bg-white border border-[#CCD7C8] hover:bg-[#F2F6EF] text-[#2D4335] text-xs font-semibold rounded-lg shrink-0 cursor-pointer shadow-xs"
            >
              {slackWebhookStatus === 'testing' ? 'Transmitting...' : 'Send Test HR Ping'}
            </button>
          </div>

          {/* HRIS / Case Management (BambooHR, Workday, SAP) */}
          <div className="p-4 bg-[#FAFBF9] border border-[#DEE6DA] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-[#2D4335]" />
              <div>
                <p className="text-xs font-semibold text-[#1C261E]">HRIS Sync (Workday / BambooHR / SAP)</p>
                <p className="text-[11px] text-[#637565]">
                  Standardized JSON & PDF Case Dossier export format aligned with corporate grievance record retention policies.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[#2D4335] bg-[#E8EFE5] px-2.5 py-1 rounded-md shrink-0">
              Ready for Export
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2D4335] hover:bg-[#203126] text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Close Settings
          </button>
        </div>

      </div>
    </div>
  );
};
