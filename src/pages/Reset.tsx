import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResetFlow } from '@/components/ResetFlow';
import { PrecisionTimer, formatTime } from '@/lib/timer';
import { saveReceipt } from '@/lib/db';
import { MAX_NOTE_LENGTH } from '@/lib/constants';
import { ArrowLeft, ThumbsUp, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ResetSession } from '@/types/calm-receipt';

export default function Reset() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [phase, setPhase] = useState<'flow' | 'check-in'>('flow');
  const [note, setNote] = useState('');
  
  const timerRef = useRef(new PrecisionTimer());
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Start timer when component mounts
    timerRef.current.start();
    startTimeRef.current = Date.now();

    return () => {
      timerRef.current.stop();
    };
  }, []);

  const handleFlowComplete = () => {
    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(50);
    setPhase('check-in');
  };

  const handleFeelCalmer = async (feltCalmer: boolean) => {
    const endTime = Date.now();
    const tmMs = endTime - startTimeRef.current;
    const tmSec = Math.round(tmMs / 1000);

    const session: ResetSession = {
      id: uuidv4(),
      tsStart: startTimeRef.current,
      tsEnd: endTime,
      tmSec,
      completedCycle: phase === 'check-in', // true if they finished the 90s cycle
      feltCalmer,
      note: note.trim() || undefined,
      version: 1,
    };

    try {
      await saveReceipt(session);
      
      toast({
        title: feltCalmer ? '✨ Reset complete!' : 'Loop interrupted',
        description: `Time to reset: ${formatTime(tmMs)}`,
      });

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: 'Error saving session',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (phase === 'check-in') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-2xl px-4 py-12">
          <div className="rounded-lg border bg-card p-8 shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-center">How do you feel?</h2>
            <p className="text-center text-muted-foreground">
              Your mind has had {formatTime(timerRef.current.getElapsedMs())} to reset
            </p>

            {/* Note */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Quick note? (optional)
              </label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, MAX_NOTE_LENGTH))}
                placeholder="What helped interrupt the loop?"
                maxLength={MAX_NOTE_LENGTH}
                className="h-12 text-base"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {note.length}/{MAX_NOTE_LENGTH}
              </p>
            </div>

            {/* Action buttons */}
            <div className="grid gap-3 pt-4">
              <Button
                size="lg"
                className="w-full"
                onClick={() => handleFeelCalmer(true)}
              >
                <ThumbsUp className="mr-2" />
                I feel calmer
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => handleFeelCalmer(false)}
              >
                <RefreshCw className="mr-2" />
                Still spiraling
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              timerRef.current.stop();
              navigate('/');
            }}
          >
            <ArrowLeft className="mr-2" />
            Cancel
          </Button>

          <div className="text-sm text-muted-foreground">
            Total: {formatTime(timerRef.current.getElapsedMs())}
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Let's interrupt that loop</h1>
          <p className="text-sm text-muted-foreground mt-1">90-second guided reset</p>
        </div>

        <ResetFlow onComplete={handleFlowComplete} />
      </div>
    </div>
  );
}
