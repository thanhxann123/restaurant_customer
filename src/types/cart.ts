import type { Menu } from './menu';

export interface CartItem extends Menu {
  cartItemId: string; // Đã sửa từ cartId thành cartItemId để khớp với code logic
  quantity: number;
  notes?: string;
  finalPrice: number;
  options?: {
    name: string;
    price: number;
  }[];
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
}

// Context Type cho Cart
export interface CartContextType {
  items: CartItem[];
  addToCart: (menuItem: Menu, quantity: number, notes?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  totalItems: number;
}