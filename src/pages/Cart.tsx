import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../contexts/CartContext";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function Cart({ isOpen, onClose, onCheckout }: CartProps) {
  const { items, updateQuantity, removeItem, total } = useCart();

  const tax = total * 0.1;
  const finalTotal = total + tax;

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1E293B] rounded-t-3xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-white dark:bg-[#1E293B] px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag
                  className="w-6 h-6 text-[#FF6B00]"
                  strokeWidth={2}
                />
                <h2 className="font-bold text-lg text-[#0F172A] dark:text-[#F1F5F9]">
                  Giỏ hàng ({items.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
              >
                <X
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                  strokeWidth={2}
                />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="py-20 text-center">
                <ShoppingBag
                  className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-4"
                  strokeWidth={1.5}
                />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Giỏ hàng trống
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  Thêm món ăn để tiếp tục
                </p>
              </div>
            ) : (
              <>
                <div className="p-4 space-y-3 pb-64">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex gap-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-1 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-[#FF6B00] font-bold mb-2">
                          {item.price.toLocaleString("vi-VN")}đ
                        </p>
                        {item.notes && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
                            Ghi chú: {item.notes}
                          </p>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center"
                          >
                            <Minus
                              className="w-4 h-4 text-gray-700 dark:text-gray-300"
                              strokeWidth={2.5}
                            />
                          </button>
                          <span className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9] min-w-[30px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 bg-[#FF6B00] rounded-lg flex items-center justify-center"
                          >
                            <Plus
                              className="w-4 h-4 text-white"
                              strokeWidth={2.5}
                            />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex-shrink-0 w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center"
                      >
                        <Trash2
                          className="w-5 h-5 text-[#EF4444]"
                          strokeWidth={2}
                        />
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Tạm tính
                      </span>
                      <span className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                        {total.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Thuế VAT (10%)
                      </span>
                      <span className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                        {tax.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                        Tổng cộng
                      </span>
                      <span className="font-bold text-xl text-[#FF6B00]">
                        {finalTotal.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={onCheckout}
                    className="w-full h-16 bg-[#FF6B00] text-white rounded-3xl font-bold text-lg shadow-lg shadow-[#FF6B00]/30"
                  >
                    Gửi Đơn
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
