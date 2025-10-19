import type { CognitiveDistortion, MicroAct } from '@/types/calm-receipt';

export const COGNITIVE_DISTORTIONS: Record<CognitiveDistortion, { label: string; prompt: string }> = {
  catastrophizing: {
    label: 'Catastrophizing',
    prompt: "What's a 1-step-better outcome that's still realistic?",
  },
  'all-or-nothing': {
    label: 'All-or-nothing',
    prompt: "What's a middle option between 0 and 100?",
  },
  'mind-reading': {
    label: 'Mind reading',
    prompt: 'What evidence supports/against my guess?',
  },
  shoulds: {
    label: 'Shoulds',
    prompt: 'If a friend said this, what would I say back?',
  },
  personalization: {
    label: 'Personalization',
    prompt: 'What factors beyond me also mattered?',
  },
  overgeneralizing: {
    label: 'Overgeneralizing',
    prompt: "What's the closest exception to this rule?",
  },
};

export const MICRO_ACTS: Record<MicroAct, { label: string; steps: string[] }> = {
  'sip-water': {
    label: 'Sip water',
    steps: ['Fill cup', 'Sip slowly', 'Notice 3 swallows'],
  },
  'open-window': {
    label: 'Open a window',
    steps: ['Stand up', 'Walk to window', 'Feel the air change'],
  },
  'walk-to-sink': {
    label: 'Walk to sink',
    steps: ['Stand up', 'Walk slowly', 'Touch the faucet'],
  },
  'name-colors': {
    label: 'Name 5 colors',
    steps: ['Look around', 'Point at each', 'Say them out loud'],
  },
  'shoulder-roll': {
    label: 'Shoulder roll ×5',
    steps: ['Roll back slowly', 'Feel the movement', 'Breathe with each'],
  },
  'pet-texture': {
    label: 'Pet/stroke texture',
    steps: ['Find soft surface', 'Stroke gently', 'Notice the feeling'],
  },
};

export const GROUNDING_STEPS = [
  { id: 5, text: '5 things you see', key: 'see' },
  { id: 4, text: '4 things you feel (touch)', key: 'feel' },
  { id: 3, text: '3 things you hear', key: 'hear' },
  { id: 2, text: '2 things you smell', key: 'smell' },
  { id: 1, text: '1 slow breath (inhale 4, hold 4, exhale 6)', key: 'breath' },
];

export const LANE_SOFT_TIMER_MS = 120000; // 120 seconds
export const MAX_NOTE_LENGTH = 80;
export const URGE_MIN = 0;
export const URGE_MAX = 10;

export const PILOT_FORM_URL = 'https://forms.google.com/your-pilot-form'; // Replace with actual form URL
