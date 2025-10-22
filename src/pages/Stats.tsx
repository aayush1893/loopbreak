import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getAllReceipts, downloadCSV, downloadJSON } from '@/lib/db';
import { calculateStats } from '@/lib/stats';
import { formatTime } from '@/lib/timer';
import { Sparkline } from '@/components/Sparkline';
import { ArrowLeft, FileDown, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import type { ResetSession } from '@/types/calm-receipt';

export default function Stats() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ResetSession[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof calculateStats> | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const allSessions = await getAllReceipts();
      setSessions(allSessions);
      setStats(calculateStats(allSessions));
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleExportCSV = () => {
    downloadCSV(sessions);
  };

  const handleExportJSON = () => {
    downloadJSON(sessions);
  };

  const renderTrendIcon = () => {
    if (!stats?.percentChange) return <Minus className="h-5 w-5" />;
    if (stats.percentChange < 0) return <TrendingDown className="h-5 w-5 text-green-500" />;
    return <TrendingUp className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleExportCSV}>
              <FileDown className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button size="sm" variant="outline" onClick={handleExportJSON}>
              <FileDown className="mr-2 h-4 w-4" />
              JSON
            </Button>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center">Your Progress</h1>

        {stats && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Last tₘ</div>
                <div className="text-3xl font-bold tabular-nums">
                  {stats.lastTm ? formatTime(stats.lastTm * 1000) : '—'}
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">7-day Median tₘ</div>
                <div className="text-3xl font-bold tabular-nums">
                  {stats.medianTm7d ? formatTime(stats.medianTm7d * 1000) : '—'}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  {renderTrendIcon()}
                  <span>% Change vs Prior 7d</span>
                </div>
                <div className="text-3xl font-bold tabular-nums">
                  {stats.percentChange !== null 
                    ? `${stats.percentChange > 0 ? '+' : ''}${stats.percentChange.toFixed(1)}%`
                    : '—'}
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">% Episodes &lt; 3:00 (7d)</div>
                <div className="text-3xl font-bold tabular-nums">
                  {stats.percentUnder3min !== null 
                    ? `${stats.percentUnder3min.toFixed(0)}%`
                    : '—'}
                </div>
              </Card>
            </div>

            {/* Sparkline */}
            {stats.sparklineData.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Last 14 Sessions (tₘ Trend)</h2>
                <Sparkline data={stats.sparklineData} width={500} height={100} className="w-full" />
              </Card>
            )}

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Total Sessions</div>
                <div className="text-3xl font-bold">{stats.totalSessions}</div>
              </Card>

              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Completion Rate</div>
                <div className="text-3xl font-bold">{Math.round(stats.successRate)}%</div>
              </Card>
            </div>

            {/* Recent Sessions */}
            {sessions.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Sessions</h2>
                <div className="space-y-3">
                  {sessions.slice(-10).reverse().map((session) => (
                    <div key={session.session_id} className="flex justify-between items-center border-b pb-2 last:border-0">
                      <div>
                        <div className="text-sm font-medium">
                          {new Date(session.started_at_iso).toLocaleDateString()} at {new Date(session.started_at_iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {session.tags_json && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {JSON.parse(session.tags_json).note}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold tabular-nums">
                          {session.tm_seconds !== null ? formatTime(session.tm_seconds * 1000) : '—'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {session.tm_seconds !== null ? '✓ Calmer' : '○ Still spiraling'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {sessions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No sessions recorded yet.</p>
            <Button className="mt-4" onClick={() => navigate('/reset')}>
              Start your first reset
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
