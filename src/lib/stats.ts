import type { CalmReceipt, Lane } from '@/types/calm-receipt';

export interface Stats {
  medianRRT: number;
  percentUnder180: number;
  avgUrgeDrop: number;
  laneCount: Record<Lane, number>;
  totalReceipts: number;
  laneMedianRRT: Record<Lane, number>;
}

export function calculateStats(receipts: CalmReceipt[]): Stats {
  if (receipts.length === 0) {
    return {
      medianRRT: 0,
      percentUnder180: 0,
      avgUrgeDrop: 0,
      laneCount: { ground: 0, reframe: 0, act: 0 },
      totalReceipts: 0,
      laneMedianRRT: { ground: 0, reframe: 0, act: 0 },
    };
  }

  // Sort RRTs for median calculation
  const rrts = receipts.map(r => r.rrtSec).sort((a, b) => a - b);
  const medianRRT = getMedian(rrts);

  // Calculate percent under 180 seconds (3 minutes)
  const under180 = receipts.filter(r => r.rrtSec < 180).length;
  const percentUnder180 = (under180 / receipts.length) * 100;

  // Calculate average urge drop
  const urgeDrops = receipts
    .filter(r => r.urgeBefore !== null && r.urgeAfter !== null)
    .map(r => r.urgeBefore! - r.urgeAfter!);
  const avgUrgeDrop = urgeDrops.length > 0 
    ? urgeDrops.reduce((sum, drop) => sum + drop, 0) / urgeDrops.length 
    : 0;

  // Count by lane
  const laneCount: Record<Lane, number> = { ground: 0, reframe: 0, act: 0 };
  receipts.forEach(r => {
    laneCount[r.lane]++;
  });

  // Calculate median RRT by lane
  const laneMedianRRT: Record<Lane, number> = { ground: 0, reframe: 0, act: 0 };
  (['ground', 'reframe', 'act'] as Lane[]).forEach(lane => {
    const laneRRTs = receipts
      .filter(r => r.lane === lane)
      .map(r => r.rrtSec)
      .sort((a, b) => a - b);
    laneMedianRRT[lane] = laneRRTs.length > 0 ? getMedian(laneRRTs) : 0;
  });

  return {
    medianRRT,
    percentUnder180,
    avgUrgeDrop,
    laneCount,
    totalReceipts: receipts.length,
    laneMedianRRT,
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

export function getLaneMedian(receipts: CalmReceipt[], lane: Lane): number {
  const secs = receipts.filter(r => r.lane === lane).map(r => r.rrtSec).sort((a, b) => a - b);
  if (!secs.length) return Number.POSITIVE_INFINITY;
  const m = Math.floor(secs.length / 2);
  return secs.length % 2 ? secs[m] : Math.round((secs[m - 1] + secs[m]) / 2);
}

export function getBestLane(receipts: CalmReceipt[]): Lane {
  const lanes: Lane[] = ['ground', 'reframe', 'act'];
  return lanes
    .map(l => [l, getLaneMedian(receipts, l)] as const)
    .sort((a, b) => a[1] - b[1])[0][0];
}
