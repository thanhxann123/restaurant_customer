
export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING' | 'MAINTENANCE';

export interface TableInfo {
  id: number;
  name: string;
  area?: string;
}

export interface TableSession {
  tableId: number;
  tableName: string;
  token?: string;
}

// Context Type cho Table
export interface TableContextType {
  tableId: number | null;
  tableName: string | null;
  isWaitingForStaff: boolean;
  isTableOpened: boolean;
  requestOpenTable: (id: number) => Promise<void>;
  joinTable: (id: number) => void;
}