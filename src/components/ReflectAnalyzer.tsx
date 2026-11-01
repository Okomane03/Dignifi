import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  TrendingUp,
  HeartHandshake,
  Shield,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { IncidentRecord } from '../types/incident';
import { REFLECTION_PROMPTS } from '../data/reflectionPrompts';

interface ReflectAnalyzerProps {
  records: IncidentRecord[];
  onStartDocumentation: () => void;
}

export const ReflectAnalyzer: React.FC<ReflectAnalyzerProps> = ({ records, onStartDocumentation }) => {
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>('all');
  const [expandedPromptId, setExpandedPromptId] = useState<string | null>(REFLECTION_PROMPTS[0].id);

  // Pattern detection logic across user records
  const actorMap: Record<string, number> = {};
  const categoryMap: Record<string, number> = {};
  const locationMap: Record<string, number> = {};

  records.forEach(r => {
    r.categories.forEach(c => {
      categoryMap[c] = (categoryMap[c] || 0) + 1;
    });
    r.peopleInvolved.forEach(p => {
      if (p.nameOrRole) {
        actorMap[p.nameOrRole] = (actorMap[p.nameOrRole] || 0) + 1;
      }
    });
    locationMap[r.locationType] = (locationMap[r.locationType] || 0) + 1;
  });

  const recurringActors = Object.entries(actorMap).filter(([_, count]) => count > 1);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-[#5C6E5F] font-medium mb-1">
          <span>4. Reflect</span>
          <span>·</span>
          <span>Neutral Reflection & Pattern Recognition (Non-Judgemental Guidance)</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C261E]">
          Context, Patterns & Support Clarity
        </h2>
        <p className="text-sm text-[#5C6D5F] mt-1.5 max-w-2xl leading-relaxed">
          These neutral prompts help you unpack the context of an experience, recognize recurring workplace patterns, and clarify what support you may need—without determining whether misconduct has occurred or validating credibility.
        </p>
      </div>

      {/* Pattern Intelligence Card */}
      <div className="bg-white border border-[#E0E7DC] rounded-2xl p-6 sm:p-7 shadow-xs mb-8">
        <div className="flex items-center gap-2.5 mb-4">
          <TrendingUp className="w-5 h-5 text-[#2D4335]" />
          <h3 className="font-serif text-lg font-bold text-[#1C261E]">
            Observed Patterns Across Your Records ({records.length} Documented)
          </h3>
        </div>

        {records.length === 0 ? (
          <div className="bg-[#FAFBF9] border border-[#E3EBDC] rounded-xl p-5 text-center text-xs text-[#637565]">
            <p>Once you document at least 2 events, Dignifi highlights recurring actors, settings, and timelines to help you evaluate patterns objectively.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            {/* Recurring Individuals */}
            <div className="p-4 bg-[#FAFBF9] border border-[#DEE6DA] rounded-xl">
              <span className="font-semibold text-[#1C261E] block mb-2">Involved Individuals & Frequency</span>
              {recurringActors.length > 0 ? (
                <div className="space-y-1.5">
                  {recurringActors.map(([name, count]) => (
                    <div key={name} className="flex justify-between items-center text-[#2D4335]">
                      <span className="font-medium truncate">{name}</span>
                      <span className="font-mono bg-[#EBF2E8] px-2 py-0.5 rounded text-[11px] font-semibold">
                        {count} instances
                      </span>
                    </div>
                  ))}
                  <p className="text-[11px] text-[#697A6B] mt-2">
                    Multiple entries involve the same individual. This may assist in demonstrating an ongoing pattern if you choose to consult HR or union representatives.
                  </p>
                </div>
              ) : (
                <p className="text-[#697A6B]">
                  {Object.keys(actorMap).length > 0
                    ? `${Object.keys(actorMap).length} individual(s) recorded across separate events.`
                    : 'No specific individual recorded yet.'}
                </p>
              )}
            </div>

            {/* Workplace Setting Clustering */}
            <div className="p-4 bg-[#FAFBF9] border border-[#DEE6DA] rounded-xl">
              <span className="font-semibold text-[#1C261E] block mb-2">Setting & Medium Clustering</span>
              <div className="space-y-1">
                {Object.entries(locationMap).map(([loc, count]) => (
                  <div key={loc} className="flex justify-between text-[#384A3B]">
                    <span className="capitalize">{loc.replace(/-/g, ' ')}</span>
                    <span className="font-mono">{count}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#697A6B] mt-3">
                Tracking settings helps determine whether issues happen primarily during 1-on-1s, remote video calls, or public forums.
              </p>
            </div>

            {/* Conduct Category Spread */}
            <div className="p-4 bg-[#FAFBF9] border border-[#DEE6DA] rounded-xl">
              <span className="font-semibold text-[#1C261E] block mb-2">Categories Documented</span>
              <div className="space-y-1">
                {Object.entries(categoryMap).map(([cat, count]) => (
                  <div key={cat} className="flex justify-between text-[#384A3B]">
                    <span className="capitalize">{cat.replace(/_/g, ' ')}</span>
                    <span className="font-mono">{count}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Neutral Reflection Prompts */}
      <div className="bg-white border border-[#E0E7DC] rounded-2xl p-6 sm:p-7 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1C261E]">
              Guided Reflection Questions
            </h3>
            <p className="text-xs text-[#637565]">
              Designed according to trauma-informed and records-management principles.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#EEF2EB] p-1 rounded-xl text-xs">
            <button
              onClick={() => setSelectedPromptCategory('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedPromptCategory === 'all' ? 'bg-white font-semibold text-[#2D4335] shadow-xs' : 'text-[#5C6E5E]'
              }`}
            >
              All Prompts
            </button>
            <button
              onClick={() => setSelectedPromptCategory('context_clarity')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedPromptCategory === 'context_clarity' ? 'bg-white font-semibold text-[#2D4335] shadow-xs' : 'text-[#5C6E5E]'
              }`}
            >
              Context
            </button>
            <button
              onClick={() => setSelectedPromptCategory('pattern_recognition')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedPromptCategory === 'pattern_recognition' ? 'bg-white font-semibold text-[#2D4335] shadow-xs' : 'text-[#5C6E5E]'
              }`}
            >
              Patterns
            </button>
            <button
              onClick={() => setSelectedPromptCategory('support_needs')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedPromptCategory === 'support_needs' ? 'bg-white font-semibold text-[#2D4335] shadow-xs' : 'text-[#5C6E5E]'
              }`}
            >
              Support Needs
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {REFLECTION_PROMPTS.filter(p => selectedPromptCategory === 'all' || p.category === selectedPromptCategory).map(prompt => {
            const isExpanded = expandedPromptId === prompt.id;
            return (
              <div
                key={prompt.id}
                className="border border-[#E0E7DC] rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedPromptId(isExpanded ? null : prompt.id)}
                  className="w-full text-left p-4 bg-[#FAFBF9] hover:bg-[#F4F7F1] flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-semibold text-[#1C261E]">
                    {prompt.question}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#5D6F60] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#5D6F60] shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 bg-white border-t border-[#E8EFE5] text-xs text-[#4F6051] space-y-3">
                    <p className="leading-relaxed">{prompt.contextExplanation}</p>
                    
                    {prompt.exampleAnswers && (
                      <div className="bg-[#F8FAF6] p-3 rounded-lg border border-[#E5EFE2]">
                        <span className="font-semibold text-[#203224] block mb-1.5">
                          How other employees clarify this facet:
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-[#556756]">
                          {prompt.exampleAnswers.map((ex, i) => (
                            <li key={i}>{ex}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support & Agency Clarity Box */}
      <div className="bg-[#FAFBF9] border border-[#DCE4D8] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h4 className="font-serif text-lg font-bold text-[#1C261E] mb-1">
            Clarify What You Need Right Now
          </h4>
          <p className="text-xs text-[#5D6F60] max-w-xl leading-relaxed">
            You do not have to make any immediate reporting decision. Dignifi is designed to hold your records safely until you feel ready to review your South African legal and workplace options.
          </p>
        </div>
        <button
          onClick={onStartDocumentation}
          className="px-5 py-2.5 bg-[#2D4335] hover:bg-[#203126] text-white text-xs font-semibold rounded-xl shrink-0 cursor-pointer shadow-xs"
        >
          Document Another Event
        </button>
      </div>

    </div>
  );
};
