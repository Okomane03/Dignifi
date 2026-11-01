import React, { useState } from 'react';
import {
  HardDriveDownload,
  Terminal,
  FileCode,
  CheckCircle2,
  X,
  Copy,
  Check,
  Eye,
  FileDown,
  Sparkles,
  FolderArchive,
  ExternalLink,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import {
  DIGNIFI_VERSION_22_HTML,
  DIGNIFI_VERSION_22_PY,
  downloadDignifiHtml,
  downloadDignifiPython,
} from '../data/offlineSuiteData';

interface OfflineDeploymentModalProps {
  onClose: () => void;
}

export const OfflineDeploymentModal: React.FC<OfflineDeploymentModalProps> = ({ onClose }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'none' | 'html' | 'py'>('none');
  const [copiedType, setCopiedType] = useState<'html' | 'py' | 'url' | null>(null);

  const sharedAppUrl = 'https://ais-pre-skek5br3oou5qbw4jjmtv4-608278544154.europe-west3.run.app';

  const handleDownloadZip = () => {
    const link = document.createElement('a');
    link.href = '/dignifi-source-code.zip';
    link.download = 'dignifi-source-code.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadBoth = () => {
    downloadDignifiHtml();
    setTimeout(() => {
      downloadDignifiPython();
    }, 400);
  };

  const handleCopy = (type: 'html' | 'py' | 'url') => {
    let text = '';
    if (type === 'html') text = DIGNIFI_VERSION_22_HTML;
    else if (type === 'py') text = DIGNIFI_VERSION_22_PY;
    else if (type === 'url') text = sharedAppUrl;

    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-[#D5DFD1] rounded-2xl p-5 sm:p-7 max-w-3xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto animate-in fade-in duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#EDF2EA]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#2D4335] text-white flex items-center justify-center shadow-xs">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C261E]">
                Download & Deployment Suite
              </h3>
              <p className="text-xs text-[#5E7060]">
                Live Hosted Cloud URL, Complete Source Code ZIP, and Offline Python/HTML Suite
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

        {/* Live Hosted Service Status Banner */}
        <div className="p-4 bg-[#F2F7F1] border border-[#CCDBC8] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-bold text-[#1C261E] uppercase tracking-wider text-[11px]">
                Live Cloud Run Deployment (Stays Live Beyond 13 November)
              </span>
            </div>
            <p className="font-mono text-[#2D4335] text-[11px] truncate max-w-xl">
              {sharedAppUrl}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopy('url')}
              className="px-3 py-1.5 bg-white border border-[#CCDBC8] hover:bg-[#FAFBF9] text-[#2D4335] font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedType === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'url' ? 'Copied Link!' : 'Copy Live URL'}</span>
            </button>
            <a
              href={sharedAppUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-[#2D4335] text-white hover:bg-[#203126] font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open</span>
            </a>
          </div>
        </div>

        {/* Primary Action Card: Download Full Source Code ZIP */}
        <div className="bg-[#2D4335] text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#C2D8C7] mb-1 font-semibold">
              <Sparkles className="w-4 h-4 text-[#A7C8AE]" />
              <span>Full Repository Package (No API Keys / Zero Secrets)</span>
            </div>
            <h4 className="font-serif text-lg font-bold">Download Complete Source Code (ZIP)</h4>
            <p className="text-xs text-[#E1EBE3] mt-0.5 max-w-lg">
              Includes full React 19 + TypeScript + Vite project, <code className="font-mono text-[#D7EEDD]">README.md</code> with exact execution steps, <code className="font-mono text-[#D7EEDD]">.env.example</code>, and the Version 22 offline suite.
            </p>
          </div>
          <button
            onClick={handleDownloadZip}
            className="px-5 py-3 bg-white hover:bg-[#F2F6EF] text-[#2D4335] text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <FolderArchive className="w-4 h-4 text-[#2D4335]" />
            <span>Download Source ZIP (~3MB)</span>
          </button>
        </div>

        {/* Individual File Download Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 1: HTML File */}
          <div className="p-4 sm:p-5 bg-[#FAFBF9] border border-[#DEE6DA] rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[#2D4335]">
                  <FileCode className="w-4 h-4" />
                  <h4 className="font-bold text-xs sm:text-sm text-[#1C261E]">Dignifi_Version_22.html</h4>
                </div>
                <span className="text-[10px] font-mono text-[#546756] bg-[#E8EFE5] px-2 py-0.5 rounded">
                  Single File (18KB)
                </span>
              </div>
              <p className="text-xs text-[#637565] leading-relaxed mb-4">
                Self-contained HTML5 application with embedded styles, local encrypted storage, CCMA exporter, and records timeline. Double-click to run in any browser offline.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#EEF3EA]">
              <button
                onClick={downloadDignifiHtml}
                className="w-full py-2.5 bg-[#2D4335] hover:bg-[#203126] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <HardDriveDownload className="w-3.5 h-3.5" />
                <span>Download HTML File</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy('html')}
                  className="flex-1 py-1.5 text-xs text-[#4A5D4D] bg-white border border-[#D5DFD1] hover:bg-[#F3F7F0] rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  {copiedType === 'html' ? <Check className="w-3.5 h-3.5 text-[#2D4335]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'html' ? 'Copied HTML!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={() => setActiveCodeTab(activeCodeTab === 'html' ? 'none' : 'html')}
                  className="px-3 py-1.5 text-xs text-[#4A5D4D] bg-white border border-[#D5DFD1] hover:bg-[#F3F7F0] rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{activeCodeTab === 'html' ? 'Hide' : 'Inspect'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Python Script */}
          <div className="p-4 sm:p-5 bg-[#FAFBF9] border border-[#DEE6DA] rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[#2D4335]">
                  <Terminal className="w-4 h-4" />
                  <h4 className="font-bold text-xs sm:text-sm text-[#1C261E]">dignifi_version_22.py</h4>
                </div>
                <span className="text-[10px] font-mono text-[#546756] bg-[#E8EFE5] px-2 py-0.5 rounded">
                  Python 3 (6KB)
                </span>
              </div>
              <p className="text-xs text-[#637565] leading-relaxed mb-4">
                Zero-dependency Python 3 script using standard library only. Starts a local HTTP server on <code className="font-mono text-[#2D4335]">localhost:8022</code> with local disk storage in <code className="font-mono text-[#2D4335]">dignifi_local_vault.json</code>.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#EEF3EA]">
              <button
                onClick={downloadDignifiPython}
                className="w-full py-2.5 bg-[#2D4335] hover:bg-[#203126] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <HardDriveDownload className="w-3.5 h-3.5" />
                <span>Download Python Script</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy('py')}
                  className="flex-1 py-1.5 text-xs text-[#4A5D4D] bg-white border border-[#D5DFD1] hover:bg-[#F3F7F0] rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  {copiedType === 'py' ? <Check className="w-3.5 h-3.5 text-[#2D4335]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'py' ? 'Copied Python!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={() => setActiveCodeTab(activeCodeTab === 'py' ? 'none' : 'py')}
                  className="px-3 py-1.5 text-xs text-[#4A5D4D] bg-white border border-[#D5DFD1] hover:bg-[#F3F7F0] rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{activeCodeTab === 'py' ? 'Hide' : 'Inspect'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Live Code Preview Drawer if user clicks Inspect */}
        {activeCodeTab !== 'none' && (
          <div className="border border-[#DEE6DA] rounded-2xl overflow-hidden bg-[#1C261E] text-white animate-in fade-in duration-150">
            <div className="px-4 py-2 bg-[#141C16] flex items-center justify-between text-xs border-b border-[#2A3B2E]">
              <span className="font-mono font-semibold text-[#B9D4BF]">
                {activeCodeTab === 'html' ? 'Dignifi_Version_22.html' : 'dignifi_version_22.py'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(activeCodeTab)}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-[11px] font-medium flex items-center gap-1 text-white cursor-pointer"
                >
                  {copiedType === activeCodeTab ? <Check className="w-3 h-3 text-[#A7C8AE]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === activeCodeTab ? 'Copied!' : 'Copy All'}</span>
                </button>
                <button
                  onClick={() => setActiveCodeTab('none')}
                  className="text-[#96A89A] hover:text-white text-xs cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
            <pre className="p-4 font-mono text-[11px] leading-relaxed max-h-60 overflow-y-auto text-[#D5E4D8]">
              {activeCodeTab === 'html' ? DIGNIFI_VERSION_22_HTML : DIGNIFI_VERSION_22_PY}
            </pre>
          </div>
        )}

        {/* Localhost Terminal Instructions */}
        <div className="bg-[#FAFBF9] border border-[#DEE6DA] rounded-xl p-4 text-xs space-y-3">
          <h4 className="font-bold uppercase tracking-wider text-[#203225] flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#2D4335]" />
            <span>Exact Steps to Run Locally</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-white border border-[#E2EADA] rounded-xl space-y-1.5">
              <span className="font-bold text-[#1C261E] block text-[11px] uppercase tracking-wider">
                Method 1: Full React + Vite Source (ZIP)
              </span>
              <ol className="list-decimal list-inside space-y-1 text-[#465848] text-[11px]">
                <li>Extract <code className="font-mono text-[#2D4335]">dignifi-source-code.zip</code></li>
                <li>Run <code className="font-mono bg-[#EAEFE6] px-1.5 py-0.5 rounded text-[#1C261E]">npm install</code></li>
                <li>Run <code className="font-mono bg-[#EAEFE6] px-1.5 py-0.5 rounded text-[#1C261E]">npm run dev</code></li>
                <li>Visit <code className="font-mono text-[#2D4335]">http://localhost:3000</code></li>
              </ol>
            </div>

            <div className="p-3 bg-white border border-[#E2EADA] rounded-xl space-y-1.5">
              <span className="font-bold text-[#1C261E] block text-[11px] uppercase tracking-wider">
                Method 2: Standalone Python 3 Runner
              </span>
              <ol className="list-decimal list-inside space-y-1 text-[#465848] text-[11px]">
                <li>Save <code className="font-mono text-[#2D4335]">dignifi_version_22.py</code> and HTML file</li>
                <li>Run <code className="font-mono bg-[#EAEFE6] px-1.5 py-0.5 rounded text-[#1C261E]">python3 dignifi_version_22.py</code></li>
                <li>Auto-opens at <code className="font-mono text-[#2D4335]">http://localhost:8022</code></li>
                <li>Air-gapped local storage in <code className="font-mono text-[#2D4335]">dignifi_local_vault.json</code></li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#EAEFE6] hover:bg-[#DEE7DA] text-[#2D4335] text-xs font-semibold rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
