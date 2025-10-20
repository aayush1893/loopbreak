import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { LoopTimer } from '@/components/LoopTimer';
import { GroundLane } from '@/components/GroundLane';
import { ReframeLane } from '@/components/ReframeLane';
import { ActLane } from '@/components/ActLane';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { PrecisionTimer } from '@/lib/timer';
import { saveReceipt, getAllReceipts } from '@/lib/db';
import { getBestLane } from '@/lib/stats';
import * as constants from '@/lib/constants';
import { ArrowLeft, Mountain, Brain, Zap, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Lane, CalmReceipt } from '@/types/calm-receipt';

export default function Loop() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [started, setStarted] = useState(false);
  const [selectedLane, setSelectedLane] = useState<Lane | null>(null);
  const [showUrgeForm, setShowUrgeForm] = useState(false);
  const [pastReceipts, setPastReceipts] = useState<CalmReceipt[]>([]);
  
  const [urgeBefore, setUrgeBefore] = useState<number | null>(null);
  const [urgeAfter, setUrgeAfter] = useState<number>(5);
  const [note, setNote] = useState('');
  
  const timerRef = useRef(new PrecisionTimer());
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Load past receipts for Auto lane
    getAllReceipts().then(setPastReceipts).catch(console.error);

    // Check for deep link lane parameter
    const laneParam = searchParams.get('lane');
    if (laneParam && ['ground', 'reframe', 'act'].includes(laneParam)) {
      setSelectedLane(laneParam as Lane);
      startTimer();
    }
  }, [searchParams]);

  const startTimer = () => {
    startTimeRef.current = Date.now();
    timerRef.current.start();
    setStarted(true);
  };

  const handleLaneSelect = (lane: Lane) => {
    setSelectedLane(lane);
    if (!started) {
      startTimer();
    }
  };

  const handleCalmNow = () => {
    timerRef.current.stop();
    setShowUrgeForm(true);
  };

  const handleSaveReceipt = async () => {
    if (selectedLane === null || startTimeRef.current === null) return;

    const endTime = Date.now();
    const rrtMs = endTime - startTimeRef.current;
    const rrtSec = Math.round(rrtMs / 1000);

    const receipt: CalmReceipt = {
      id: uuidv4(),
      tsStart: startTimeRef.current,
      tsEnd: endTime,
      lane: selectedLane,
      rrtSec: Math.max(0, rrtSec), // Ensure non-negative
      urgeBefore,
      urgeAfter,
      note: note.trim() || undefined,
      version: 1,
    };

    try {
      await saveReceipt(receipt);
      
      toast({
        title: 'CalmReceipt saved!',
        description: `RRT: ${rrtSec}s • Lane: ${selectedLane}`,
      });

      // Check auto-open pilot form setting
      const auto = localStorage.getItem('loopbreak_autoOpenPilot') === 'true';
      if (auto) {
        window.open(constants.PILOT_FORM_URL, '_blank');
      }

      // Reset and return to home
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Error saving receipt:', error);
      toast({
        title: 'Error saving receipt',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Urge form view
  if (showUrgeForm) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-2xl px-4 py-12">
          <div className="rounded-lg border bg-card p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold">How do you feel?</h2>

            <div className="space-y-6">
              {/* Urge Before */}
              <div>
                <label className="mb-3 block text-sm font-medium">
                  Urge before? (optional)
                </label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={urgeBefore !== null ? [urgeBefore] : [5]}
                    onValueChange={([value]) => setUrgeBefore(value)}
                    min={constants.URGE_MIN}
                    max={constants.URGE_MAX}
                    step={1}
                    className="flex-1"
                  />
                  <span className="w-12 text-center text-lg font-semibold tabular-nums">
                    {urgeBefore !== null ? urgeBefore : '?'}
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>No urge</span>
                  <span>Extreme urge</span>
                </div>
              </div>

              {/* Urge After */}
              <div>
                <label className="mb-3 block text-sm font-medium">
                  Urge now? <span className="text-destructive">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[urgeAfter]}
                    onValueChange={([value]) => setUrgeAfter(value)}
                    min={constants.URGE_MIN}
                    max={constants.URGE_MAX}
                    step={1}
                    className="flex-1"
                  />
                  <span className="w-12 text-center text-lg font-semibold tabular-nums">
                    {urgeAfter}
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>No urge</span>
                  <span>Extreme urge</span>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Add a tiny note? (optional)
                </label>
                  <Input
                    value={note}
                    onChange={(e) => setNote(e.target.value.slice(0, constants.MAX_NOTE_LENGTH))}
                    placeholder="What helped most?"
                    maxLength={constants.MAX_NOTE_LENGTH}
                    className="h-12 text-base"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {note.length}/{constants.MAX_NOTE_LENGTH}
                  </p>
              </div>
            </div>

            <Button
              size="lg"
              variant="action"
              className="mt-8 w-full"
              onClick={handleSaveReceipt}
            >
              Save CalmReceipt
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Lane selection view
  if (!selectedLane) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-2xl px-4 py-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2" />
            Cancel
          </Button>

          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">Choose Your Lane</h1>
            <p className="text-muted-foreground">Pick what feels right, or use Auto</p>
          </div>

          <div className="space-y-4">
            <Button
              size="xl"
              variant="lane-ground"
              className="w-full"
              onClick={() => handleLaneSelect('ground')}
            >
              <Mountain className="mr-3" />
              <div className="text-left">
                <div className="font-bold">Ground</div>
                <div className="text-sm opacity-90">5-4-3-2-1 technique</div>
              </div>
            </Button>

            <Button
              size="xl"
              variant="lane-reframe"
              className="w-full"
              onClick={() => handleLaneSelect('reframe')}
            >
              <Brain className="mr-3" />
              <div className="text-left">
                <div className="font-bold">Reframe</div>
                <div className="text-sm opacity-90">Challenge the thought</div>
              </div>
            </Button>

            <Button
              size="xl"
              variant="lane-act"
              className="w-full"
              onClick={() => handleLaneSelect('act')}
            >
              <Zap className="mr-3" />
              <div className="text-left">
                <div className="font-bold">Act</div>
                <div className="text-sm opacity-90">2-minute micro-action</div>
              </div>
            </Button>

            <Button
              size="xl"
              variant="outline"
              className="w-full"
              onClick={() => handleLaneSelect(getBestLane(pastReceipts))}
              disabled={pastReceipts.length === 0}
            >
              <Sparkles className="mr-3" />
              <div className="text-left">
                <div className="font-bold">Auto</div>
                <div className="text-sm opacity-90">Your fastest lane</div>
              </div>
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground italic">
            Timer starts when you pick a lane
          </p>
        </div>
      </div>
    );
  }

  // Lane activity view
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

          <LoopTimer timer={timerRef.current} />
        </div>

        {selectedLane === 'ground' && <GroundLane onComplete={handleCalmNow} />}
        {selectedLane === 'reframe' && <ReframeLane onComplete={handleCalmNow} />}
        {selectedLane === 'act' && <ActLane onComplete={handleCalmNow} />}
      </div>
    </div>
  );
}
