import React from 'react';
import { Lock, RefreshCw, CheckCircle2, Calendar } from 'lucide-react';

interface QuickExitScreenProps {
  onResume: () => void;
}

export const QuickExitScreen: React.FC<QuickExitScreenProps> = ({ onResume }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#F7F9F5] flex flex-col justify-between p-6 sm:p-12 font-sans text-[#1C261E]">
      
      {/* Top camouflage bar */}
      <div className="flex items-center justify-between border-b border-[#E2E8DC] pb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#384A3B]">
          <Calendar className="w-4 h-4 text-[#465A49]" />
          <span>Personal Daily Focus & Notes</span>
        </div>
        <span className="text-xs text-[#718273]">Updated Today at 08:30</span>
      </div>

      {/* Camouflage Body: Looks like everyday harmless task checklist */}
      <div className="max-w-xl mx-auto w-full my-auto bg-white border border-[#DFE7DB] rounded-2xl p-8 shadow-sm">
        <h2 className="font-serif text-2xl font-bold text-[#1C261E] mb-2">
          Daily Project Priorities
        </h2>
        <p className="text-xs text-[#637565] mb-6">
          Working draft for sprint backlog and operational milestones.
        </p>

        <div className="space-y-3 mb-8">
          <div className="p-3 bg-[#FAFBF9] border border-[#E3EBDC] rounded-xl flex items-center gap-3 text-xs">
            <CheckCircle2 className="w-4 h-4 text-[#3C5843]" />
            <span className="line-through text-[#7A8A7C]">Review Q4 technical documentation draft</span>
          </div>
          <div className="p-3 bg-[#FAFBF9] border border-[#E3EBDC] rounded-xl flex items-center gap-3 text-xs">
            <div className="w-4 h-4 rounded-full border border-[#96A698]" />
            <span className="text-[#1C261E]">Prepare executive summaries for stakeholder sync</span>
          </div>
          <div className="p-3 bg-[#FAFBF9] border border-[#E3EBDC] rounded-xl flex items-center gap-3 text-xs">
            <div className="w-4 h-4 rounded-full border border-[#96A698]" />
            <span className="text-[#1C261E]">Organise cross-departmental training materials</span>
          </div>
        </div>

        <div className="pt-4 border-t border-[#EDF2EA] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#6E8070]">
            <Lock className="w-3.5 h-3.5 text-[#4D6451]" />
            <span>Session privacy active</span>
          </div>

          <button
            onClick={onResume}
            className="px-4 py-2 bg-[#2D4335] hover:bg-[#203126] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Resume Dignifi Session</span>
          </button>
        </div>
      </div>

      <div className="text-center text-[11px] text-[#819283]">
        Press Resume when you are ready to continue your secure documentation.
      </div>
    </div>
  );
};
