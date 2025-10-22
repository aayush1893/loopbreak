export type ResetStep = 'cognitive' | 'sensory' | 'breathing';

export interface ResetSession {
  session_id: string;
  started_at_iso: string;
  finished_at_iso: string;
  protocol_seconds: number;        // Always 90
  tm_seconds: number | null;       // Only if "calmer" was tapped
  completed_bool: boolean;         // True when flow reached end
  lane: string;                    // Default "classic90"
  urge_delta_0to10: number | null; // Optional self-rating
  tags_json: string | null;        // Optional metadata
  app_version: string;
  device_info: string;
}

// Legacy type alias for backwards compatibility
export type CalmReceipt = ResetSession;
