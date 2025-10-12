import { useState } from 'react';
import { COGNITIVE_DISTORTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CognitiveDistortion } from '@/types/calm-receipt';

interface ReframeLaneProps {
  onComplete: () => void;
}

export function ReframeLane({ onComplete }: ReframeLaneProps) {
  const [selectedDistortion, setSelectedDistortion] = useState<CognitiveDistortion | null>(null);

  const prompt = selectedDistortion
    ? COGNITIVE_DISTORTIONS[selectedDistortion].prompt
    : null;

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-lane-reframe-bg p-6 border-2 border-lane-reframe/20">
        <h2 className="mb-6 text-2xl font-bold text-lane-reframe">
          Reframe in one line
        </h2>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              What thinking trap are you in?
            </label>
            <Select
              value={selectedDistortion || undefined}
              onValueChange={(value) => setSelectedDistortion(value as CognitiveDistortion)}
            >
              <SelectTrigger className="w-full h-12 text-base bg-background">
                <SelectValue placeholder="Choose a cognitive distortion..." />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {Object.entries(COGNITIVE_DISTORTIONS).map(([key, { label }]) => (
                  <SelectItem 
                    key={key} 
                    value={key}
                    className="text-base cursor-pointer hover:bg-muted"
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {prompt && (
            <div className="rounded-lg bg-background p-5 border-2 border-lane-reframe/30">
              <p className="text-base font-medium text-lane-reframe mb-3">
                Ask yourself:
              </p>
              <p className="text-base text-foreground">
                {prompt}
              </p>
            </div>
          )}
        </div>

        {prompt && (
          <p className="mt-6 text-sm text-muted-foreground italic">
            Take a moment to think through this question. A small shift in perspective can break the loop.
          </p>
        )}
      </div>

      <Button
        size="lg"
        variant="action"
        className="w-full"
        onClick={onComplete}
        disabled={!selectedDistortion}
      >
        {selectedDistortion ? "I'm Calm Now" : 'Pick a distortion first'}
      </Button>
    </div>
  );
}
