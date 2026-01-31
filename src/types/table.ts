import type { Status } from './common';

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING' | 'MAINTENANCE';

export interface TableInfo {
  id: number;
  name: string;
  area?: string;
  status?: Status;
  currentStatus?: TableStatus;
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

  // --- CÁC TRƯỜNG MỚI ĐÃ THÊM ---
  paymentQrCode: string | null;
  lastOrderUpdate: number;
  lastMenuUpdate: number; // --- MỚI: Signal cập nhật menu ---


  requestOpenTable: (id: number) => Promise<void>;
  joinTable: (id: number) => void;

  // --- HÀM MỚI ---
  clearPaymentState: () => void;
}