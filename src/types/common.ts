export type NavTab = "menu" | "cart" | "orders" | "payment" | "settings";

export type Status = 'ACTIVE' | 'INACTIVE' | 'DELETED';

export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// --- Theme Types (Đã thêm vào đây) ---
export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
