import { AlertCircle } from 'lucide-react';

export function SafetyBanner() {
  return (
    <div className="mb-6 flex gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
      <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
      <p className="text-sm text-foreground">
        <strong>Self-help, not medical care.</strong> If you're at risk, call/text{' '}
        <a href="tel:988" className="font-semibold underline hover:no-underline">
          988
        </a>{' '}
        (US) for immediate support.
      </p>
    </div>
  );
}
