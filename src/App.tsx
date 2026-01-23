import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { toast, Toaster } from "sonner";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider, useCart } from "./contexts/CartContext";
import { WelcomeScreen } from "./pages/WelcomeScreen";
import { MenuScreen } from "./pages/MenuScreen";
import { DishDetail } from "./pages/DishDetail";
import { Cart } from "./pages/Cart";
import { OrderStatus } from "./pages/OrderStatus";
import { Payment } from "./pages/Payment";
import { BottomNav, type NavTab } from "./pages/BottomNav";
import { SettingsScreen } from "./pages/SettingsScreen";
import type { Dish } from "./data/menu";

function AppContent() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>("menu");
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [hasOrdered, setHasOrdered] = useState(false);

  // Simulate table number from QR scan token
  const tableNumber = "12";

  const { addItem, clearCart } = useCart();

  useEffect(() => {
    // Prevent scrolling on body when modals are open
    if (selectedDish || showCart || showPayment) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedDish, showCart, showPayment]);

  const handleAddToCart = (
    dish: Dish,
    quantity: number = 1,
    notes: string = "",
  ) => {
    addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      quantity,
      notes,
    });

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

    // Simulate order status updates
    setTimeout(() => {
      toast.info("Món sẵn sàng!", {
        description: "Đơn hàng của bạn đã hoàn thành",
        duration: 3000,
        position: "top-center",
      });
    }, 5000);
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

  if (showWelcome) {
    return (
      <WelcomeScreen
        tableNumber={tableNumber}
        onContinue={() => setShowWelcome(false)}
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
          tableNumber={tableNumber}
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

      {activeTab === "settings" && <SettingsScreen tableNumber={tableNumber} />}

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
        tableNumber={tableNumber}
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
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ThemeProvider>
  );
}
