import axiosClient from '../utils/axiosClient';
import { API_ENDPOINTS } from '../constants/api';
import type { PagedResponse, Menu, Category } from '../types';

export const menuService = {
  // Lấy menu public, hỗ trợ phân trang, tìm kiếm và lọc theo danh mục
  getPublicMenus: async (params?: { 
    page?: number; 
    size?: number; 
    search?: string; 
    categoryId?: number 
  }): Promise<PagedResponse<Menu>> => {
    return axiosClient.get(API_ENDPOINTS.MENUS.PUBLIC, { params });
  },

  // Lấy chi tiết món ăn
  getMenuDetail: async (id: number): Promise<Menu> => {
    return axiosClient.get(API_ENDPOINTS.MENUS.DETAIL(id));
  },

  // Lấy danh sách tất cả danh mục
  getCategories: async (): Promise<PagedResponse<Category>> => {
    return axiosClient.get(API_ENDPOINTS.CATEGORIES.LIST);
  },

  // Lấy món ăn theo danh mục cụ thể
  getMenusByCategory: async (categoryId: number, params?: { page?: number; size?: number }): Promise<PagedResponse<Menu>> => {
    return axiosClient.get(API_ENDPOINTS.MENUS.BY_CATEGORY(categoryId), { params });
  },
  
  // Lấy món ăn theo khuyến mãi (nếu có logic này)
  getMenusByPromotion: async (promotionId: number, params?: { page?: number; size?: number }): Promise<PagedResponse<Menu>> => {
    return axiosClient.get(API_ENDPOINTS.MENUS.BY_PROMOTION(promotionId), { params });
  }
};