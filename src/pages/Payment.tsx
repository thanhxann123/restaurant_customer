import { motion } from "motion/react";
import { X, Wallet, QrCode, CreditCard, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
// import { useCart } from "../hooks/useCart"; // Đã xóa vì không sử dụng total
import { useTable } from "../hooks/useTable";
import { orderService } from "../services/order.service";
import { toast } from "sonner";
import type { OrderResponse } from "../types"; // Import type để fix lỗi any

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
  // Bỏ tableId thừa
  const { paymentQrCode, clearPaymentState } = useTable();
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);

  // Bỏ total từ useCart vì không dùng
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("cash");
  const [isRequesting, setIsRequesting] = useState(false);
  const [isWaitingForConfirm, setIsWaitingForConfirm] = useState(false);

  // Fetch active order ID khi mở popup
  useEffect(() => {
    if (isOpen) {
        const fetchOrder = async () => {
            try {
                const orders = await orderService.getMyOrders();
                
                // Fix lỗi 'Unexpected any': Kiểm tra type an toàn
                let response: OrderResponse[] = [];
                if (Array.isArray(orders)) {
                    response = orders;
                } else if (orders && 'content' in orders) {
                    // Ép kiểu tường minh cho PagedResponse
                    response = (orders as { content: OrderResponse[] }).content;
                }

                const current = response.find(o => 
                    ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.status)
                );
                
                if (current) setActiveOrderId(current.id);
            } catch (error) {
                console.error("Failed to fetch order for payment", error);
            }
        }
        fetchOrder();
    }
  }, [isOpen]);

  const handleRequestPayment = async () => {
    if (!activeOrderId) {
        toast.error("Không tìm thấy đơn hàng cần thanh toán.");
        return;
    }

    setIsRequesting(true);
    try {
      // Gọi API yêu cầu thanh toán
      await orderService.requestPayment(activeOrderId, selectedMethod);
      setIsRequesting(false);
      setIsWaitingForConfirm(true); // Chuyển sang màn hình chờ QR/Xác nhận
    } catch (e) {
      console.error("Payment request failed", e);
      toast.error("Lỗi khi gửi yêu cầu.");
      setIsRequesting(false);
    }
  };

  const handleFinish = () => {
      clearPaymentState(); // Xóa QR lưu trong context
      onComplete();
  };

  if (!isOpen) return null;

  // Màn hình 3: Hiển thị QR Code khi nhân viên đã xác nhận (qua Socket)
  if (paymentQrCode) {
      return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-white dark:bg-[#1E293B] flex flex-col items-center justify-center p-6"
      >
        <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-4">Quét mã để thanh toán</h2>
        <div className="bg-white p-4 rounded-3xl shadow-xl mb-6">
            <img src={paymentQrCode} alt="Payment QR Code" className="w-64 h-64 object-contain" />
        </div>
        <p className="text-gray-500 mb-8 text-center">Vui lòng quét mã trên bằng ứng dụng ngân hàng hoặc ví điện tử.</p>
        
        <button onClick={handleFinish} className="w-full max-w-sm h-14 bg-[#10B981] text-white rounded-3xl font-bold text-lg shadow-lg">
            Tôi đã thanh toán xong
        </button>
      </motion.div>
      )
  }

  // Màn hình 2: Đang chờ nhân viên xác nhận
  if (isWaitingForConfirm) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-[#FF6B00] to-[#FF8533] flex items-center justify-center"
      >
        <div className="text-center text-white px-6">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="mb-6 inline-block">
            <Loader2 className="w-20 h-20 mx-auto" strokeWidth={2} />
          </motion.div>
          <h1 className="text-2xl font-bold mb-3">Đã gửi yêu cầu!</h1>
          <p className="text-xl mb-2">Vui lòng đợi nhân viên xác nhận...</p>
          <p className="text-white/80 text-sm mt-4">Mã QR sẽ xuất hiện ngay sau khi nhân viên xác nhận.</p>
          
          <button onClick={onClose} className="mt-8 text-white/70 hover:text-white underline">
              Đóng và đợi sau
          </button>
        </div>
      </motion.div>
    );
  }

  // Màn hình 1: Chọn phương thức
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
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1E293B] rounded-t-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white dark:bg-[#1E293B] px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="font-bold text-lg text-[#0F172A] dark:text-[#F1F5F9]">Yêu cầu thanh toán</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 pb-32">
          {/* Thông tin bàn */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-6 text-center">
              <p className="text-gray-500">Đang yêu cầu thanh toán cho</p>
              <p className="font-bold text-xl text-[#FF6B00]">{tableNumber}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-3">Chọn phương thức</h3>
            <div className="space-y-3">
              {[
                { id: "cash", label: "Tiền mặt tại quầy", icon: Wallet },
                { id: "qr", label: "Quét mã QR (VietQR)", icon: QrCode },
                { id: "card", label: "Thẻ ATM / Visa", icon: CreditCard },
              ].map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-3
                      ${selectedMethod === method.id ? "border-[#FF6B00] bg-[#FF6B00]/5" : "border-gray-200 dark:border-gray-700"}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedMethod === method.id ? "bg-[#FF6B00]" : "bg-gray-100"}`}>
                      <Icon className={`w-6 h-6 ${selectedMethod === method.id ? "text-white" : "text-gray-600"}`} />
                    </div>
                    <span className={`font-medium ${selectedMethod === method.id ? "text-[#FF6B00]" : "text-[#0F172A] dark:text-[#F1F5F9]"}`}>
                      {method.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#1E293B] border-t">
          <motion.button whileTap={{ scale: 0.98 }} onClick={handleRequestPayment} disabled={isRequesting} className="w-full h-16 bg-[#FF6B00] text-white rounded-3xl font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2">
            {isRequesting ? (<><Loader2 className="animate-spin"/> Đang gửi...</>) : "Gửi yêu cầu"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}