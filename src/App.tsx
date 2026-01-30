import { useState, useEffect, Suspense, lazy } from "react";
import { AnimatePresence } from "motion/react";
import { toast, Toaster } from "sonner";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
// import { TableProvider } from "./contexts/TableContext"; // Chuyển sang lazy import
import { useCart } from "./hooks/useCart";
import { useTable } from "./hooks/useTable";
import { orderService } from "./services/order.service";

// Pages & Layouts
import { WelcomeScreen } from "./pages/WelcomeScreen";
import { MenuScreen } from "./pages/MenuScreen";
import { DishDetail } from "./pages/DishDetail";
import { Cart } from "./pages/Cart";
import { OrderStatus } from "./pages/OrderStatus";
import { Payment } from "./pages/Payment";
import { BottomNav } from "./layouts/BottomNav";
import { SettingsScreen } from "./pages/SettingsScreen";
import { Loader2 } from "lucide-react";

// Types
import type { NavTab, Menu, OrderResponse } from "./types";

// --- FIX: Polyfill cho sockjs-client ---
if (typeof window !== "undefined") {
  const win = window as unknown as { global: Window };
  if (!win.global) {
    win.global = window;
  }
}

// Lazy load TableProvider
const TableProvider = lazy(() => 
  import("./contexts/TableContext").then((module) => ({
    default: module.TableProvider,
  }))
);

function AppContent() {
  // --- KHÔI PHỤC LOGIC LẤY ID BÀN TỪ URL (HỖ TRỢ CẢ HASH & PATH) ---
  const getTableId = () => {
    // 1. Thử lấy từ path /table/2
    const pathMatch = window.location.pathname.match(/\/table\/(\d+)/);
    if (pathMatch && pathMatch[1]) {
      return parseInt(pathMatch[1], 10);
    }

    // 2. Thử lấy từ hash #/table/2 (nếu dùng HashRouter)
    const hashMatch = window.location.hash.match(/\/table\/(\d+)/);
    if (hashMatch && hashMatch[1]) {
      return parseInt(hashMatch[1], 10);
    }

    // 3. Thử lấy từ query param ?tableId=2
    const queryParams = new URLSearchParams(window.location.search);
    const paramId = queryParams.get("tableId");
    if (paramId) {
      return parseInt(paramId, 10);
    }

    // 4. Mặc định bàn 1 (Fallback nếu không tìm thấy ID nào)
    return 1; 
  };

  const tableId = getTableId();

  const { isTableOpened, tableName, joinTable } = useTable();
  const { addToCart, clearCart } = useCart();

  const [activeTab, setActiveTab] = useState<NavTab>("menu");
  const [selectedDish, setSelectedDish] = useState<Menu | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  
  // State xác định đã có đơn hàng hay chưa
  const [hasOrdered, setHasOrdered] = useState(false);

  // --- SỬA: Init Table với logic bảo vệ session ---
  useEffect(() => {
    const storedTableId = localStorage.getItem("current-table-id");
    const hasToken = localStorage.getItem("table-session-token");

    // Nếu đã có token và ID bàn trong storage
    if (hasToken && storedTableId) {
      const savedId = parseInt(storedTableId, 10);
      
      // Nếu ID trên URL KHÁC với ID đang có session -> Ép về ID cũ
      if (tableId !== savedId) {
        // 1. Sửa lại URL mà không reload trang
        const correctPath = `/table/${savedId}`;
        window.history.replaceState(null, '', correctPath);
        
        // 2. Join vào bàn đúng (bàn cũ)
        joinTable(savedId);
        
        // 3. Thông báo cho người dùng
        toast.warning(`Bạn đang có phiên hoạt động tại Bàn ${savedId}`, {
          description: "Hệ thống đã tự động đưa bạn về đúng bàn.",
          duration: 4000,
        });
        return;
      }
    }

    // Trường hợp bình thường hoặc chưa có session
    if (tableId) {
      joinTable(tableId);
    }
  }, [tableId, joinTable]);

  // Kiểm tra đơn hàng cũ khi load trang
  useEffect(() => {
    const checkActiveOrder = async () => {
      if (!isTableOpened) return;

      try {
        const response = await orderService.getMyOrders();
        
        let orders: OrderResponse[] = [];
        if (Array.isArray(response)) {
          orders = response;
        } else if (response && 'content' in response) {
          orders = (response as { content: OrderResponse[] }).content;
        }

        const activeOrder = orders.find(o => 
          ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.status)
        );

        if (activeOrder) {
          setHasOrdered(true);
        }
      } catch (error) {
        console.error("Failed to check active orders", error);
      }
    };

    checkActiveOrder();
  }, [isTableOpened]);

  useEffect(() => {
    if (selectedDish || showCart || showPayment) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedDish, showCart, showPayment]);

  const handleAddToCart = (
    dish: Menu,
    quantity: number = 1,
    notes: string = "",
  ) => {
    addToCart(dish, quantity, notes);
    toast.success("Đã thêm vào giỏ hàng!", {
      duration: 2000,
      position: "top-center",
    });
    setSelectedDish(null);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setHasOrdered(true);
    setActiveTab("orders");

    toast.success("Đơn đã gửi!", {
      description: "Đơn hàng của bạn đang được chuẩn bị",
      duration: 3000,
      position: "top-center",
    });
  };

  const handleOrderMore = () => {
    setActiveTab("menu");
  };

  const handleRequestPayment = () => {
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    setShowPayment(false);
    clearCart();
    setHasOrdered(false);
    setActiveTab("menu");

    toast.success("Thanh toán thành công!", {
      description: "Cảm ơn quý khách đã sử dụng dịch vụ",
      duration: 3000,
      position: "top-center",
    });
  };

  const handleTabChange = (tab: NavTab) => {
    if (tab === "cart") {
      setShowCart(true);
    } else if (tab === "payment" && hasOrdered) {
      setShowPayment(true);
    } else {
      setActiveTab(tab);
    }
  };

  // Logic hiển thị tên bàn: Chỉ dùng tên lấy từ API (tableName)
  // Nếu chưa load xong thì hiện "Đang tải..." chứ TUYỆT ĐỐI KHÔNG hiện ID bàn
  const displayTableName = tableName || "Đang tải...";

  if (!isTableOpened) {
    return (
      <WelcomeScreen
        tableNumber={displayTableName}
        tableId={tableId}
        onContinue={() => {}}
      />
    );
  }

  return (
    <div className="relative min-h-screen">
      {activeTab === "menu" && (
        <MenuScreen
          onDishClick={setSelectedDish}
          onAddToCart={(dish) => handleAddToCart(dish, 1)}
          onCartClick={() => setShowCart(true)}
        />
      )}

      {activeTab === "orders" && hasOrdered && (
        <OrderStatus
          tableNumber={displayTableName}
          onOrderMore={handleOrderMore}
          onRequestPayment={handleRequestPayment}
        />
      )}

      {activeTab === "orders" && !hasOrdered && (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex items-center justify-center pb-24 px-4 transition-colors duration-300">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📋</span>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">
              Chưa có đơn hàng
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Hãy thêm món và gửi đơn để theo dõi
            </p>
            <button
              onClick={() => setActiveTab("menu")}
              className="px-6 py-3 bg-[#FF6B00] text-white rounded-2xl font-bold"
            >
              Xem Menu
            </button>
          </div>
        </div>
      )}

      {activeTab === "payment" && !hasOrdered && (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex items-center justify-center pb-24 px-4 transition-colors duration-300">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">💳</span>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">
              Chưa có đơn hàng
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Hãy gọi món trước khi thanh toán
            </p>
            <button
              onClick={() => setActiveTab("menu")}
              className="px-6 py-3 bg-[#FF6B00] text-white rounded-2xl font-bold"
            >
              Xem Menu
            </button>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <SettingsScreen tableNumber={displayTableName} />
      )}

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      <AnimatePresence>
        {selectedDish && (
          <DishDetail
            dish={selectedDish}
            onClose={() => setSelectedDish(null)}
            onAddToCart={(quantity, notes) =>
              handleAddToCart(selectedDish, quantity, notes)
            }
          />
        )}
      </AnimatePresence>

      <Cart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={handleCheckout}
      />

      <Payment
        isOpen={showPayment}
        tableNumber={displayTableName}
        onClose={() => setShowPayment(false)}
        onComplete={handlePaymentComplete}
      />

      <Toaster richColors />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A]">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
        </div>
      }>
        <TableProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </TableProvider>
      </Suspense>
    </ThemeProvider>
  );
}