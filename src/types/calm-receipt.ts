export type ResetStep = 'cognitive' | 'sensory' | 'breathing';

export interface ResetSession {
  id: string;
  tsStart: number;        // When user pressed "Start Reset"
  tsEnd: number;          // When user confirmed they feel calmer
  tmSec: number;          // Total rumination time (time-to-mental-reset)
  completedCycle: boolean; // Did they complete the 90s cycle?
  feltCalmer: boolean;    // Did they feel calmer after?
  note?: string;          // Optional note (max 80 chars)
  version: 1;
}

// Legacy type alias for backwards compatibility during migration
export type CalmReceipt = ResetSession;
export type Lane = 'ground' | 'reframe' | 'act';
