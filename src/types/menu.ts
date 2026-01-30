import type { Status } from './common';

export type DiscountType = 'PERCENTAGE' | 'AMOUNT';

// Danh mục món ăn
export interface Category {
  id: number;
  name: string;
  description?: string;
  emoji?: string; // Icon hiển thị
  status: Status;
}

// Thông tin khuyến mãi
export interface PromotionSimple {
  id: number;
  name: string;
  code: string;
  discountType: DiscountType;
  discountPercent?: number;
  discountAmount?: number;
}

// Món ăn hiển thị trên Menu (Đã đổi tên từ Dish -> Menu để khớp với Service/Backend)
export interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string; // URL ảnh từ backend
  
  // Mapping category
  category: { id: number; name: string }[]; 
  
  // Trạng thái & Khuyến mãi
  status: Status;
  available: boolean; 
  promotions?: PromotionSimple[]; 

  // Các cờ hiển thị UI (Optional)
  isPopular?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  ingredients?: string[]; 
}