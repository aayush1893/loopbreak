import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function SafetyBanner() {
  return (
    <Alert className="mb-6 border-destructive/50 bg-destructive/10">
      <AlertCircle className="h-5 w-5 text-destructive" />
      <AlertDescription className="text-sm">
        <strong>Self-help, not medical care.</strong> If you're at risk, call/text{' '}
        <a href="tel:988" className="font-semibold underline hover:no-underline">
          988
        </a>{' '}
        (US) for immediate support.
      </AlertDescription>
    </Alert>
  );
}
