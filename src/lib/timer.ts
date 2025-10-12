export class PrecisionTimer {
  private startTime: number | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private callbacks: Set<(elapsed: number) => void> = new Set();

  start(): void {
    if (this.startTime !== null) return; // Already running
    
    this.startTime = performance.now();
    this.intervalId = setInterval(() => {
      const elapsed = this.getElapsedMs();
      this.callbacks.forEach(cb => cb(elapsed));
    }, 100); // Update every 100ms for smooth display
  }

  stop(): number {
    if (this.startTime === null) return 0;
    
    const elapsed = this.getElapsedMs();
    
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.startTime = null;
    this.callbacks.clear();
    
    return elapsed;
  }

  getElapsedMs(): number {
    if (this.startTime === null) return 0;
    return performance.now() - this.startTime;
  }

  getElapsedSec(): number {
    return Math.round(this.getElapsedMs() / 1000);
  }

  onTick(callback: (elapsed: number) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  isRunning(): boolean {
    return this.startTime !== null;
  }

  reset(): void {
    this.stop();
  }
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${seconds}s`;
}

export function formatRRT(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}
