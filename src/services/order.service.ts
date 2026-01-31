import axiosClient from '../utils/axiosClient';
import { API_ENDPOINTS } from '../constants/api';
import type { CreateOrderRequest, OrderResponse } from '../types';

export const orderService = {
  // ... (Các hàm cũ giữ nguyên: createOrder, getOrderStatus, getMyOrders, addOrderItem) ...

  createOrder: async (data: CreateOrderRequest): Promise<OrderResponse> => {
    return axiosClient.post(API_ENDPOINTS.ORDERS.CREATE, data);
  },

  getOrderStatus: async (orderId: number): Promise<OrderResponse> => {
    return axiosClient.get(API_ENDPOINTS.ORDERS.DETAIL(orderId));
  },

  getMyOrders: async (): Promise<OrderResponse[]> => {
    return axiosClient.get(API_ENDPOINTS.ORDERS.HISTORY);
  },

  addOrderItem: async (orderId: number, data: { menuId: number; quantity: number; note?: string }): Promise<OrderResponse> => {
    return axiosClient.post(API_ENDPOINTS.ORDERS.ADD_ITEMS(orderId), data);
  },

  cancelOrderItem: async (itemId: number): Promise<void> => {
    return axiosClient.patch(`/orders/items/${itemId}/status`, null, {
      params: { status: 'CANCELLED' }
    });
  },

  // --- MỚI: Gọi nhân viên hỗ trợ ---
  requestAssistance: async (tableId: number): Promise<void> => {
    return axiosClient.post(`/orders/assistance/${tableId}`);
  },

  // --- MỚI: Yêu cầu thanh toán ---
  requestPayment: async (orderId: number, paymentMethod: string): Promise<void> => {
    // API: POST /api/orders/{id}/payment-request?method=...
    return axiosClient.post(`/orders/${orderId}/payment-request`, null, {
      params: { method: paymentMethod }
    });
  }
};