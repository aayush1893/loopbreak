import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getReceiptsByDateRange } from '@/lib/db';
import { calculateStats, getLast7Days, getToday } from '@/lib/stats';
import { formatTime } from '@/lib/timer';
import { ArrowLeft, TrendingDown, Clock, Target, Activity, CheckCircle } from 'lucide-react';
import type { ResetSession } from '@/types/calm-receipt';
import type { Stats as StatsType } from '@/lib/stats';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function Stats() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ResetSession[]>([]);
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const startDate = getLast7Days();
      const endDate = getToday();
      const data = await getReceiptsByDateRange(startDate, endDate);
      setSessions(data);
      setStats(calculateStats(data));
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading stats...</div>
      </div>
    );
  }

  if (!stats || sessions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2" />
            Back
          </Button>

          <div className="mt-12 rounded-lg border bg-card p-12 text-center">
            <Activity className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">No data yet</h2>
            <p className="text-muted-foreground">
              Complete a few resets to see your progress
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data - only successful resets
  const calmerSessions = sessions.filter(s => s.feltCalmer);
  const tmLineData = calmerSessions.map((s, index) => ({
    session: index + 1,
    tm: s.tmSec,
    label: formatTime(s.tmSec * 1000),
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-8">
          <ArrowLeft className="mr-2" />
          Back
        </Button>

        <h1 className="mb-8 text-3xl font-bold">Your Progress (Last 7 Days)</h1>

        {/* KPI Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Avg Reset Time (tₘ)</span>
            </div>
            <div className="text-3xl font-bold">{formatTime(Math.round(stats.avgTm) * 1000)}</div>
          </div>

          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <TrendingDown className="h-5 w-5" />
              <span className="text-sm">Trend</span>
            </div>
            <div className={`text-3xl font-bold ${stats.trend < 0 ? 'text-green-600' : stats.trend > 0 ? 'text-red-600' : ''}`}>
              {stats.trend > 0 ? '+' : ''}{stats.trend.toFixed(0)}%
            </div>
            {stats.trend < 0 && (
              <p className="text-xs text-green-600 mt-1">Improving! 🎉</p>
            )}
          </div>

          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">Success Rate</span>
            </div>
            <div className="text-3xl font-bold">{Math.round(stats.successRate)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Felt calmer</p>
          </div>

          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Activity className="h-5 w-5" />
              <span className="text-sm">Total Resets</span>
            </div>
            <div className="text-3xl font-bold">{stats.totalSessions}</div>
          </div>
        </div>

        {/* tₘ Line Chart */}
        {tmLineData.length > 0 && (
          <div className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Reset Time (tₘ) Trend</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Lower is better - showing only successful resets
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tmLineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="session"
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: 'Reset Session', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [formatTime(value * 1000), 'Time']}
                />
                <Line
                  type="monotone"
                  dataKey="tm"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Insights */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Insights</h2>
          <div className="space-y-3 text-sm">
            <p>
              ✓ You've completed <strong>{stats.totalSessions}</strong> reset session{stats.totalSessions !== 1 ? 's' : ''} this week
            </p>
            <p>
              ✓ <strong>{Math.round(stats.completionRate)}%</strong> of your sessions completed the full 90-second cycle
            </p>
            {stats.trend < -10 && (
              <p className="text-green-600 font-medium">
                🎉 Great progress! Your reset time has decreased by {Math.abs(Math.round(stats.trend))}% this week
              </p>
            )}
            {stats.successRate > 80 && (
              <p className="text-green-600 font-medium">
                ⭐ Excellent! You're feeling calmer after {Math.round(stats.successRate)}% of your resets
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
