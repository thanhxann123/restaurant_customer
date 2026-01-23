import { motion } from "motion/react";
import { CheckCircle2, Clock, ChefHat, Package } from "lucide-react";
import { useCart } from "../contexts/CartContext";

interface OrderStatusProps {
  tableNumber: string;
  onOrderMore: () => void;
  onRequestPayment: () => void;
}

type OrderStage = "received" | "preparing" | "ready" | "completed";

export function OrderStatus({
  tableNumber,
  onOrderMore,
  onRequestPayment,
}: OrderStatusProps) {
  const { items } = useCart();

  // Simulate order status - in real app this would come from backend
  const currentStage: OrderStage = "preparing";

  const stages = [
    { id: "received", label: "Đã nhận", icon: CheckCircle2, color: "#10B981" },
    {
      id: "preparing",
      label: "Đang chuẩn bị",
      icon: ChefHat,
      color: "#F59E0B",
    },
    { id: "ready", label: "Sẵn sàng", icon: Package, color: "#3B82F6" },
    {
      id: "completed",
      label: "Hoàn thành",
      icon: CheckCircle2,
      color: "#10B981",
    },
  ];

  const getStageIndex = (stage: OrderStage) =>
    stages.findIndex((s) => s.id === stage);
  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] pt-4 pb-24 px-4 transition-colors duration-300">
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 mb-4 shadow-md dark:shadow-none border border-transparent dark:border-gray-700">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B00] to-[#FF8533] rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-1">
              Đơn hàng của bạn
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Bàn {tableNumber}
            </p>
          </div>

          <div className="relative">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={stage.id} className="relative">
                  {index < stages.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200 dark:bg-gray-700">
                      {isActive && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "100%" }}
                          transition={{ duration: 0.5, delay: index * 0.2 }}
                          className="w-full bg-[#FF6B00]"
                        />
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center z-10
                        ${
                          isActive
                            ? "bg-[#FF6B00] shadow-lg shadow-[#FF6B00]/30"
                            : "bg-gray-200 dark:bg-gray-700"
                        }
                      `}
                    >
                      <Icon
                        className={`w-6 h-6 ${isActive ? "text-white" : "text-gray-400"}`}
                        strokeWidth={2}
                      />
                    </motion.div>

                    <div className="flex-1">
                      <p
                        className={`
                        font-bold
                        ${isActive ? "text-[#0F172A] dark:text-[#F1F5F9]" : "text-gray-400"}
                      `}
                      >
                        {stage.label}
                      </p>
                      {isCurrent && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-[#FF6B00]"
                        >
                          Đang xử lý...
                        </motion.p>
                      )}
                    </div>

                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.2 + 0.1 }}
                      >
                        <CheckCircle2
                          className="w-6 h-6 text-[#10B981]"
                          strokeWidth={2.5}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 shadow-md dark:shadow-none border border-transparent dark:border-gray-700">
          <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-4">
            Chi tiết đơn hàng
          </h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    x{item.quantity}
                  </p>
                </div>
                <p className="font-bold text-[#FF6B00]">
                  {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-20 left-0 right-0 px-4 space-y-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onOrderMore}
            className="w-full h-14 bg-white dark:bg-[#1E293B] border-2 border-[#FF6B00] text-[#FF6B00] rounded-3xl font-bold"
          >
            Gọi thêm món
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onRequestPayment}
            className="w-full h-14 bg-[#FF6B00] text-white rounded-3xl font-bold shadow-lg shadow-[#FF6B00]/30"
          >
            Yêu cầu thanh toán
          </motion.button>
        </div>
      </div>
    </div>
  );
}
