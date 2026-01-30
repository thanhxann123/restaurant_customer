import axiosClient from '../utils/axiosClient';
import { API_ENDPOINTS } from '../constants/api';
import type { CreateOrderRequest, OrderResponse } from '../types';

export const orderService = {
  // Tạo đơn hàng mới
  createOrder: async (data: CreateOrderRequest): Promise<OrderResponse> => {
    return axiosClient.post(API_ENDPOINTS.ORDERS.CREATE, data);
  },

  // Lấy chi tiết đơn hàng
  getOrderStatus: async (orderId: number): Promise<OrderResponse> => {
    return axiosClient.get(API_ENDPOINTS.ORDERS.DETAIL(orderId));
  },

  // Lấy danh sách đơn hàng của bàn
  getMyOrders: async (): Promise<OrderResponse[]> => {
    return axiosClient.get(API_ENDPOINTS.ORDERS.HISTORY);
  },

  // Thêm món vào đơn hàng có sẵn
  addOrderItem: async (orderId: number, data: { menuId: number; quantity: number; note?: string }): Promise<OrderResponse> => {
    return axiosClient.post(API_ENDPOINTS.ORDERS.ADD_ITEMS(orderId), data);
  },

  // --- THÊM MỚI: Hủy món ăn ---
  // Gọi API: PATCH /api/orders/items/{itemId}/status?status=CANCELLED
  cancelOrderItem: async (itemId: number): Promise<void> => {
    return axiosClient.patch(`/orders/items/${itemId}/status`, null, {
      params: { status: 'CANCELLED' }
    });
  }
};