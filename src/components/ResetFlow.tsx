import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RESET_STEPS, BREATHING_PATTERN, STEP_DURATION_MS } from '@/lib/constants';
import type { ResetStep } from '@/types/calm-receipt';
import { Check } from 'lucide-react';

interface ResetFlowProps {
  onComplete: () => void;
}

export function ResetFlow({ onComplete }: ResetFlowProps) {
  const steps: ResetStep[] = ['cognitive', 'sensory', 'breathing'];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathProgress, setBreathProgress] = useState(0);

  const currentStepKey = steps[currentStepIndex];
  const currentStep = RESET_STEPS[currentStepKey];
  const isLastStep = currentStepIndex === steps.length - 1;

  // Step timer
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / STEP_DURATION_MS) * 100, 100);
      setStepProgress(progress);

      if (progress >= 100) {
        // Play sound cue (simple beep)
        if (navigator.vibrate) navigator.vibrate(50);
        
        if (isLastStep) {
          clearInterval(interval);
          onComplete();
        } else {
          setCurrentStepIndex(prev => prev + 1);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentStepIndex, isLastStep, onComplete]);

  // Breathing animation timer (only for breathing step)
  useEffect(() => {
    if (currentStepKey !== 'breathing') return;

    const cycle = BREATHING_PATTERN.inhale + BREATHING_PATTERN.hold + BREATHING_PATTERN.exhale;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 0.1;
      const cyclePosition = elapsed % cycle;

      if (cyclePosition < BREATHING_PATTERN.inhale) {
        setBreathPhase('inhale');
        setBreathProgress((cyclePosition / BREATHING_PATTERN.inhale) * 100);
      } else if (cyclePosition < BREATHING_PATTERN.inhale + BREATHING_PATTERN.hold) {
        setBreathPhase('hold');
        setBreathProgress(100);
      } else {
        setBreathPhase('exhale');
        const exhaleElapsed = cyclePosition - BREATHING_PATTERN.inhale - BREATHING_PATTERN.hold;
        setBreathProgress(100 - (exhaleElapsed / BREATHING_PATTERN.exhale) * 100);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentStepKey]);

  return (
    <div className="space-y-8">
      {/* Progress indicator */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStepIndex + 1} of {steps.length}</span>
          <span>{Math.round((currentStepIndex / steps.length) * 100)}% complete</span>
        </div>
        <Progress value={(currentStepIndex / steps.length) * 100} className="h-2" />
      </div>

      {/* Step indicator pills */}
      <div className="flex gap-3 justify-center">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
              index < currentStepIndex
                ? 'bg-primary text-primary-foreground'
                : index === currentStepIndex
                ? 'bg-primary/20 text-primary border-2 border-primary'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {index < currentStepIndex ? (
              <Check className="h-5 w-5" />
            ) : (
              <span className="text-sm font-semibold">{index + 1}</span>
            )}
          </div>
        ))}
      </div>

      {/* Current step content */}
      <div className="rounded-lg border bg-card p-8 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">{currentStep.title}</h2>
          <p className="text-lg text-muted-foreground">{currentStep.instruction}</p>
          <p className="text-sm text-muted-foreground italic">{currentStep.tip}</p>
        </div>

        {/* Breathing animation */}
        {currentStepKey === 'breathing' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            {/* Animated circle */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div
                className="absolute w-full h-full rounded-full bg-primary/10 border-4 border-primary transition-all duration-100"
                style={{
                  transform: `scale(${0.5 + (breathProgress / 100) * 0.5})`,
                  opacity: 0.3 + (breathProgress / 100) * 0.7,
                }}
              />
              <div className="z-10 text-center">
                <div className="text-3xl font-bold capitalize text-primary">
                  {breathPhase}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {breathPhase === 'inhale' && `${BREATHING_PATTERN.inhale}s`}
                  {breathPhase === 'hold' && `${BREATHING_PATTERN.hold}s`}
                  {breathPhase === 'exhale' && `${BREATHING_PATTERN.exhale}s`}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cognitive step helper */}
        {currentStepKey === 'cognitive' && (
          <div className="text-center py-8">
            <div className="text-6xl font-bold text-primary tabular-nums">
              100 → 93 → 86...
            </div>
          </div>
        )}

        {/* Sensory step helper */}
        {currentStepKey === 'sensory' && (
          <div className="grid gap-4 py-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="font-semibold mb-2">👁️ See</div>
              <p className="text-sm text-muted-foreground">3 things (colors, objects, textures)</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <div className="font-semibold mb-2">👂 Hear</div>
              <p className="text-sm text-muted-foreground">3 sounds (near, far, subtle)</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <div className="font-semibold mb-2">🤚 Feel</div>
              <p className="text-sm text-muted-foreground">3 sensations (touch, temperature, pressure)</p>
            </div>
          </div>
        )}

        {/* Step progress bar */}
        <div className="space-y-2">
          <Progress value={stepProgress} className="h-2" />
          <div className="text-center text-sm text-muted-foreground">
            {Math.round((STEP_DURATION_MS - (stepProgress / 100 * STEP_DURATION_MS)) / 1000)}s remaining
          </div>
        </div>
      </div>

      <Button
        size="lg"
        variant="outline"
        className="w-full"
        onClick={onComplete}
      >
        I feel calmer already
      </Button>
    </div>
  );
}
