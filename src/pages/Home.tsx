import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SafetyBanner } from '@/components/SafetyBanner';
import { promptInstall } from '@/lib/pwa';
import { Play, FileText, BarChart3, TestTube2, Download } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    // Listen for install prompt
    const handler = () => setCanInstall(true);
    window.addEventListener('beforeinstallprompt', handler);
    
    if (!isInstalled) {
      setCanInstall(true);
    }
    
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      setCanInstall(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold text-foreground">
            LoopBreak
          </h1>
          <p className="text-lg text-muted-foreground">
            Stop rumination loops in 3 taps
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Track your <strong>RRT</strong> (Rumination Recovery Time)
          </p>
        </div>

        {/* Safety Banner */}
        <SafetyBanner />

        {/* Main Actions */}
        <div className="space-y-4">
          <Button
            size="xl"
            variant="action"
            className="w-full"
            onClick={() => navigate('/loop')}
          >
            <Play className="mr-3" />
            Start Loop
          </Button>

          <Button
            size="lg"
            variant="default"
            className="w-full"
            onClick={() => navigate('/receipts')}
          >
            <FileText className="mr-3" />
            My CalmReceipts
          </Button>

          <Button
            size="lg"
            variant="default"
            className="w-full"
            onClick={() => navigate('/stats')}
          >
            <BarChart3 className="mr-3" />
            Stats
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => navigate('/pilot')}
          >
            <TestTube2 className="mr-3" />
            Pilot Program
          </Button>

          {canInstall && (
            <Button
              size="lg"
              variant="secondary"
              className="w-full"
              onClick={handleInstall}
            >
              <Download className="mr-3" />
              Install App
            </Button>
          )}
        </div>

        {/* Footer Links */}
        <div className="mt-12 flex justify-center gap-6">
          <button
            onClick={() => navigate('/tutorial')}
            className="text-sm text-muted-foreground underline hover:text-foreground"
          >
            How to Use
          </button>
          <button
            onClick={() => navigate('/privacy')}
            className="text-sm text-muted-foreground underline hover:text-foreground"
          >
            Privacy Policy
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-8 rounded-lg bg-muted/50 p-6">
          <h2 className="mb-2 text-lg font-semibold">What is RRT?</h2>
          <p className="text-sm text-muted-foreground">
            Rumination Recovery Time measures how long it takes you to break a rumination loop
            using grounding, reframing, or action techniques. Track your progress and find what works best.
          </p>
        </div>
      </div>
    </div>
  );
}
