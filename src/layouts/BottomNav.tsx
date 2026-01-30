import { BookOpen, ShoppingCart, Clock, Wallet, Settings } from "lucide-react";
import { useCart } from "../hooks/useCart"; // Fix: Import từ hooks
import type { NavTab } from "../types";     // Fix: Import type từ types chung

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const tabs = [
    { id: "menu" as NavTab, label: "Menu", icon: BookOpen },
    {
      id: "cart" as NavTab,
      label: "Giỏ hàng",
      icon: ShoppingCart,
      badge: cartCount,
    },
    { id: "orders" as NavTab, label: "Đơn hàng", icon: Clock },
    { id: "payment" as NavTab, label: "Thanh toán", icon: Wallet },
    { id: "settings" as NavTab, label: "Cài đặt", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 flex flex-col items-center gap-1 py-2 relative"
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 ${isActive ? "text-[#FF6B00]" : "text-gray-400 dark:text-gray-500"}`}
                  strokeWidth={2}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#EF4444] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-xs ${isActive ? "text-[#FF6B00] font-bold" : "text-gray-500 dark:text-gray-400"}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}