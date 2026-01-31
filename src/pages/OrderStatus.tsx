import { motion } from "motion/react";
import { CheckCircle2, Clock, ChefHat, Package, Trash2, Loader2, BellRing } from "lucide-react"; 
import type { LucideIcon } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { orderService } from "../services/order.service";
import { useTable } from "../hooks/useTable"; // Import useTable
import type { OrderResponse } from "../types";
import { toast } from "sonner";

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
  const { lastOrderUpdate, tableId, tableName } = useTable(); // Lấy signal từ socket
  const [activeOrder, setActiveOrder] = useState<OrderResponse | null>(null);
  const [cancellingItemId, setCancellingItemId] = useState<number | null>(null);
  const [isCallingStaff, setIsCallingStaff] = useState(false);

  const fetchOrderStatus = useCallback(async () => {
    try {
      const response = await orderService.getMyOrders();
      let orders: OrderResponse[] = [];
      
      if (Array.isArray(response)) {
        orders = response;
      } else if (response && 'content' in response) {
        orders = (response as { content: OrderResponse[] }).content;
      }

      const current = orders.find(o => 
        ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.status)
      );
      setActiveOrder(current || null);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  }, []);

  // 1. Fetch lần đầu
  useEffect(() => {
    fetchOrderStatus();
  }, [fetchOrderStatus]);

  // 2. Fetch lại khi có tín hiệu Socket (lastOrderUpdate thay đổi)
  useEffect(() => {
    if (lastOrderUpdate > 0) {
      fetchOrderStatus();
      // Optional: Play sound or toast
    }
  }, [lastOrderUpdate, fetchOrderStatus]);

  // --- Logic gọi nhân viên ---
  const handleCallStaff = async () => {
    if (!tableId) return;
    setIsCallingStaff(true);
    try {
        await orderService.requestAssistance(tableId);
        toast.success("Đã gọi nhân viên! Vui lòng đợi trong giây lát.");
    } catch (e) {
        console.error("Error requesting assistance:", e);
        toast.error("Không thể gọi nhân viên lúc này.");
    } finally {
        // Debounce nút bấm 5s để tránh spam
        setTimeout(() => setIsCallingStaff(false), 5000); 
    }
  };

  // ... (Giữ nguyên logic handleCancelItem, getStageFromStatus, getItemStatusInfo, stages) ...
  const handleCancelItem = async (itemId: number, itemName: string) => {
    if (!confirm(`Bạn có chắc muốn hủy món "${itemName}" không?`)) return;
    setCancellingItemId(itemId);
    try {
      await orderService.cancelOrderItem(itemId);
      toast.success(`Đã hủy món ${itemName}`);
      await fetchOrderStatus();
    } catch (error) {
      console.error("Error cancelling item:", error);
      toast.error("Không thể hủy món này.");
    } finally {
      setCancellingItemId(null);
    }
  };
  
  const getStageFromStatus = (status: string): OrderStage => { /* Giữ nguyên */
    switch(status) {
      case 'PENDING':
      case 'CONFIRMED': return 'received';
      case 'PREPARING': return 'preparing';
      case 'READY': return 'ready';
      case 'COMPLETED': return 'completed';
      default: return 'received';
    }
  };
  const getItemStatusInfo = (status: string) => { /* Giữ nguyên */
    switch (status) {
        case 'WAITING': return { label: 'Đang chờ', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' };
        case 'COOKING': return { label: 'Đang nấu', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' };
        case 'READY': return { label: 'Sẵn sàng', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' };
        case 'DONE': return { label: 'Đã phục vụ', color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' };
        case 'CANCELLED': return { label: 'Đã hủy', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' };
        default: return { label: status, color: 'bg-gray-100 text-gray-600' };
    }
  };
  const currentStage = activeOrder ? getStageFromStatus(activeOrder.status) : 'received';
  const stages: { id: OrderStage; label: string; icon: LucideIcon; color: string }[] = [
    { id: "received", label: "Đã nhận", icon: CheckCircle2, color: "#10B981" },
    { id: "preparing", label: "Đang chuẩn bị", icon: ChefHat, color: "#F59E0B" },
    { id: "ready", label: "Sẵn sàng", icon: Package, color: "#3B82F6" },
    { id: "completed", label: "Hoàn thành", icon: CheckCircle2, color: "#10B981" },
  ];
  const getStageIndex = (stage: OrderStage) => stages.findIndex((s) => s.id === stage);
  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] pt-4 pb-64 px-4 transition-colors duration-300">
      <div className="max-w-md mx-auto">
        
        {/* Nút Gọi nhân viên nhanh */}
        <div className="flex justify-end mb-4">
            <button 
                onClick={handleCallStaff}
                disabled={isCallingStaff}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-md transition-all ${isCallingStaff ? 'bg-gray-300 text-gray-500' : 'bg-white text-[#FF6B00] hover:bg-orange-50'}`}
            >
                <BellRing className={`w-5 h-5 ${isCallingStaff ? '' : 'animate-bounce'}`} />
                {isCallingStaff ? "Đang gọi..." : "Gọi nhân viên"}
            </button>
        </div>

        {/* ... (Phần Timeline và Chi tiết món ăn GIỮ NGUYÊN như cũ) ... */}
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 mb-4 shadow-md">
          {/* Header Bàn */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B00] to-[#FF8533] rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-1">
              {activeOrder ? `Đơn hàng #${activeOrder.orderCode}` : 'Trạng thái đơn hàng'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {activeOrder?.table?.name || tableName || tableNumber}
            </p>
          </div>
          
          {/* Render Timeline (Code cũ) */}
          <div className="relative">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = index <= currentIndex;
              const isCurrent = index === currentIndex;
              return (
                <div key={stage.id} className="relative">
                  {index < stages.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200 dark:bg-gray-700">
                      {isActive && (<motion.div initial={{ height: 0 }} animate={{ height: "100%" }} className="w-full bg-[#FF6B00]" />)}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${isActive ? "bg-[#FF6B00]" : "bg-gray-200 dark:bg-gray-700"}`}>
                      <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-gray-400"}`} strokeWidth={2} />
                    </motion.div>
                    <div className="flex-1">
                      <p className={`font-bold ${isActive ? "text-[#0F172A] dark:text-[#F1F5F9]" : "text-gray-400"}`}>{stage.label}</p>
                      {isCurrent && activeOrder?.status !== 'COMPLETED' && (<p className="text-sm text-[#FF6B00]">Đang xử lý...</p>)}
                    </div>
                    {isActive && <CheckCircle2 className="w-6 h-6 text-[#10B981]" strokeWidth={2.5} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Render List Món (Code cũ) */}
        {activeOrder && (
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 shadow-md mb-4">
             {/* ... (Code render danh sách món GIỮ NGUYÊN) ... */}
             <div className="space-y-4">
              {activeOrder.items.map((item) => {
                const statusInfo = getItemStatusInfo(item.status);
                const canCancel = item.status === 'WAITING';
                const isCancelling = cancellingItemId === item.id;
                return (
                <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                     <img src={item.imageUrl || "https://via.placeholder.com/150"} alt={item.menuName} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=No+Img")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                       <p className="font-bold text-[#0F172A] dark:text-[#F1F5F9] text-sm line-clamp-2">{item.menuName}</p>
                       <p className="font-bold text-[#FF6B00] text-sm ml-2 whitespace-nowrap">{item.amount.toLocaleString("vi-VN")}đ</p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                       <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">x{item.quantity}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${statusInfo.color}`}>{statusInfo.label}</span>
                       </div>
                       {canCancel && (
                         <button onClick={() => handleCancelItem(item.id, item.menuName)} disabled={isCancelling} className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-500 hover:bg-red-100 transition-colors">
                           {isCancelling ? (<Loader2 className="w-4 h-4 animate-spin" />) : (<Trash2 className="w-4 h-4" />)}
                         </button>
                       )}
                    </div>
                    {item.note && (<p className="text-xs text-gray-400 mt-1 italic line-clamp-1">Ghi chú: {item.note}</p>)}
                  </div>
                </div>
              )})}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Tổng tiền</span>
                <span className="font-bold text-xl text-[#FF6B00]">{(activeOrder.totalAmount || 0).toLocaleString("vi-VN")}đ</span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="fixed bottom-20 left-0 right-0 px-4 space-y-3 z-10">
          <motion.button whileTap={{ scale: 0.98 }} onClick={onOrderMore} className="w-full h-14 bg-white dark:bg-[#1E293B] border-2 border-[#FF6B00] text-[#FF6B00] rounded-3xl font-bold shadow-sm">
            Gọi thêm món
          </motion.button>
          <motion.button whileTap={{ scale: 0.98 }} onClick={onRequestPayment} className="w-full h-14 bg-[#FF6B00] text-white rounded-3xl font-bold shadow-lg shadow-[#FF6B00]/30">
            Yêu cầu thanh toán
          </motion.button>
        </div>
      </div>
    </div>
  );
}