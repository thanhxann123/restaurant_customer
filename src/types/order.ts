import type { TableInfo } from './table';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
export type OrderItemStatus = 'WAITING' | 'COOKING' | 'READY' | 'DONE' | 'CANCELLED';

export interface OrderItemResponse {
  id: number;
  menuName: string;
  imageUrl?: string;
  quantity: number;
  price: number;
  discountPrice?: number;
  status: OrderItemStatus;
  note?: string;
  amount: number;
}

export interface OrderResponse {
  id: number;
  orderCode: string;
  table: TableInfo;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface CreateOrderRequest {
  tableId: number;
  items: {
    menuId: number;
    quantity: number;
    note?: string;
  }[];
  note?: string;
}