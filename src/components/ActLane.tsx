import { useState, useEffect } from 'react';
import { MICRO_ACTS, LANE_SOFT_TIMER_MS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import type { MicroAct } from '@/types/calm-receipt';

interface ActLaneProps {
  onComplete: () => void;
}

export function ActLane({ onComplete }: ActLaneProps) {
  const [selectedAct, setSelectedAct] = useState<MicroAct | null>(null);
  const [actStarted, setActStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120);

  useEffect(() => {
    if (!actStarted) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [actStarted]);

  const startAct = (act: MicroAct) => {
    setSelectedAct(act);
    setActStarted(true);
    setTimeRemaining(120);
  };

  const resetAct = () => {
    setSelectedAct(null);
    setActStarted(false);
    setTimeRemaining(120);
  };

  const progressPercent = ((120 - timeRemaining) / 120) * 100;

  if (actStarted && selectedAct) {
    const actData = MICRO_ACTS[selectedAct];
    
    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-lane-act-bg p-6 border-2 border-lane-act/20">
          <h2 className="mb-4 text-2xl font-bold text-lane-act">
            {actData.label}
          </h2>

          {/* Timer */}
          <div className="mb-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Time remaining</span>
              <span className="font-semibold tabular-nums">{timeRemaining}s</span>
            </div>
            <div className="h-2 w-full rounded-full bg-progress-bg overflow-hidden">
              <div
                className="h-full bg-lane-act transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Follow these steps:</p>
            {actData.steps.map((step, index) => (
              <div key={index} className="flex items-center gap-3 text-base">
                <Check className="h-5 w-5 shrink-0 text-lane-act" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            onClick={resetAct}
          >
            Try Different Act
          </Button>
          <Button
            size="lg"
            variant="action"
            className="flex-1"
            onClick={onComplete}
          >
            I'm Calm Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-lane-act-bg p-6 border-2 border-lane-act/20">
        <h2 className="mb-6 text-2xl font-bold text-lane-act">
          Do one tiny act (≤2 min)
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(MICRO_ACTS).map(([key, { label }]) => (
            <Button
              key={key}
              variant="outline"
              size="lg"
              onClick={() => startAct(key as MicroAct)}
              className="h-auto py-4 text-base hover:border-lane-act hover:bg-lane-act/10"
            >
              {label}
            </Button>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground italic">
          Pick one action and follow the steps. Small movements can break big loops.
        </p>
      </div>
    </div>
  );
}
