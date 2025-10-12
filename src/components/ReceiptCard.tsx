import { Mountain, Brain, Zap, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRRT } from '@/lib/timer';
import type { CalmReceipt, Lane } from '@/types/calm-receipt';

interface ReceiptCardProps {
  receipt: CalmReceipt;
  onClick: () => void;
}

const LANE_ICONS: Record<Lane, typeof Mountain> = {
  ground: Mountain,
  reframe: Brain,
  act: Zap,
};

const LANE_COLORS: Record<Lane, string> = {
  ground: 'text-lane-ground',
  reframe: 'text-lane-reframe',
  act: 'text-lane-act',
};

const LANE_BG: Record<Lane, string> = {
  ground: 'bg-lane-ground-bg',
  reframe: 'bg-lane-reframe-bg',
  act: 'bg-lane-act-bg',
};

export function ReceiptCard({ receipt, onClick }: ReceiptCardProps) {
  const Icon = LANE_ICONS[receipt.lane];
  const date = new Date(receipt.tsStart);
  const urgeDelta =
    receipt.urgeBefore !== null && receipt.urgeAfter !== null
      ? receipt.urgeBefore - receipt.urgeAfter
      : null;

  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border bg-card p-5 text-left shadow-sm transition-all hover:shadow-md hover:border-primary/50"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`rounded-lg p-2 ${LANE_BG[receipt.lane]}`}>
            <Icon className={`h-5 w-5 ${LANE_COLORS[receipt.lane]}`} />
          </div>
          <div>
            <div className="font-semibold capitalize">{receipt.lane}</div>
            <div className="text-sm text-muted-foreground">
              {date.toLocaleDateString()} • {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold tabular-nums">{formatRRT(receipt.rrtSec)}</div>
          <div className="text-xs text-muted-foreground">RRT</div>
        </div>
      </div>

      {urgeDelta !== null && (
        <div className="flex items-center gap-2 text-sm">
          {urgeDelta > 0 && (
            <>
              <TrendingDown className="h-4 w-4 text-secondary" />
              <span className="text-secondary font-medium">Urge ↓ {urgeDelta}</span>
            </>
          )}
          {urgeDelta < 0 && (
            <>
              <TrendingUp className="h-4 w-4 text-destructive" />
              <span className="text-destructive font-medium">Urge ↑ {Math.abs(urgeDelta)}</span>
            </>
          )}
          {urgeDelta === 0 && (
            <>
              <Minus className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">No change</span>
            </>
          )}
        </div>
      )}

      {receipt.note && (
        <p className="mt-2 text-sm text-muted-foreground italic">
          "{receipt.note}"
        </p>
      )}
    </button>
  );
}
