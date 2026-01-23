import { Search, Sun, Moon, ShoppingCart } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useCart } from "../contexts/CartContext";

interface HeaderProps {
  onSearch: (query: string) => void;
  onCartClick: () => void;
}

export function Header({ onSearch, onCartClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { items } = useCart();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B00] to-[#FF8533] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div>
              <h1 className="font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                Food House
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Nhà hàng cao cấp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {theme === "light" ? (
                <Sun className="w-5 h-5 text-[#FF6B00]" strokeWidth={2} />
              ) : (
                <Moon className="w-5 h-5 text-[#FF6B00]" strokeWidth={2} />
              )}
            </button>

            <button
              onClick={onCartClick}
              className="w-10 h-10 rounded-full bg-[#FF6B00] flex items-center justify-center relative transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <ShoppingCart className="w-5 h-5 text-white" strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Tìm món ăn..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full h-12 pl-11 pr-4 bg-gray-100 dark:bg-gray-800 border-0 rounded-2xl text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
          />
        </div>
      </div>
    </header>
  );
}
