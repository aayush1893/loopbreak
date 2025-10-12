export type Lane = 'ground' | 'reframe' | 'act';

export type CognitiveDistortion = 
  | 'catastrophizing'
  | 'all-or-nothing'
  | 'mind-reading'
  | 'shoulds'
  | 'personalization'
  | 'overgeneralizing';

export type MicroAct = 
  | 'sip-water'
  | 'open-window'
  | 'walk-to-sink'
  | 'name-colors'
  | 'shoulder-roll'
  | 'pet-texture';

export interface CalmReceipt {
  id: string;
  tsStart: number;
  tsEnd: number;
  lane: Lane;
  rrtSec: number;
  urgeBefore: number | null;
  urgeAfter: number | null;
  note?: string;
  version: 1;
}

export interface GroundingStep {
  id: number;
  text: string;
  completed: boolean;
}

export interface ReframeData {
  distortion: CognitiveDistortion | null;
  counterthought: string;
}

export interface ActData {
  action: MicroAct | null;
  startTime: number | null;
}
