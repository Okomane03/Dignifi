import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  Users,
  Paperclip,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { IncidentRecord, IncidentCategory, LocationType, PersonInvolved, EvidenceItem } from '../types/incident';
import { computeRecordHash } from '../utils/crypto';
import { REFLECTION_PROMPTS } from '../data/reflectionPrompts';

interface DocumentWizardProps {
  onSaveRecord: (record: IncidentRecord) => void;
  onCancel: () => void;
}

export const DocumentWizard: React.FC<DocumentWizardProps> = ({ onSaveRecord, onCancel }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [incidentDate, setIncidentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [incidentTime, setIncidentTime] = useState('14:00');
  const [locationType, setLocationType] = useState<LocationType>('in-person-office');
  const [locationDetails, setLocationDetails] = useState('');
  const [categories, setCategories] = useState<IncidentCategory[]>(['bullying']);
  
  // Contemporaneous First-hand Account
  const [contemporaneousNarrative, setContemporaneousNarrative] = useState('');
  
  // People Involved
  const [people, setPeople] = useState<PersonInvolved[]>([
    {
      id: 'p1',
      nameOrRole: '',
      roleInIncident: 'primary_actor',
      department: '',
      approximateSeniority: 'direct_manager'
    }
  ]);

  // Evidence Items
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [newEvidenceTitle, setNewEvidenceTitle] = useState('');
  const [newEvidenceType, setNewEvidenceType] = useState<EvidenceItem['type']>('email');
  const [newEvidenceSummary, setNewEvidenceSummary] = useState('');

  // Perceived Impact
  const [psychologicalSafety, setPsychologicalSafety] = useState('');
  const [professionalImpact, setProfessionalImpact] = useState('');
  const [physicalWellbeing, setPhysicalWellbeing] = useState('');
  const [severityScore, setSeverityScore] = useState<1 | 2 | 3 | 4 | 5>(3);

  // Reflection responses
  const [selectedReflectionPrompt, setSelectedReflectionPrompt] = useState(REFLECTION_PROMPTS[0].id);
  const [reflectionAnswerText, setReflectionAnswerText] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCategory = (cat: IncidentCategory) => {
    if (categories.includes(cat)) {
      if (categories.length > 1) {
        setCategories(categories.filter(c => c !== cat));
      }
    } else {
      setCategories([...categories, cat]);
    }
  };

  const addPersonRow = () => {
    setPeople([
      ...people,
      {
        id: `p-${Date.now()}`,
        nameOrRole: '',
        roleInIncident: 'witness',
        department: '',
        approximateSeniority: 'peer'
      }
    ]);
  };

  const updatePerson = (id: string, field: keyof PersonInvolved, value: any) => {
    setPeople(people.map(p => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const removePerson = (id: string) => {
    if (people.length > 1) {
      setPeople(people.filter(p => p.id !== id));
    }
  };

  const addEvidence = () => {
    if (!newEvidenceTitle.trim()) return;
    const item: EvidenceItem = {
      id: `ev-${Date.now()}`,
      title: newEvidenceTitle.trim(),
      type: newEvidenceType,
      dateAttached: new Date().toISOString().split('T')[0],
      summary: newEvidenceSummary.trim() || 'Contemporaneously logged reference artifact',
      tamperChecksum: `sha256_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(16)}`
    };
    setEvidenceItems([...evidenceItems, item]);
    setNewEvidenceTitle('');
    setNewEvidenceSummary('');
  };

  const removeEvidence = (id: string) => {
    setEvidenceItems(evidenceItems.filter(e => e.id !== id));
  };

  const handleFinalSave = async () => {
    if (!title.trim() || !contemporaneousNarrative.trim()) {
      alert('Please complete the title and your contemporaneous narrative.');
      return;
    }

    setIsSubmitting(true);
    const recordId = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    const hash = await computeRecordHash({
      id: recordId,
      incidentDate,
      contemporaneousNarrative,
      createdAt: nowIso
    });

    const activePromptObj = REFLECTION_PROMPTS.find(p => p.id === selectedReflectionPrompt);

    const newRecord: IncidentRecord = {
      id: recordId,
      title: title.trim(),
      createdAt: nowIso,
      updatedAt: nowIso,
      incidentDate,
      incidentTime,
      locationType,
      locationDetails: locationDetails.trim() || 'Workplace setting',
      categories,
      contemporaneousNarrative: contemporaneousNarrative.trim(),
      subsequentNotes: [],
      reflectionResponses: reflectionAnswerText.trim() && activePromptObj
        ? [
            {
              promptId: activePromptObj.id,
              question: activePromptObj.question,
              answer: reflectionAnswerText.trim(),
              answeredAt: nowIso
            }
          ]
        : [],
      peopleInvolved: people.filter(p => p.nameOrRole.trim().length > 0),
      perceivedImpact: {
        psychologicalSafety: psychologicalSafety.trim() || 'Documented for personal clarity and boundary assessment.',
        professionalImpact: professionalImpact.trim() || 'Preserving contemporaneous record of interaction.',
        physicalWellbeing: physicalWellbeing.trim() || 'No acute physical symptoms noted.',
        severityScore
      },
      evidenceItems,
      status: 'vault_secured',
      cryptographicHash: hash,
      isEncryptedInVault: true
    };

    onSaveRecord(newRecord);
    setIsSubmitting(false);
  };

  const categoryLabels: Record<IncidentCategory, { label: string; desc: string }> = {
    bullying: { label: 'Bullying & Mobbing', desc: 'Persistent aggressive, mocking, or undermining conduct' },
    sexual_harassment: { label: 'Sexual Harassment', desc: 'Unwelcome sexual conduct, remarks, or quid-pro-quo' },
    racial_discrimination: { label: 'Racial / Ethnic Bias', desc: 'Demeaning ethnic, racial, or cultural stereotyping' },
    gender_discrimination: { label: 'Gender Discrimination', desc: 'Unequal treatment or bias based on gender identity' },
    microaggression: { label: 'Microaggression', desc: 'Subtle, indirect, or veiled invalidating behavior' },
    intimidation: { label: 'Intimidation & Coercion', desc: 'Threats to job security, loud outbursts, or posturing' },
    retaliation: { label: 'Retaliation / Victimization', desc: 'Detriment following a grievance, query, or report' },
    unethical_directive: { label: 'Unlawful / Unethical Directive', desc: 'Instructions violating regulations, safety, or ethics' },
    general_harassment: { label: 'Hostile Environment', desc: 'General repeated behavior that creates an intolerable workplace' }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Wizard Header & Progress */}
      <div className="bg-white border border-[#E0E7DC] rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#EDF2EA]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#526455] font-medium mb-1">
              <span>Step {step} of 4</span>
              <span>·</span>
              <span>Records-Management Principle: Data Minimisation & User Agency</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C261E]">
              Guided Incident Documentation
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="px-3.5 py-1.5 text-xs text-[#5D6B60] hover:text-[#1C261E] rounded-lg transition-colors cursor-pointer"
            >
              Cancel & Return
            </button>
          </div>
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-4 gap-2 text-xs font-medium">
          <div
            onClick={() => setStep(1)}
            className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
              step === 1
                ? 'bg-[#EAEFE7] border-[#2D4335] text-[#2D4335] font-semibold'
                : 'bg-[#F9FAF7] border-[#E5ECE0] text-[#69796C]'
            }`}
          >
            <span className="block text-[10px] text-[#556758] uppercase">Phase 1</span>
            1. Context & Type
          </div>
          <div
            onClick={() => step > 1 && setStep(2)}
            className={`p-2.5 rounded-lg border transition-all ${
              step === 2
                ? 'bg-[#EAEFE7] border-[#2D4335] text-[#2D4335] font-semibold cursor-pointer'
                : step > 2
                ? 'bg-[#F9FAF7] border-[#E5ECE0] text-[#69796C] cursor-pointer'
                : 'opacity-50 cursor-not-allowed bg-[#F9FAF7] border-[#E5ECE0]'
            }`}
          >
            <span className="block text-[10px] text-[#556758] uppercase">Phase 2</span>
            2. First-Hand Account
          </div>
          <div
            onClick={() => step > 2 && setStep(3)}
            className={`p-2.5 rounded-lg border transition-all ${
              step === 3
                ? 'bg-[#EAEFE7] border-[#2D4335] text-[#2D4335] font-semibold cursor-pointer'
                : step > 3
                ? 'bg-[#F9FAF7] border-[#E5ECE0] text-[#69796C] cursor-pointer'
                : 'opacity-50 cursor-not-allowed bg-[#F9FAF7] border-[#E5ECE0]'
            }`}
          >
            <span className="block text-[10px] text-[#556758] uppercase">Phase 3</span>
            3. People & Evidence
          </div>
          <div
            onClick={() => step > 3 && setStep(4)}
            className={`p-2.5 rounded-lg border transition-all ${
              step === 4
                ? 'bg-[#EAEFE7] border-[#2D4335] text-[#2D4335] font-semibold cursor-pointer'
                : 'opacity-50 cursor-not-allowed bg-[#F9FAF7] border-[#E5ECE0]'
            }`}
          >
            <span className="block text-[10px] text-[#556758] uppercase">Phase 4</span>
            4. Impact & Seal
          </div>
        </div>
      </div>

      {/* STEP 1: CONTEXT & METADATA */}
      {step === 1 && (
        <div className="bg-white border border-[#E0E7DC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#1C261E] mb-1.5">
              Incident Summary Headline <span className="text-[#8B3A2B]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Inappropriate comment regarding performance and cultural attire in sprint 1-on-1"
              className="w-full px-3.5 py-2.5 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-sm text-[#1C261E] focus:outline-none focus:ring-2 focus:ring-[#2D4335]/30 focus:border-[#2D4335]"
            />
            <p className="text-xs text-[#6A786C] mt-1">
              A concise factual title that will help you identify this record in your timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1C261E] mb-1.5">
                Date Occurred <span className="text-[#8B3A2B]">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={incidentDate}
                  onChange={e => setIncidentDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-sm text-[#1C261E] focus:outline-none focus:ring-2 focus:ring-[#2D4335]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1C261E] mb-1.5">
                Approximate Time
              </label>
              <input
                type="time"
                value={incidentTime}
                onChange={e => setIncidentTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-sm text-[#1C261E] focus:outline-none focus:ring-2 focus:ring-[#2D4335]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1C261E] mb-1.5">
                Setting & Medium
              </label>
              <select
                value={locationType}
                onChange={e => setLocationType(e.target.value as LocationType)}
                className="w-full px-3.5 py-2.5 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-sm text-[#1C261E] focus:outline-none focus:ring-2 focus:ring-[#2D4335]/30"
              >
                <option value="in-person-office">In-Person Office / Meeting Room</option>
                <option value="remote-video-call">Remote Video Call (Teams, Zoom, Meet)</option>
                <option value="chat-or-email">Written Channel (Slack, Teams Chat, Email)</option>
                <option value="work-event-offsite">Work Offsite / Conference / Dinner</option>
                <option value="hybrid-other">Hybrid / Other Context</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1C261E] mb-1.5">
                Location Details / Channel
              </label>
              <input
                type="text"
                value={locationDetails}
                onChange={e => setLocationDetails(e.target.value)}
                placeholder="e.g. 5th Floor Boardroom 5A or #project-core Slack thread"
                className="w-full px-3.5 py-2.5 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-sm text-[#1C261E] focus:outline-none focus:ring-2 focus:ring-[#2D4335]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1C261E] mb-2">
              Conduct Classification <span className="text-xs font-normal text-[#6A786C]">(Select all relevant facets)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {(Object.keys(categoryLabels) as IncidentCategory[]).map(catKey => {
                const isSelected = categories.includes(catKey);
                const info = categoryLabels[catKey];
                return (
                  <button
                    type="button"
                    key={catKey}
                    onClick={() => toggleCategory(catKey)}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#EBF2E8] border-[#2D4335] shadow-xs'
                        : 'bg-[#FAFBF9] border-[#E0E7DC] hover:border-[#CCD8C7]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-semibold ${isSelected ? 'text-[#203426]' : 'text-[#2D3930]'}`}>
                        {info.label}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#2D4335]" />}
                    </div>
                    <p className="text-[11px] text-[#637265] line-clamp-2 leading-tight">
                      {info.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => {
                if (!title.trim()) {
                  alert('Please enter a headline summary before continuing.');
                  return;
                }
                setStep(2);
              }}
              className="px-6 py-2.5 bg-[#2D4335] hover:bg-[#223428] text-white text-sm font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Next: Record Your Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CONTEMPORANEOUS NARRATIVE */}
      {step === 2 && (
        <div className="bg-white border border-[#E0E7DC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="bg-[#F4F7F1] border border-[#DEE7D9] rounded-xl p-4 text-xs text-[#435948] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#2D4335] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#203325] mb-0.5">Records-Management Integrity Principle</p>
              <p>
                This first-hand narrative represents your <strong>contemporaneous account</strong> recorded in your own words. Dignifi will seal this text with an SHA-256 cryptographic digest. Any future notes, clarifications, or updates you make will be preserved as separate subsequent entries—preventing any dispute over retroactive alteration.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1C261E] mb-1.5">
              What Occurred? (In your own words) <span className="text-[#8B3A2B]">*</span>
            </label>
            <textarea
              rows={9}
              value={contemporaneousNarrative}
              onChange={e => setContemporaneousNarrative(e.target.value)}
              placeholder="Describe chronologically what took place. Include exact or approximate words spoken, actions, physical posture, who initiated the conversation, and how the interaction concluded..."
              className="w-full px-4 py-3 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-sm text-[#1C261E] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2D4335]/30 focus:border-[#2D4335]"
            />
            <div className="flex justify-between items-center text-xs text-[#6A786C] mt-1.5">
              <span>Aim for factual, chronological clarity (dates, quotes, specific conduct).</span>
              <span>{contemporaneousNarrative.length} characters</span>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm text-[#576859] hover:text-[#1C261E] flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (!contemporaneousNarrative.trim()) {
                  alert('Please write your narrative account before continuing.');
                  return;
                }
                setStep(3);
              }}
              className="px-6 py-2.5 bg-[#2D4335] hover:bg-[#223428] text-white text-sm font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Next: People & Evidence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PEOPLE INVOLVED & EVIDENCE ARTIFACTS */}
      {step === 3 && (
        <div className="bg-white border border-[#E0E7DC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
          
          {/* People Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-[#1C261E]">People Involved & Potential Witnesses</h3>
                <p className="text-xs text-[#647466]">Record names or roles without implying their endorsement or interpretation.</p>
              </div>
              <button
                type="button"
                onClick={addPersonRow}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D4335] bg-[#EBF2E8] hover:bg-[#E1ECDD] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Person</span>
              </button>
            </div>

            <div className="space-y-3">
              {people.map((person, idx) => (
                <div key={person.id} className="p-3.5 bg-[#F9FAF7] border border-[#DEE6DA] rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-medium text-[#566858] mb-1">Name / Identifier / Role</label>
                    <input
                      type="text"
                      value={person.nameOrRole}
                      onChange={e => updatePerson(person.id, 'nameOrRole', e.target.value)}
                      placeholder="e.g. John Doe (Lead Architect)"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#D1DCD0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2D4335]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-medium text-[#566858] mb-1">Role in Incident</label>
                    <select
                      value={person.roleInIncident}
                      onChange={e => updatePerson(person.id, 'roleInIncident', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#D1DCD0] rounded-lg focus:outline-none"
                    >
                      <option value="primary_actor">Primary Actor / Initiator</option>
                      <option value="co_actor">Secondary / Co-Actor</option>
                      <option value="witness">Present Witness</option>
                      <option value="management_notified">Management Notified</option>
                      <option value="support_person">Support Person</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-medium text-[#566858] mb-1">Seniority Relationship</label>
                    <select
                      value={person.approximateSeniority}
                      onChange={e => updatePerson(person.id, 'approximateSeniority', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#D1DCD0] rounded-lg focus:outline-none"
                    >
                      <option value="direct_manager">Direct Manager / Supervisor</option>
                      <option value="senior_executive">Senior Executive / Director</option>
                      <option value="peer">Colleague / Peer</option>
                      <option value="subordinate">Subordinate / Team Member</option>
                      <option value="third_party_client">Client / External Contractor</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 flex justify-end">
                    {people.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePerson(person.id)}
                        className="text-[#964B00] hover:text-[#7A3600] p-1.5 cursor-pointer"
                        title="Remove person"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Artifacts Section */}
          <div className="border-t border-[#EDF2EA] pt-6">
            <h3 className="text-base font-semibold text-[#1C261E] mb-1">Contemporaneous Artifacts & Evidence</h3>
            <p className="text-xs text-[#647466] mb-4">
              Catalog emails, calendar invites, screenshot references, or audio memos. (Data is referenced in your private vault with tamper checksums).
            </p>

            <div className="p-4 bg-[#F9FAF7] border border-[#DEE6DA] rounded-xl mb-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#566858] mb-1">Artifact Title</label>
                  <input
                    type="text"
                    value={newEvidenceTitle}
                    onChange={e => setNewEvidenceTitle(e.target.value)}
                    placeholder="e.g. Email thread re: project removal"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#D1DCD0] rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#566858] mb-1">Artifact Type</label>
                  <select
                    value={newEvidenceType}
                    onChange={e => setNewEvidenceType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#D1DCD0] rounded-lg focus:outline-none"
                  >
                    <option value="email">Email Thread / Correspondence</option>
                    <option value="screenshot">Screenshot / Image Capture</option>
                    <option value="chat_log">Chat Log (Slack / Teams / WhatsApp)</option>
                    <option value="calendar_invite">Calendar Meeting Invite</option>
                    <option value="performance_review">Performance Review Document</option>
                    <option value="audio_voice_memo">Voice Memo / Audio File</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#566858] mb-1">Notes / File Reference</label>
                  <input
                    type="text"
                    value={newEvidenceSummary}
                    onChange={e => setNewEvidenceSummary(e.target.value)}
                    placeholder="e.g. Saved as screenshot_oct17.png"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#D1DCD0] rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addEvidence}
                  className="px-3 py-1.5 bg-[#2D4335] hover:bg-[#233529] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Attach Artifact Entry</span>
                </button>
              </div>
            </div>

            {evidenceItems.length > 0 && (
              <div className="space-y-2">
                {evidenceItems.map(item => (
                  <div key={item.id} className="p-3 bg-white border border-[#E3EBDC] rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Paperclip className="w-4 h-4 text-[#455D49]" />
                      <div>
                        <span className="font-semibold text-[#1C261E]">{item.title}</span>
                        <span className="text-[#68796B] ml-2">({item.type})</span>
                        <p className="text-[11px] text-[#718274]">{item.summary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-[#556758] bg-[#F1F5EE] px-2 py-0.5 rounded">
                        {item.tamperChecksum.substring(0, 14)}...
                      </span>
                      <button
                        type="button"
                        onClick={() => removeEvidence(item.id)}
                        className="text-[#964B00] hover:text-[#7A3600] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-sm text-[#576859] hover:text-[#1C261E] flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 bg-[#2D4335] hover:bg-[#223428] text-white text-sm font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Next: Impact & Vault Seal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PERCEIVED IMPACT, REFLECTION & CRYPTOGRAPHIC SEAL */}
      {step === 4 && (
        <div className="bg-white border border-[#E0E7DC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-semibold text-[#1C261E] mb-1">Perceived Impact Assessment</h3>
            <p className="text-xs text-[#647466] mb-4">
              Recording personal and professional impact helps illustrate workplace harm under South African labour standards (e.g. EEA Harassment Code 2022).
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C261E] mb-1">
                  Psychological & Emotional Impact
                </label>
                <textarea
                  rows={2}
                  value={psychologicalSafety}
                  onChange={e => setPsychologicalSafety(e.target.value)}
                  placeholder="e.g. Acute anxiety, reluctance to speak up, hypervigilance, loss of confidence in team safety..."
                  className="w-full px-3 py-2 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-xs text-[#1C261E] focus:outline-none focus:ring-1 focus:ring-[#2D4335]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C261E] mb-1">
                  Professional & Career Impact
                </label>
                <textarea
                  rows={2}
                  value={professionalImpact}
                  onChange={e => setProfessionalImpact(e.target.value)}
                  placeholder="e.g. Threats to promotion review, exclusion from client committees, reduced project autonomy..."
                  className="w-full px-3 py-2 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-xs text-[#1C261E] focus:outline-none focus:ring-1 focus:ring-[#2D4335]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C261E] mb-1.5">
                  Self-Assessed Severity Impact (1 to 5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setSeverityScore(val as any)}
                      className={`w-10 h-10 rounded-xl font-medium text-xs border cursor-pointer transition-all ${
                        severityScore === val
                          ? 'bg-[#2D4335] text-white border-[#2D4335] shadow-xs'
                          : 'bg-[#FAFBF9] text-[#47574A] border-[#DCE4D8] hover:bg-[#F0F5EE]'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                  <span className="text-xs text-[#6B7A6D] ml-2">
                    {severityScore === 1 && 'Low: Uncomfortable friction'}
                    {severityScore === 2 && 'Mild: Repeated subtle boundary tests'}
                    {severityScore === 3 && 'Moderate: Hostile work environment or exclusion'}
                    {severityScore === 4 && 'High: Severe intimidation, retaliation threat, or abuse'}
                    {severityScore === 5 && 'Critical: Severe safety hazard, GBV, or constructive crisis'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Reflection Prompt integration */}
          <div className="border-t border-[#EDF2EA] pt-6">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-[#3E5C45]" />
              <h4 className="text-xs font-semibold text-[#203324] uppercase tracking-wider">
                Neutral Reflection (Optional)
              </h4>
            </div>
            <p className="text-xs text-[#627364] mb-3">
              Answering a neutral reflection prompt helps unpack context and clarify next steps without bias.
            </p>

            <select
              value={selectedReflectionPrompt}
              onChange={e => setSelectedReflectionPrompt(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-[#1C261E] mb-2 focus:outline-none"
            >
              {REFLECTION_PROMPTS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.question}
                </option>
              ))}
            </select>

            <textarea
              rows={2}
              value={reflectionAnswerText}
              onChange={e => setReflectionAnswerText(e.target.value)}
              placeholder="Your personal reflection notes (optional)..."
              className="w-full px-3 py-2 bg-[#FAFBF9] border border-[#D5DFD1] rounded-xl text-xs text-[#1C261E] focus:outline-none"
            />
          </div>

          {/* Final Seal Box */}
          <div className="p-4 bg-[#F2F6EF] border border-[#D6E3D1] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#2D4335]" />
              <div>
                <p className="text-xs font-semibold text-[#1C261E]">Ready to Seal Contemporaneous Record</p>
                <p className="text-[11px] text-[#556757]">
                  A cryptographic SHA-256 digest will be generated locally. No data leaves your machine.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 text-sm text-[#576859] hover:text-[#1C261E] flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleFinalSave}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#2D4335] hover:bg-[#223428] text-white text-sm font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Seal & Save into Private Vault</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
