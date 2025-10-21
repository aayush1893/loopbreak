import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { CalmReceipt, ResetSession } from '@/types/calm-receipt';

interface LoopBreakDB extends DBSchema {
  receipts: {
    key: string;
    value: CalmReceipt;
    indexes: {
      'by-timestamp': number;
      'by-lane': string;
    };
  };
}

const DB_NAME = 'loopbreak.v1';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<LoopBreakDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<LoopBreakDB>> {
  if (dbInstance) return dbInstance;

  try {
    dbInstance = await openDB<LoopBreakDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create receipts store
        const receiptStore = db.createObjectStore('receipts', {
          keyPath: 'id',
        });
        receiptStore.createIndex('by-timestamp', 'tsStart');
        receiptStore.createIndex('by-lane', 'lane');
      },
    });
    return dbInstance;
  } catch (error) {
    console.error('Failed to open IndexedDB, falling back to localStorage', error);
    throw error;
  }
}

// Receipt operations
export async function saveReceipt(receipt: CalmReceipt): Promise<void> {
  try {
    const db = await getDB();
    await db.put('receipts', receipt);
  } catch (error) {
    // Fallback to localStorage
    const receipts = getReceiptsFromLocalStorage();
    receipts.push(receipt);
    localStorage.setItem('loopbreak_receipts', JSON.stringify(receipts));
  }
}

export async function getAllReceipts(): Promise<CalmReceipt[]> {
  try {
    const db = await getDB();
    return await db.getAllFromIndex('receipts', 'by-timestamp');
  } catch (error) {
    // Fallback to localStorage
    return getReceiptsFromLocalStorage();
  }
}

export async function getReceipt(id: string): Promise<CalmReceipt | undefined> {
  try {
    const db = await getDB();
    return await db.get('receipts', id);
  } catch (error) {
    const receipts = getReceiptsFromLocalStorage();
    return receipts.find(r => r.id === id);
  }
}

export async function deleteReceipt(id: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete('receipts', id);
  } catch (error) {
    const receipts = getReceiptsFromLocalStorage();
    const filtered = receipts.filter(r => r.id !== id);
    localStorage.setItem('loopbreak_receipts', JSON.stringify(filtered));
  }
}

export async function getReceiptsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<CalmReceipt[]> {
  const allReceipts = await getAllReceipts();
  return allReceipts.filter(
    r => r.tsStart >= startDate.getTime() && r.tsStart <= endDate.getTime()
  );
}

// LocalStorage fallback helpers
function getReceiptsFromLocalStorage(): CalmReceipt[] {
  try {
    const stored = localStorage.getItem('loopbreak_receipts');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return [];
  }
}

// Export data as CSV
export function exportToCSV(sessions: ResetSession[]): string {
  const headers = ['ID', 'Start Time', 'End Time', 'tₘ (sec)', 'Completed Cycle', 'Felt Calmer', 'Note'];
  const rows = sessions.map(r => [
    r.id,
    new Date(r.tsStart).toISOString(),
    new Date(r.tsEnd).toISOString(),
    r.tmSec.toString(),
    r.completedCycle ? 'Yes' : 'No',
    r.feltCalmer ? 'Yes' : 'No',
    r.note ?? ''
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
}

export function downloadCSV(sessions: ResetSession[], filename: string = 'reset-sessions.csv'): void {
  const csv = exportToCSV(sessions);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
