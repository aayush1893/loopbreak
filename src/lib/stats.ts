import type { ResetSession } from '@/types/calm-receipt';

export interface Stats {
  avgTm: number;           // Average time-to-mental-reset (seconds)
  medianTm: number;        // Median tₘ
  totalSessions: number;   // Total reset sessions
  successRate: number;     // % that felt calmer
  completionRate: number;  // % that completed 90s cycle
  trend: number;           // % change from previous period
}

export function calculateStats(sessions: ResetSession[]): Stats {
  if (sessions.length === 0) {
    return {
      avgTm: 0,
      medianTm: 0,
      totalSessions: 0,
      successRate: 0,
      completionRate: 0,
      trend: 0,
    };
  }

  // Filter to successful sessions (felt calmer)
  const calmerSessions = sessions.filter(s => s.feltCalmer);
  const tmValues = calmerSessions.map(s => s.tmSec).sort((a, b) => a - b);

  const avgTm = calmerSessions.length > 0
    ? tmValues.reduce((sum, val) => sum + val, 0) / tmValues.length
    : 0;

  const medianTm = calmerSessions.length > 0 ? getMedian(tmValues) : 0;

  const successRate = (calmerSessions.length / sessions.length) * 100;
  const completedCycle = sessions.filter(s => s.completedCycle).length;
  const completionRate = (completedCycle / sessions.length) * 100;

  // Calculate trend (compare first half vs second half)
  const trend = calculateTrend(calmerSessions);

  return {
    avgTm,
    medianTm,
    totalSessions: sessions.length,
    successRate,
    completionRate,
    trend,
  };
}

function calculateTrend(sessions: ResetSession[]): number {
  if (sessions.length < 4) return 0;

  const midpoint = Math.floor(sessions.length / 2);
  const firstHalf = sessions.slice(0, midpoint);
  const secondHalf = sessions.slice(midpoint);

  const firstAvg = firstHalf.reduce((sum, s) => sum + s.tmSec, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, s) => sum + s.tmSec, 0) / secondHalf.length;

  if (firstAvg === 0) return 0;
  
  // Negative trend is good (less time to reset)
  return ((secondAvg - firstAvg) / firstAvg) * 100;
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
