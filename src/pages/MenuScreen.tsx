import { useState, useEffect, useCallback } from "react";
import { Header } from "../layouts/Header";
import { CategoryFilter } from "./CategoryFilter";
import { DishCard } from "./DishCard";
import { motion } from "motion/react";
import { menuService } from "../services/menu.service";
import type { Menu, Category } from "../types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTable } from "../hooks/useTable"; // Import useTable

interface MenuScreenProps {
  onDishClick: (dish: Menu) => void;
  onAddToCart: (dish: Menu) => void;
  onCartClick: () => void;
}

export function MenuScreen({
  onDishClick,
  onAddToCart,
  onCartClick,
}: MenuScreenProps) {
  // Lấy signal update từ Context
  const { lastMenuUpdate } = useTable();

  const [activeCategoryId, setActiveCategoryId] = useState<number | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Tách logic fetch data ra hàm riêng
  const fetchData = useCallback(async (isBackgroundUpdate = false) => {
    try {
      if (!isBackgroundUpdate) setLoading(true);
      
      const [menuData, catData] = await Promise.all([
        menuService.getPublicMenus({ size: 100 }), 
        menuService.getCategories()
      ]);
      
      setMenus(menuData.content);
      setCategories(catData.content);
    } catch (error) {
      console.error("Failed to load menu", error);
      if (!isBackgroundUpdate) toast.error("Không thể tải thực đơn. Vui lòng thử lại.");
    } finally {
      if (!isBackgroundUpdate) setLoading(false);
    }
  }, []);

  // Effect 1: Load lần đầu
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Effect 2: Load lại khi có sự kiện Socket (lastMenuUpdate thay đổi)
  useEffect(() => {
    if (lastMenuUpdate > 0) {
      console.log("Menu update signal received!");
      fetchData(true); // true để không hiện loading spinner làm gián đoạn trải nghiệm
    }
  }, [lastMenuUpdate, fetchData]);

  const filteredDishes = menus.filter((dish) => {
    const matchesCategory =
      activeCategoryId === "ALL" || dish.category.some(c => c.id === activeCategoryId);
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] transition-colors duration-300">
      <Header onSearch={setSearchQuery} onCartClick={onCartClick} />

      <div className="pt-32 pb-24">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
          </div>
        ) : (
          <>
            <CategoryFilter
              categories={categories}
              activeCategoryId={activeCategoryId}
              onCategoryChange={setActiveCategoryId}
            />

            <div className="px-4">
              {filteredDishes.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500 dark:text-gray-400">
                    Không tìm thấy món ăn nào
                  </p>
                </div>
              ) : (
                <motion.div layout className="grid grid-cols-2 gap-4">
                  {filteredDishes.map((dish) => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      onClick={() => onDishClick(dish)}
                      onAddToCart={() => onAddToCart(dish)}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}