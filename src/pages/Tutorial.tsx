import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mountain, Brain, Zap } from 'lucide-react';

export default function Tutorial() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2" />
          Back to Home
        </Button>

        <h1 className="mb-8 text-4xl font-bold">How to Use LoopBreak</h1>

        <div className="space-y-8">
          {/* Overview */}
          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">What is LoopBreak?</h2>
            <p className="mb-4 text-muted-foreground">
              LoopBreak helps you break rumination cycles using evidence-based techniques. 
              It measures your <strong>RRT (Rumination Recovery Time)</strong> — how long it 
              takes to calm down after starting a technique.
            </p>
            <p className="text-muted-foreground">
              Choose a lane, follow the guided activity, then track your progress with 
              CalmReceipts you can review later.
            </p>
          </Card>

          {/* Ground Lane */}
          <Card className="border-l-4 border-lane-ground p-6">
            <div className="mb-4 flex items-center gap-3">
              <Mountain className="h-8 w-8 text-lane-ground" />
              <h2 className="text-2xl font-semibold">Ground Lane</h2>
            </div>
            <p className="mb-4 text-muted-foreground">
              Uses the <strong>5-4-3-2-1 sensory technique</strong> to anchor you in the present moment.
            </p>
            <div className="space-y-2">
              <p className="font-medium">How to use:</p>
              <ol className="list-inside list-decimal space-y-1 text-muted-foreground">
                <li>Notice 5 things you can see around you</li>
                <li>Feel 4 things you can touch (clothing, chair, etc.)</li>
                <li>Listen for 3 things you can hear</li>
                <li>Notice 2 things you can smell (or like to smell)</li>
                <li>Take 1 slow breath (4 in, 4 hold, 6 out)</li>
              </ol>
              <p className="mt-3 text-sm italic text-muted-foreground">
                <strong>Best for:</strong> When you're feeling disconnected, anxious, or overwhelmed
              </p>
            </div>
          </Card>

          {/* Reframe Lane */}
          <Card className="border-l-4 border-lane-reframe p-6">
            <div className="mb-4 flex items-center gap-3">
              <Brain className="h-8 w-8 text-lane-reframe" />
              <h2 className="text-2xl font-semibold">Reframe Lane</h2>
            </div>
            <p className="mb-4 text-muted-foreground">
              Challenges <strong>cognitive distortions</strong> — unhelpful thinking patterns that 
              make situations feel worse than they are.
            </p>
            <div className="space-y-2">
              <p className="font-medium">How to use:</p>
              <ol className="list-inside list-decimal space-y-1 text-muted-foreground">
                <li>Pick the thinking pattern that matches your rumination</li>
                <li>Read the helpful prompt provided</li>
                <li>Write a one-line counterthought</li>
                <li>Repeat it to yourself</li>
              </ol>
              <p className="mt-3 text-sm italic text-muted-foreground">
                <strong>Best for:</strong> Negative thought spirals, worst-case scenarios, self-criticism
              </p>
            </div>
          </Card>

          {/* Act Lane */}
          <Card className="border-l-4 border-lane-act p-6">
            <div className="mb-4 flex items-center gap-3">
              <Zap className="h-8 w-8 text-lane-act" />
              <h2 className="text-2xl font-semibold">Act Lane</h2>
            </div>
            <p className="mb-4 text-muted-foreground">
              Uses <strong>2-minute micro-actions</strong> to interrupt the rumination cycle 
              with gentle physical movement.
            </p>
            <div className="space-y-2">
              <p className="font-medium">How to use:</p>
              <ol className="list-inside list-decimal space-y-1 text-muted-foreground">
                <li>Choose a simple action (sip water, walk to sink, etc.)</li>
                <li>Follow the 3-step instructions provided</li>
                <li>Focus fully on the action — notice details</li>
                <li>Complete the 2-minute timer</li>
              </ol>
              <p className="mt-3 text-sm italic text-muted-foreground">
                <strong>Best for:</strong> When you need to break a mental loop with movement or physical grounding
              </p>
            </div>
          </Card>

          {/* Tips */}
          <Card className="bg-muted p-6">
            <h2 className="mb-4 text-2xl font-semibold">Pro Tips</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ Don't overthink which lane to pick — trust your gut</li>
              <li>✓ You can switch lanes if one isn't working</li>
              <li>✓ Track your urge levels to see what works best for you</li>
              <li>✓ Review your CalmReceipts weekly to spot patterns</li>
              <li>✓ Share your stats with a therapist or support person</li>
            </ul>
          </Card>

          <div className="flex justify-center pt-6">
            <Button
              size="lg"
              variant="action"
              onClick={() => navigate('/loop')}
            >
              Try Your First Loop
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
