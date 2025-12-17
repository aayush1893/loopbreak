import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getAllReceipts, downloadCSV, downloadJSON } from '@/lib/db';
import { calculateStats } from '@/lib/stats';
import { formatTime } from '@/lib/timer';
import { Sparkline } from '@/components/Sparkline';
import { Play, FileDown, TrendingDown, TrendingUp, Minus, BookOpen } from 'lucide-react';
import type { ResetSession } from '@/types/calm-receipt';

export default function Home() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ResetSession[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof calculateStats> | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const all = await getAllReceipts();
      setSessions(all);
      setStats(calculateStats(all));
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleExportCSV = () => {
    downloadCSV(sessions);
  };

  const handleExportJSON = () => {
    downloadJSON(sessions);
  };

  const renderTrendIcon = () => {
    if (!stats || stats.percentChange === null) return <Minus className="h-4 w-4" />;
    if (stats.percentChange < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <TrendingUp className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 container mx-auto max-w-2xl px-4 py-8 space-y-6">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">LoopBreak</h1>
          <p className="text-sm text-muted-foreground">Train your time-to-calm</p>
        </header>

        {/* Metric Tiles */}
        <section aria-label="Statistics" className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">Last tₘ</div>
            <div className="text-2xl font-bold tabular-nums">
              {stats?.lastTm ? formatTime(stats.lastTm * 1000) : '—'}
            </div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">7-day median</div>
            <div className="text-2xl font-bold tabular-nums">
              {stats?.medianTm7d ? formatTime(stats.medianTm7d * 1000) : '—'}
            </div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
              {renderTrendIcon()}
              <span>Change</span>
            </div>
            <div className="text-2xl font-bold tabular-nums">
              {stats && stats.percentChange !== null 
                ? `${stats.percentChange > 0 ? '+' : ''}${stats.percentChange.toFixed(0)}%`
                : '—'}
            </div>
          </Card>
        </section>

        {/* Sparkline */}
        {stats && stats.sparklineData.length > 0 && (
          <Card className="p-4">
            <div className="text-xs text-muted-foreground mb-3">Last 14 sessions</div>
            <Sparkline data={stats.sparklineData} width={300} height={60} className="w-full" />
          </Card>
        )}

        {/* Secondary Stat */}
        {stats && stats.percentUnder3min !== null && (
          <div className="text-center text-sm text-muted-foreground">
            {stats.percentUnder3min.toFixed(0)}% of episodes &lt; 3:00 in last 7 days
          </div>
        )}

        {/* Primary CTA */}
        <Button 
          size="xl" 
          className="w-full h-20 text-xl shadow-lg hover:shadow-xl transition-shadow" 
          onClick={() => navigate('/reset')}
          aria-label="Start a reset session"
        >
          <Play className="mr-3 h-7 w-7" aria-hidden="true" />
          Start Reset
        </Button>

        {/* Tutorial Button */}
        <Button 
          size="lg" 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate('/tutorial')}
          aria-label="Learn how to use LoopBreak"
        >
          <BookOpen className="mr-2 h-5 w-5" aria-hidden="true" />
          How to Use LoopBreak
        </Button>

        {/* Export */}
        <div className="grid grid-cols-2 gap-3">
          <Button size="sm" variant="outline" onClick={handleExportCSV} aria-label="Export data as CSV">
            <FileDown className="mr-2 h-4 w-4" aria-hidden="true" />
            Export CSV
          </Button>
          <Button size="sm" variant="outline" onClick={handleExportJSON} aria-label="Export data as JSON">
            <FileDown className="mr-2 h-4 w-4" aria-hidden="true" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-4 px-4 text-center">
        <p className="text-xs text-muted-foreground">
          Offline • No account • Data stays on this device • Wellness tool (not medical advice)
        </p>
      </footer>
    </div>
  );
}