import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Database, Download } from 'lucide-react';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2" />
            Back to Home
          </Button>
          
          <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">
            LoopBreak is built privacy-first, with zero tracking and local-only data.
          </p>
        </div>

        {/* Privacy Principles */}
        <div className="space-y-8">
          {/* No Account */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">No Account Required</h2>
            </div>
            <p className="text-muted-foreground">
              LoopBreak doesn't require you to create an account, log in, or provide any personal information.
              Everything works completely anonymously on your device.
            </p>
          </div>

          {/* Local Storage */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <Database className="h-6 w-6 text-secondary" />
              <h2 className="text-xl font-semibold">All Data Stays Local</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Your CalmReceipts, RRT data, and all other information are stored only in your browser using
              IndexedDB (with localStorage fallback). Nothing is sent to any server or cloud service.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
              <li>No cloud sync</li>
              <li>No analytics or tracking</li>
              <li>No third-party services</li>
              <li>No cookies</li>
            </ul>
          </div>

          {/* You Control Your Data */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <Download className="h-6 w-6 text-accent" />
              <h2 className="text-xl font-semibold">You Control Your Data</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              You have complete control over your data. Export it anytime as CSV or PDF, and delete it
              whenever you want.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
              <li>Export all receipts to CSV</li>
              <li>Export individual receipts to PDF or PNG</li>
              <li>Delete receipts individually or reset all data</li>
              <li>Clear browser data to remove everything instantly</li>
            </ul>
          </div>

          {/* Pilot Program */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold">Pilot Program (Optional)</h2>
            <p className="text-muted-foreground">
              If you choose to participate in the pilot program, you'll be directed to an external Google Form.
              This is completely optional and requires you to manually share any data you wish to contribute.
              No data is automatically sent.
            </p>
          </div>

          {/* PWA & Offline */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold">Offline-First & PWA</h2>
            <p className="text-muted-foreground">
              LoopBreak is a Progressive Web App (PWA) that works completely offline after the initial load.
              Your data never leaves your device, even when you're online.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 rounded-lg bg-muted/50 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Questions or concerns?</strong> LoopBreak is MIT licensed and{' '}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:no-underline"
            >
              open source
            </a>
            . You can review the code yourself.
          </p>
        </div>
      </div>
    </div>
  );
}
