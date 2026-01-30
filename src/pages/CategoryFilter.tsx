import { motion } from 'motion/react';
import type { Category } from "../types";

interface CategoryFilterProps {
  categories: Category[];
  activeCategoryId: number | "ALL"; // Dùng number ID để khớp với backend
  onCategoryChange: (categoryId: number | "ALL") => void;
}

export function CategoryFilter({ categories, activeCategoryId, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="px-4 mb-4 mt-[15px]">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <motion.button
            key="all"
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange("ALL")}
            className={`
              flex-shrink-0 px-4 py-2.5 rounded-2xl font-medium text-sm transition-all duration-300
              ${activeCategoryId === "ALL"
                ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/30'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }
            `}
          >
            Tất cả
        </motion.button>

        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category.id)}
            className={`
              flex-shrink-0 px-4 py-2.5 rounded-2xl font-medium text-sm transition-all duration-300
              ${activeCategoryId === category.id
                ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/30'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }
            `}
          >
            {category.emoji && <span className="mr-1.5">{category.emoji}</span>}
            {category.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}