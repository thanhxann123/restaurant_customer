import { motion } from "motion/react";
import { X, Wallet, QrCode, CreditCard, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";

interface PaymentProps {
  isOpen: boolean;
  tableNumber: string;
  onClose: () => void;
  onComplete: () => void;
}

type PaymentMethod = "cash" | "qr" | "card";

export function Payment({
  isOpen,
  tableNumber,
  onClose,
  onComplete,
}: PaymentProps) {
  const { items, total } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("cash");
  const [isPaying, setIsPaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const tax = total * 0.1;
  const finalTotal = total + tax;

  const paymentMethods = [
    { id: "cash", label: "Tiền mặt tại bàn", icon: Wallet },
    { id: "qr", label: "QR Code (Momo/VNPay)", icon: QrCode },
    { id: "card", label: "Thẻ tín dụng", icon: CreditCard },
  ];

  const handlePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setIsCompleted(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center"
      >
        <div className="text-center text-white px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="mb-6"
          >
            <CheckCircle2 className="w-24 h-24 mx-auto" strokeWidth={2} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold mb-3">Cảm ơn quý khách!</h1>
            <p className="text-xl mb-2">Bill bàn {tableNumber} hoàn thành</p>
            <p className="text-white/80">Hẹn gặp lại quý khách!</p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

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
            Thanh toán
          </h2>
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

        <div className="p-6 pb-32">
          <div className="bg-gradient-to-br from-[#FF6B00] to-[#FF8533] rounded-3xl p-6 text-white mb-6">
            <p className="text-white/80 mb-1">Tổng thanh toán</p>
            <h2 className="text-4xl font-bold mb-3">
              {finalTotal.toLocaleString("vi-VN")}đ
            </h2>
            <p className="text-white/80 text-sm">Bàn số {tableNumber}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-3">
              Chọn phương thức thanh toán
            </h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() =>
                      setSelectedMethod(method.id as PaymentMethod)
                    }
                    className={`
                      w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3
                      ${
                        selectedMethod === method.id
                          ? "border-[#FF6B00] bg-[#FF6B00]/5"
                          : "border-gray-200 dark:border-gray-700"
                      }
                    `}
                  >
                    <div
                      className={`
                      w-12 h-12 rounded-xl flex items-center justify-center
                      ${
                        selectedMethod === method.id
                          ? "bg-[#FF6B00]"
                          : "bg-gray-100 dark:bg-gray-800"
                      }
                    `}
                    >
                      <Icon
                        className={`w-6 h-6 ${selectedMethod === method.id ? "text-white" : "text-gray-600 dark:text-gray-400"}`}
                        strokeWidth={2}
                      />
                    </div>
                    <span
                      className={`font-medium ${selectedMethod === method.id ? "text-[#FF6B00]" : "text-[#0F172A] dark:text-[#F1F5F9]"}`}
                    >
                      {method.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-3">
              Chi tiết hóa đơn
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                    {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Tạm tính
                  </span>
                  <span className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                    {total.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    Thuế VAT (10%)
                  </span>
                  <span className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                    {tax.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-gray-700">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handlePayment}
            disabled={isPaying}
            className="w-full h-16 bg-[#FF6B00] text-white rounded-3xl font-bold text-lg shadow-lg shadow-[#FF6B00]/30 disabled:opacity-50"
          >
            {isPaying ? "Đang xử lý..." : "Thanh toán"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
