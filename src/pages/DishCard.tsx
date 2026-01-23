import { motion } from "motion/react";
import { Plus, Leaf, TrendingUp } from "lucide-react";
import type { Dish } from "../data/menu";

interface DishCardProps {
  dish: Dish;
  onClick: () => void;
  onAddToCart: () => void;
}

export function DishCard({ dish, onClick, onAddToCart }: DishCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-[#1E293B] rounded-3xl overflow-hidden shadow-md dark:shadow-none border border-transparent dark:border-gray-700 transition-all duration-300"
    >
      <div className="relative" onClick={onClick}>
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-1">
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
      </div>

      <div className="p-4" onClick={onClick}>
        <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-1 line-clamp-1">
          {dish.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {dish.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-[#FF6B00]">
              {dish.price.toLocaleString("vi-VN")}đ
            </p>
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
