import { motion } from "motion/react";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { Menu } from "../types";

interface DishDetailProps {
  dish: Menu;
  onClose: () => void;
  onAddToCart: (quantity: number, notes: string) => void;
}

const quickTags = ["Ít cay", "Không đường", "Nhiều đá", "Ít dầu", "Thêm rau"];

export function DishDetail({ dish, onClose, onAddToCart }: DishDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleAddToCart = () => {
    const finalNotes = [...selectedTags, notes.trim() && notes]
      .filter(Boolean)
      .join(", ");
    onAddToCart(quantity, finalNotes);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1E293B] rounded-t-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white dark:bg-[#1E293B] px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="font-bold text-lg text-[#0F172A] dark:text-[#F1F5F9]">
            Chi tiết món ăn
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" strokeWidth={2} />
          </button>
        </div>

        <div className="relative">
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="w-full h-64 object-cover"
          />
        </div>

        <div className="p-6 pb-32">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">
                {dish.name}
              </h1>
              <p className="text-3xl font-bold text-[#FF6B00]">
                {dish.price.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {dish.description}
          </p>

          <div className="mb-6">
            <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-3">Tùy chọn nhanh</h3>
            <div className="flex flex-wrap gap-2">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedTags.includes(tag)
                      ? "bg-[#FF6B00] text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-3">Ghi chú thêm</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ví dụ: Không hành, ít muối..."
              className="w-full h-24 p-4 bg-gray-100 dark:bg-gray-800 border-0 rounded-2xl text-[#0F172A] dark:text-[#F1F5F9] resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
            />
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-3">Số lượng</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center"
              >
                <Minus className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
              <span className="text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9] min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-14 h-14 bg-[#FF6B00] rounded-2xl flex items-center justify-center"
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-gray-700">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full h-16 bg-[#FF6B00] text-white rounded-3xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg"
          >
            <ShoppingCart className="w-6 h-6" strokeWidth={2.5} />
            Thêm - {(dish.price * quantity).toLocaleString("vi-VN")}đ
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
