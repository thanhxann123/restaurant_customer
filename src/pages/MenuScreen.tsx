import { useState } from "react";
import { Header } from "./Header";
import { CategoryFilter } from "./CategoryFilter";
import { DishCard } from "./DishCard";
import { categories, dishes, type Dish } from "../data/menu";
import { motion } from "motion/react";

interface MenuScreenProps {
  onDishClick: (dish: Dish) => void;
  onAddToCart: (dish: Dish) => void;
  onCartClick: () => void;
}

export function MenuScreen({
  onDishClick,
  onAddToCart,
  onCartClick,
}: MenuScreenProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory =
      activeCategory === "all" || dish.category === activeCategory;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] transition-colors duration-300">
      <Header onSearch={setSearchQuery} onCartClick={onCartClick} />

      <div className="pt-32 pb-24">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
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
      </div>
    </div>
  );
}
