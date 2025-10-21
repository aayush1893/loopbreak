import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { promptInstall } from '@/lib/pwa';
import { getAllReceipts } from '@/lib/db';
import { formatTime } from '@/lib/timer';
import { PRIVACY_MESSAGE } from '@/lib/constants';
import { Play, BarChart3, Download, Lock, TrendingDown } from 'lucide-react';
import type { ResetSession } from '@/types/calm-receipt';

export default function Home() {
  const navigate = useNavigate();
  const [canInstall, setCanInstall] = useState(false);
  const [recentSessions, setRecentSessions] = useState<ResetSession[]>([]);
  const [avgTm, setAvgTm] = useState<number | null>(null);

  useEffect(() => {
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    const handler = () => setCanInstall(true);
    window.addEventListener('beforeinstallprompt', handler);
    if (!isInstalled) setCanInstall(true);
    loadRecentSessions();
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const loadRecentSessions = async () => {
    try {
      const all = await getAllReceipts();
      const calmerSessions = all.filter(s => s.feltCalmer).slice(-7);
      setRecentSessions(calmerSessions);
      if (calmerSessions.length > 0) {
        const avg = calmerSessions.reduce((sum, s) => sum + s.tmSec, 0) / calmerSessions.length;
        setAvgTm(Math.round(avg));
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) setCanInstall(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-12 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Thought Reset Timer</h1>
          <p className="text-lg text-muted-foreground">Measure and reduce your rumination time (tₘ)</p>
        </div>

        {avgTm !== null && (
          <div className="rounded-lg border bg-card p-6 shadow-sm text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <TrendingDown className="h-4 w-4" />
              <span>Your average reset time</span>
            </div>
            <div className="text-5xl font-bold text-primary tabular-nums">{formatTime(avgTm * 1000)}</div>
            <p className="text-sm text-muted-foreground">Based on last {recentSessions.length} reset{recentSessions.length !== 1 ? 's' : ''}</p>
          </div>
        )}

        <Button size="xl" className="w-full h-24 text-2xl shadow-lg hover:shadow-xl transition-shadow" onClick={() => navigate('/reset')}>
          <Play className="mr-3 h-8 w-8" />
          Start Reset
        </Button>

        <p className="text-center text-sm text-muted-foreground italic">90-second guided cycle to interrupt thought loops</p>

        <div className="space-y-3">
          <Button size="lg" variant="outline" className="w-full" onClick={() => navigate('/stats')}>
            <BarChart3 className="mr-3" />
            View Progress
          </Button>
          {canInstall && (
            <Button size="lg" variant="outline" className="w-full" onClick={handleInstall}>
              <Download className="mr-3" />
              Install App
            </Button>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span>{PRIVACY_MESSAGE}</span>
        </div>

        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
          <button onClick={() => navigate('/tutorial')} className="hover:underline">How it works</button>
          <span>•</span>
          <button onClick={() => navigate('/privacy')} className="hover:underline">Privacy</button>
        </div>
      </div>
    </div>
  );
}
