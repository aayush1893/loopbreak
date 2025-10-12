import { useEffect, useState } from 'react';
import { PrecisionTimer, formatTime } from '@/lib/timer';
import { Clock } from 'lucide-react';

interface LoopTimerProps {
  timer: PrecisionTimer;
  className?: string;
}

export function LoopTimer({ timer, className }: LoopTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const unsubscribe = timer.onTick(setElapsed);
    return unsubscribe;
  }, [timer]);

  return (
    <div className={`flex items-center justify-center gap-2 ${className || ''}`}>
      <Clock className="h-5 w-5 text-muted-foreground" />
      <span className="text-2xl font-bold tabular-nums">
        {formatTime(elapsed)}
      </span>
    </div>
  );
}
