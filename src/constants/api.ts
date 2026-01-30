// Định nghĩa đường dẫn gốc API
export const API_BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Đã xóa AUTH vì ứng dụng không có chức năng đăng nhập
  MENUS: {
    // API Public không cần token
    PUBLIC: '/menus/public', 
    DETAIL: (id: number | string) => `/menus/${id}`,
    BY_CATEGORY: (id: number | string) => `/menus/category/${id}`,
    BY_PROMOTION: (id: number | string) => `/menus/promotion/${id}`,
  },
  CATEGORIES: {
    LIST: '/categories',
  },
  ORDERS: {
    CREATE: '/orders',
    DETAIL: (id: number | string) => `/orders/${id}`,
    // Thêm endpoint add items vào đơn hàng có sẵn
    ADD_ITEMS: (id: number | string) => `/orders/${id}/items`,
    // Nếu backend hỗ trợ lấy lịch sử theo token bàn thì giữ lại, không thì có thể bỏ
    HISTORY: '/orders/my-orders', 
  },
  TABLES: {
    INFO: (id: number | string) => `/tables/${id}`,
    // API gửi yêu cầu mở bàn (kết hợp với Socket)
    REQUEST_OPEN: (id: number | string) => `/tables/${id}/request-open`,
    // API xác nhận mở bàn (thường dành cho nhân viên, nhưng nếu customer cần check lại status)
    OPEN: (id: number | string) => `/tables/${id}/open`,
  }
};