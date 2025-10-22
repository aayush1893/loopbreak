import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { CalmReceipt, ResetSession } from '@/types/calm-receipt';

interface LoopBreakDB extends DBSchema {
  receipts: {
    key: string;
    value: CalmReceipt;
    indexes: {
      'by-timestamp': string;
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
          keyPath: 'session_id',
        });
        receiptStore.createIndex('by-timestamp', 'started_at_iso');
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
    return receipts.find(r => r.session_id === id);
  }
}

export async function deleteReceipt(id: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete('receipts', id);
  } catch (error) {
    const receipts = getReceiptsFromLocalStorage();
    const filtered = receipts.filter(r => r.session_id !== id);
    localStorage.setItem('loopbreak_receipts', JSON.stringify(filtered));
  }
}

export async function getReceiptsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<CalmReceipt[]> {
  const allReceipts = await getAllReceipts();
  return allReceipts.filter(
    r => new Date(r.started_at_iso).getTime() >= startDate.getTime() && 
         new Date(r.started_at_iso).getTime() <= endDate.getTime()
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

// Export data as CSV (CalmReceipt format)
export function exportToCSV(sessions: ResetSession[]): string {
  const headers = [
    'session_id',
    'started_at_iso',
    'finished_at_iso',
    'lane',
    'protocol_seconds',
    'tm_seconds',
    'completed_bool',
    'urge_delta_0to10',
    'tags_json'
  ];
  
  const rows = sessions.map(s => [
    s.session_id,
    s.started_at_iso,
    s.finished_at_iso,
    s.lane,
    s.protocol_seconds.toString(),
    s.tm_seconds !== null ? s.tm_seconds.toString() : '',
    s.completed_bool ? 'true' : 'false',
    s.urge_delta_0to10 !== null ? s.urge_delta_0to10.toString() : '',
    s.tags_json ?? ''
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
}

// Export data as JSON
export function exportToJSON(sessions: ResetSession[]): string {
  return JSON.stringify(sessions, null, 2);
}

export function downloadCSV(sessions: ResetSession[], filename: string = 'calm-receipts.csv'): void {
  const csv = exportToCSV(sessions);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJSON(sessions: ResetSession[], filename: string = 'calm-receipts.json'): void {
  const json = exportToJSON(sessions);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
