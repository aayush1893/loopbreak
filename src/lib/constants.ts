import type { ResetStep } from '@/types/calm-receipt';

// Reset cycle configuration
export const STEP_DURATION_MS = 30000; // 30 seconds per step
export const TOTAL_CYCLE_MS = 90000;   // 90 seconds total
export const MAX_NOTE_LENGTH = 80;

// Reset step definitions
export const RESET_STEPS: Record<ResetStep, {
  title: string;
  instruction: string;
  tip: string;
  duration: number;
}> = {
  cognitive: {
    title: 'Cognitive Switch',
    instruction: 'Count backwards from 100 by 7s',
    tip: 'Don\'t worry if you lose track - just start again from any number',
    duration: 30,
  },
  sensory: {
    title: 'Sensory Grounding',
    instruction: 'Name 3 things you can see, hear, and feel',
    tip: 'Say them out loud or in your mind - be specific',
    duration: 30,
  },
  breathing: {
    title: 'Breathing',
    instruction: 'Follow the breathing pattern',
    tip: 'Breathe in 4s, hold 2s, out 6s',
    duration: 30,
  },
};

// Breathing pattern for step 3
export const BREATHING_PATTERN = {
  inhale: 4,
  hold: 2,
  exhale: 6,
};

// Privacy message
export const PRIVACY_MESSAGE = 'Your data never leaves your phone';

// Reminder settings
export const REMINDER_INTERVAL_HOURS = 3;
