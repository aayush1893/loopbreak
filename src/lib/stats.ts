import type { ResetSession } from '@/types/calm-receipt';

export interface Stats {
  lastTm: number | null;          // Most recent non-null tm_seconds
  medianTm7d: number | null;      // 7-day median tₘ
  percentChange: number | null;   // % change vs prior 7 days
  sparklineData: number[];        // Last 14 non-null tm_seconds values
  percentUnder3min: number | null; // % of episodes < 180s in last 7 days
  totalSessions: number;
  successRate: number;
}

export function calculateStats(sessions: ResetSession[]): Stats {
  if (sessions.length === 0) {
    return {
      lastTm: null,
      medianTm7d: null,
      percentChange: null,
      sparklineData: [],
      percentUnder3min: null,
      totalSessions: 0,
      successRate: 0,
    };
  }

  // Get sessions with non-null tm_seconds
  const successfulSessions = sessions.filter(s => s.tm_seconds !== null);
  
  // Last tₘ
  const lastTm = successfulSessions.length > 0 
    ? successfulSessions[successfulSessions.length - 1].tm_seconds 
    : null;

  // Get sessions from last 7 days
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000;
  
  const last7Days = successfulSessions.filter(
    s => new Date(s.started_at_iso).getTime() >= sevenDaysAgo
  );
  const prev7Days = successfulSessions.filter(
    s => {
      const time = new Date(s.started_at_iso).getTime();
      return time >= fourteenDaysAgo && time < sevenDaysAgo;
    }
  );

  // 7-day median tₘ
  const medianTm7d = last7Days.length > 0
    ? getMedian(last7Days.map(s => s.tm_seconds!).sort((a, b) => a - b))
    : null;

  // % change vs prior 7 days
  const medianPrev7d = prev7Days.length > 0
    ? getMedian(prev7Days.map(s => s.tm_seconds!).sort((a, b) => a - b))
    : null;
  
  const percentChange = medianTm7d !== null && medianPrev7d !== null && medianPrev7d > 0
    ? ((medianTm7d - medianPrev7d) / medianPrev7d) * 100
    : null;

  // Sparkline: last 14 non-null tm_seconds
  const sparklineData = successfulSessions
    .slice(-14)
    .map(s => s.tm_seconds!);

  // % of episodes < 3:00 in last 7 days
  const under3min = last7Days.filter(s => s.tm_seconds! < 180).length;
  const percentUnder3min = last7Days.length > 0
    ? (under3min / last7Days.length) * 100
    : null;

  // Success rate (completed sessions)
  const completedSessions = sessions.filter(s => s.completed_bool).length;
  const successRate = sessions.length > 0
    ? (completedSessions / sessions.length) * 100
    : 0;

  return {
    lastTm,
    medianTm7d,
    percentChange,
    sparklineData,
    percentUnder3min,
    totalSessions: sessions.length,
    successRate,
  };
}

function getMedian(sorted: number[]): number {
  if (sorted.length === 0) return 0;
  
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

export function getLast7Days(): Date {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getToday(): Date {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
}
