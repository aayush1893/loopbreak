import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getReceiptsByDateRange } from '@/lib/db';
import { calculateStats, getLast7Days, getToday } from '@/lib/stats';
import { formatRRT } from '@/lib/timer';
import { ArrowLeft, TrendingDown, Clock, Target, Activity } from 'lucide-react';
import type { CalmReceipt } from '@/types/calm-receipt';
import type { Stats as StatsType } from '@/lib/stats';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Stats() {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState<CalmReceipt[]>([]);
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
      setReceipts(data);
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

  if (!stats || receipts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2" />
            Back
          </Button>

          <div className="mt-12 rounded-lg border bg-card p-12 text-center">
            <Activity className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">No stats yet</h2>
            <p className="text-muted-foreground">
              Complete a few loops to see your progress
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const rrtLineData = receipts.map((r, index) => ({
    episode: index + 1,
    rrt: r.rrtSec,
  }));

  const laneBarData = [
    { lane: 'Ground', count: stats.laneCount.ground, median: stats.laneMedianRRT.ground },
    { lane: 'Reframe', count: stats.laneCount.reframe, median: stats.laneMedianRRT.reframe },
    { lane: 'Act', count: stats.laneCount.act, median: stats.laneMedianRRT.act },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-8">
          <ArrowLeft className="mr-2" />
          Back
        </Button>

        <h1 className="mb-8 text-3xl font-bold">Stats (Last 7 Days)</h1>

        {/* KPI Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Median RRT</span>
            </div>
            <div className="text-3xl font-bold">{formatRRT(Math.round(stats.medianRRT))}</div>
          </div>

          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Target className="h-5 w-5" />
              <span className="text-sm">Under 3 min</span>
            </div>
            <div className="text-3xl font-bold">{Math.round(stats.percentUnder180)}%</div>
          </div>

          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <TrendingDown className="h-5 w-5" />
              <span className="text-sm">Avg Urge Drop</span>
            </div>
            <div className="text-3xl font-bold">{stats.avgUrgeDrop.toFixed(1)}</div>
          </div>

          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Activity className="h-5 w-5" />
              <span className="text-sm">Total Episodes</span>
            </div>
            <div className="text-3xl font-bold">{stats.totalReceipts}</div>
          </div>
        </div>

        {/* RRT Line Chart */}
        <div className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">RRT by Episode</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={rrtLineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="episode"
                stroke="hsl(var(--muted-foreground))"
                label={{ value: 'Episode', position: 'insideBottom', offset: -5 }}
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
              />
              <Line
                type="monotone"
                dataKey="rrt"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Lane Bar Chart */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Lane Usage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={laneBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="lane" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="hsl(var(--primary))" name="Count" />
            </BarChart>
          </ResponsiveContainer>

          {/* Lane Effectiveness Table */}
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Median RRT by Lane
            </h3>
            <div className="space-y-2">
              {laneBarData.map((lane) => (
                <div key={lane.lane} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{lane.lane}</span>
                  <span className="tabular-nums">{formatRRT(lane.median)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
