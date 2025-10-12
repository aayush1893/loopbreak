import { useState } from 'react';
import { Check } from 'lucide-react';
import { GROUNDING_STEPS } from '@/lib/constants';
import { Button } from '@/components/ui/button';

interface GroundLaneProps {
  onComplete: () => void;
}

export function GroundLane({ onComplete }: GroundLaneProps) {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const toggleStep = (id: number) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompleted(newCompleted);
  };

  const allComplete = completed.size === GROUNDING_STEPS.length;

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-lane-ground-bg p-6 border-2 border-lane-ground/20">
        <h2 className="mb-6 text-2xl font-bold text-lane-ground">
          Ground in 60–90s
        </h2>

        <div className="space-y-4">
          {GROUNDING_STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                completed.has(step.id)
                  ? 'border-lane-ground bg-lane-ground/10'
                  : 'border-border bg-background hover:border-lane-ground/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                    completed.has(step.id)
                      ? 'bg-lane-ground text-white'
                      : 'border-2 border-muted-foreground'
                  }`}
                >
                  {completed.has(step.id) ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <span className={`text-base ${completed.has(step.id) ? 'font-medium' : ''}`}>
                  {step.text}
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground italic">
          Tip: Name them softly. If stuck, glance around.
        </p>
      </div>

      <Button
        size="lg"
        variant="action"
        className="w-full"
        onClick={onComplete}
        disabled={!allComplete}
      >
        {allComplete ? "I'm Calm Now" : 'Complete all steps first'}
      </Button>
    </div>
  );
}
