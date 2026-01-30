import axiosClient from '../utils/axiosClient';
import { API_ENDPOINTS } from '../constants/api';
import type { TableInfo } from '../types';

export const tableService = {
  // Lấy thông tin bàn (thường dùng khi quét QR code có chứa ID bàn)
  getTableInfo: async (tableId: number): Promise<TableInfo> => {
    return axiosClient.get(API_ENDPOINTS.TABLES.INFO(tableId));
  },

  // Gửi yêu cầu mở bàn
  requestOpenTable: async (tableId: number): Promise<void> => {
    // Đảm bảo API_ENDPOINTS.TABLES.REQUEST_OPEN đã được định nghĩa trong constants/api.ts
    // Nếu chưa có, hãy thêm: REQUEST_OPEN: (id: number | string) => `/tables/${id}/request-open`
    return axiosClient.post(API_ENDPOINTS.TABLES.REQUEST_OPEN(tableId));
  }
}