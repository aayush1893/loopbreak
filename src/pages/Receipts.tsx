import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ReceiptCard } from '@/components/ReceiptCard';
import { getAllReceipts, deleteReceipt, downloadCSV } from '@/lib/db';
import { ArrowLeft, Download, Trash2, FileText, Image, FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { CalmReceipt } from '@/types/calm-receipt';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

async function exportReceiptAsPNG(node: HTMLElement, filename = "calm-receipt.png") {
  const canvas = await html2canvas(node, { backgroundColor: null, scale: 2 });
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

async function exportReceiptAsPDF(node: HTMLElement, filename = "calm-receipt.pdf") {
  const canvas = await html2canvas(node, { backgroundColor: "#ffffff", scale: 2 });
  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(w / canvas.width, h / canvas.height);
  pdf.addImage(img, "PNG", (w - canvas.width * ratio) / 2, 40, canvas.width * ratio, canvas.height * ratio);
  pdf.save(filename);
}

export default function Receipts() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [receipts, setReceipts] = useState<CalmReceipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<CalmReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      const data = await getAllReceipts();
      // Sort by most recent first
      const sorted = data.sort((a, b) => b.tsStart - a.tsStart);
      setReceipts(sorted);
    } catch (error) {
      console.error('Error loading receipts:', error);
      toast({
        title: 'Error loading receipts',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReceipt(id);
      await loadReceipts();
      setSelectedReceipt(null);
      toast({
        title: 'Receipt deleted',
      });
    } catch (error) {
      console.error('Error deleting receipt:', error);
      toast({
        title: 'Error deleting receipt',
        variant: 'destructive',
      });
    }
  };

  const handleExportCSV = () => {
    if (receipts.length === 0) {
      toast({
        title: 'No receipts to export',
      });
      return;
    }

    downloadCSV(receipts);
    toast({
      title: 'CSV exported',
      description: `${receipts.length} receipts exported`,
    });
  };

  const handleExportPNG = async () => {
    if (!detailRef.current || !selectedReceipt) return;
    try {
      const filename = `calm-receipt-${new Date(selectedReceipt.tsStart).toISOString().split('T')[0]}.png`;
      await exportReceiptAsPNG(detailRef.current, filename);
      toast({
        title: 'Receipt exported as PNG',
      });
    } catch (error) {
      console.error('Error exporting PNG:', error);
      toast({
        title: 'Error exporting PNG',
        variant: 'destructive',
      });
    }
  };

  const handleExportPDF = async () => {
    if (!detailRef.current || !selectedReceipt) return;
    try {
      const filename = `calm-receipt-${new Date(selectedReceipt.tsStart).toISOString().split('T')[0]}.pdf`;
      await exportReceiptAsPDF(detailRef.current, filename);
      toast({
        title: 'Receipt exported as PDF',
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: 'Error exporting PDF',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading receipts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2" />
            Back
          </Button>

          <Button variant="outline" onClick={handleExportCSV} disabled={receipts.length === 0}>
            <Download className="mr-2" />
            Export CSV
          </Button>
        </div>

        <h1 className="mb-6 text-3xl font-bold">My CalmReceipts</h1>

        {receipts.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">No receipts yet</h2>
            <p className="mb-6 text-muted-foreground">
              Start your first loop to create a CalmReceipt
            </p>
            <Button onClick={() => navigate('/loop')}>Start Loop</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {receipts.map((receipt) => (
              <ReceiptCard
                key={receipt.id}
                receipt={receipt}
                onClick={() => setSelectedReceipt(receipt)}
              />
            ))}
          </div>
        )}

        {/* Receipt Detail Dialog */}
        <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
          <DialogContent className="max-w-lg bg-popover">
            <DialogHeader>
              <DialogTitle>Receipt Detail</DialogTitle>
              <DialogDescription>
                {selectedReceipt &&
                  new Date(selectedReceipt.tsStart).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            {selectedReceipt && (
              <div className="space-y-4">
                <div ref={detailRef} className="rounded-lg bg-muted/50 p-4">
                  <div className="mb-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Lane</div>
                      <div className="font-semibold capitalize">{selectedReceipt.lane}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">RRT</div>
                      <div className="font-semibold">{selectedReceipt.rrtSec}s</div>
                    </div>
                  </div>

                  <div className="mb-3 text-sm">
                    <div className="text-muted-foreground">Episode ID</div>
                    <div className="font-mono text-sm break-all">{selectedReceipt.id}</div>
                  </div>

                  {selectedReceipt.urgeBefore !== null && (
                    <div className="mb-3 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Urge Before</div>
                        <div className="font-semibold">{selectedReceipt.urgeBefore}/10</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Urge After</div>
                        <div className="font-semibold">{selectedReceipt.urgeAfter}/10</div>
                      </div>
                    </div>
                  )}

                  {selectedReceipt.note && (
                    <div className="text-sm">
                      <div className="mb-1 text-muted-foreground">Note</div>
                      <div className="italic">"{selectedReceipt.note}"</div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handleExportPNG}>
                    <Image className="mr-2 h-4 w-4" />
                    Export PNG
                  </Button>
                  <Button variant="outline" onClick={handleExportPDF}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                </div>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleDelete(selectedReceipt.id)}
                >
                  <Trash2 className="mr-2" />
                  Delete Receipt
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
