import { motion } from "motion/react";
import { Plus, Leaf, TrendingUp, Tag } from "lucide-react";
import type { Menu } from "../types";

interface DishCardProps {
  dish: Menu;
  onClick: () => void;
  onAddToCart: () => void;
}

export function DishCard({ dish, onClick, onAddToCart }: DishCardProps) {
  // Logic tính giá giảm (lấy khuyến mãi đầu tiên nếu có)
  const promotion = dish.promotions && dish.promotions.length > 0 ? dish.promotions[0] : null;
  
  let finalPrice = dish.price;
  let hasDiscount = false;

  if (promotion) {
    if (promotion.discountType === 'PERCENTAGE' && promotion.discountPercent) {
      finalPrice = dish.price * (1 - promotion.discountPercent / 100);
      hasDiscount = true;
    } else if (promotion.discountType === 'AMOUNT' && promotion.discountAmount) {
      finalPrice = dish.price - promotion.discountAmount;
      hasDiscount = true;
    }
  }

  // Làm tròn giá (nếu cần)
  finalPrice = Math.round(finalPrice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-[#1E293B] rounded-3xl overflow-hidden shadow-md dark:shadow-none border border-transparent dark:border-gray-700 transition-all duration-300 group"
    >
      <div className="relative" onClick={onClick}>
        <img
          src={dish.imageUrl || "https://via.placeholder.com/300"}
          alt={dish.name}
          className="w-full h-40 object-cover"
          onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/300?text=No+Image")}
        />
        
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {/* Các badge đặc biệt */}
          <div className="flex gap-1">
            {dish.isPopular && (
              <div className="w-8 h-8 bg-[#F59E0B] rounded-full flex items-center justify-center shadow-lg">
                <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
            )}
            {dish.isVegetarian && (
              <div className="w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center shadow-lg">
                <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
            )}
          </div>

          {/* Badge Khuyến mãi */}
          {hasDiscount && (
            <div className="bg-[#EF4444] text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {promotion?.discountType === 'PERCENTAGE' 
                ? `-${promotion.discountPercent}%` 
                : 'SALE'}
            </div>
          )}
        </div>
      </div>

      <div className="p-4" onClick={onClick}>
        <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-1 line-clamp-1 group-hover:text-[#FF6B00] transition-colors">
          {dish.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 min-h-[40px]">
          {dish.description}
        </p>

        <div className="flex items-end justify-between">
          <div>
            {hasDiscount ? (
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 line-through decoration-gray-400">
                  {dish.price.toLocaleString("vi-VN")}đ
                </span>
                <span className="text-xl font-bold text-[#EF4444]">
                  {finalPrice.toLocaleString("vi-VN")}đ
                </span>
              </div>
            ) : (
              <p className="text-xl font-bold text-[#FF6B00]">
                {dish.price.toLocaleString("vi-VN")}đ
              </p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center shadow-lg shadow-[#FF6B00]/30 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}