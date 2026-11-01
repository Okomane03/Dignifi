export interface ReflectionPromptItem {
  id: string;
  category: 'context_clarity' | 'pattern_recognition' | 'support_needs' | 'impact_assessment';
  question: string;
  contextExplanation: string;
  exampleAnswers?: string[];
}

export const REFLECTION_PROMPTS: ReflectionPromptItem[] = [
  {
    id: 'prompt_recurrence',
    category: 'pattern_recognition',
    question: 'Has a similar interaction or atmosphere occurred before with the same person, group, or setting?',
    contextExplanation: 'Reflecting on past interactions helps distinguish isolated interpersonal friction from recurring behavioral patterns over time, without making any assumption about intent.',
    exampleAnswers: [
      'This is the first time anything like this happened.',
      'Similar comments were made during the last two quarterly reviews.',
      'It seems to happen primarily during high-pressure deadlines or after hours.'
    ]
  },
  {
    id: 'prompt_setting_dynamics',
    category: 'context_clarity',
    question: 'What was the immediate context or setting just before this exchange occurred?',
    contextExplanation: 'Documenting what was happening right before (e.g. project deadline, informal coffee, private 1-on-1, team Slack channel) preserves realistic situational context.',
    exampleAnswers: [
      'We were in a scheduled 1-on-1 performance catch-up.',
      'It occurred in an open floor plan with colleagues sitting nearby.',
      'It happened in an unrecorded video meeting after everyone else logged off.'
    ]
  },
  {
    id: 'prompt_presence_witnesses',
    category: 'context_clarity',
    question: 'Were there other individuals present, within earshot, or copied on digital correspondence?',
    contextExplanation: 'Noting who was in proximity helps identify potential contemporaneous witnesses without implying they agree with or share your interpretation.',
    exampleAnswers: [
      'Two project coordinators were sitting at adjacent desks.',
      'The entire product team was present on the Slack thread.',
      'No one else was present; it was behind closed office doors.'
    ]
  },
  {
    id: 'prompt_immediate_impact',
    category: 'impact_assessment',
    question: 'How did your body, mood, or focus respond during and immediately following this event?',
    contextExplanation: 'Recording somatic and emotional sensations (e.g., racing pulse, difficulty sleeping, nausea, detachment) helps track personal wellbeing over time.',
    exampleAnswers: [
      'Experienced acute anxiety and struggled to focus on deliverables for the rest of the day.',
      'Felt stunned into silence and excused myself to the restroom.',
      'Felt hesitant to speak up in subsequent team meetings.'
    ]
  },
  {
    id: 'prompt_support_clarity',
    category: 'support_needs',
    question: 'What immediate step, boundary, or supportive conversation would feel most helpful right now?',
    contextExplanation: 'This prompt encourages agency: deciding what you need (e.g., a quiet space, talking to a confidential helpline, speaking to an EAP counselor, or simply sitting with this note).',
    exampleAnswers: [
      'I need 24 hours to step back and re-read this with a clear head before deciding anything.',
      'I want to speak with an independent employee assistance counselor (EAP).',
      'I want to check our internal harassment policy to see what formal procedures look like.'
    ]
  }
];
