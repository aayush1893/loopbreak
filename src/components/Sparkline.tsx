import { useMemo } from 'react';

interface SparklineProps {
  data: number[]; // Array of tm_seconds values
  width?: number;
  height?: number;
  className?: string;
}

export function Sparkline({ data, width = 200, height = 40, className = '' }: SparklineProps) {
  const { points, max, min } = useMemo(() => {
    if (data.length === 0) return { points: '', max: 0, min: 0 };
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
      })
      .join(' ');
    
    return { points, max, min };
  }, [data, width, height]);

  if (data.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-xs text-muted-foreground">No data yet</span>
      </div>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        points={points}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / (max - min || 1)) * height;
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="2"
            fill="hsl(var(--primary))"
          >
            <title>{Math.floor(value / 60)}:{(value % 60).toString().padStart(2, '0')}</title>
          </circle>
        );
      })}
    </svg>
  );
}
