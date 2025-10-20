import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, ExternalLink, QrCode, Mountain, Brain, Zap } from 'lucide-react';
import * as constants from '@/lib/constants';
import type { Lane } from '@/types/calm-receipt';

const APP_ORIGIN = window.location.origin;

export default function Pilot() {
  const navigate = useNavigate();
  const [autoOpenForm, setAutoOpenForm] = useState(false);
  const [selectedQR, setSelectedQR] = useState<Lane | null>(null);

  useEffect(() => {
    const v = localStorage.getItem('loopbreak_autoOpenPilot');
    if (v) setAutoOpenForm(v === 'true');
  }, []);

  const handleToggleAutoOpen = (val: boolean) => {
    setAutoOpenForm(val);
    localStorage.setItem('loopbreak_autoOpenPilot', String(val));
  };

  const handleContribute = () => {
    window.open(constants.PILOT_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  const generateQRUrl = (lane: Lane) => {
    return `${APP_ORIGIN}/loop?lane=${lane}`;
  };

  const handlePrintQRs = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-8">
          <ArrowLeft className="mr-2" />
          Back
        </Button>

        <h1 className="mb-4 text-3xl font-bold">Pilot Program</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Help improve LoopBreak by contributing your anonymized data
        </p>

        {/* Contribute Section */}
        <div className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold">Contribute Your Data</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Sharing your experience helps us understand what works best for breaking rumination loops.
            All data shared is voluntary and can be anonymized.
          </p>

          <Button onClick={handleContribute} className="mb-4 w-full sm:w-auto">
            <ExternalLink className="mr-2" />
            Open Contribution Form
          </Button>

          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
            <Switch checked={autoOpenForm} onCheckedChange={handleToggleAutoOpen} />
            <div className="text-sm">
              <div className="font-medium">Auto-open after each receipt</div>
              <div className="text-muted-foreground">
                Automatically open the form after saving a CalmReceipt
              </div>
            </div>
          </div>
        </div>

        {/* QR Micro-Cards Section */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <QrCode className="h-6 w-6" />
            <h2 className="text-xl font-semibold">QR Micro-Cards</h2>
          </div>
          
          <p className="mb-6 text-sm text-muted-foreground">
            Generate QR codes that link directly to a specific lane. Print these cards and place them
            where you need quick access.
          </p>

          <div className="mb-6 space-y-3">
            <Button
              variant="lane-ground"
              className="w-full"
              onClick={() => setSelectedQR('ground')}
            >
              <Mountain className="mr-2" />
              Generate QR: Ground
            </Button>

            <Button
              variant="lane-reframe"
              className="w-full"
              onClick={() => setSelectedQR('reframe')}
            >
              <Brain className="mr-2" />
              Generate QR: Reframe
            </Button>

            <Button
              variant="lane-act"
              className="w-full"
              onClick={() => setSelectedQR('act')}
            >
              <Zap className="mr-2" />
              Generate QR: Act
            </Button>
          </div>

          {/* QR Display */}
          {selectedQR && (
            <div className="rounded-lg border bg-background p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-lg bg-white p-4">
                  <QRCodeSVG
                    value={generateQRUrl(selectedQR)}
                    size={200}
                    level="H"
                    includeMargin
                  />
                </div>
              </div>
              
              <p className="mb-2 text-lg font-semibold capitalize">
                {selectedQR} Lane
              </p>
              <p className="mb-4 text-sm text-muted-foreground">
                {generateQRUrl(selectedQR)}
              </p>

              <Button onClick={handlePrintQRs} variant="outline">
                Print 12-Card Sheet
              </Button>
            </div>
          )}
        </div>

        {/* Print Area - 12-card grid */}
        {selectedQR && (
          <div className="print-area hidden">
            <div className="grid grid-cols-3 gap-12 p-12">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center justify-center border p-6">
                  <QRCodeSVG value={generateQRUrl(selectedQR)} size={140} />
                  <div className="mt-2 text-sm font-medium capitalize">{selectedQR} lane</div>
                  <div className="text-xs text-muted-foreground">{generateQRUrl(selectedQR)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Print Styles */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-area,
            .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            @page {
              size: A4;
              margin: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
