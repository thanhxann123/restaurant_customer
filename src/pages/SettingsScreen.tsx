import { Sun, Moon, Globe, Info } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface SettingsScreenProps {
  tableNumber: string;
}

export function SettingsScreen({ tableNumber }: SettingsScreenProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] pt-4 pb-24 px-4 transition-colors duration-300">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-6">
          Cài đặt
        </h1>

        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-4 mb-4 shadow-md dark:shadow-none border border-transparent dark:border-gray-700">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              {theme === "light" ? (
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                  <Sun className="w-6 h-6 text-[#FF6B00]" strokeWidth={2} />
                </div>
              ) : (
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <Moon className="w-6 h-6 text-[#FF6B00]" strokeWidth={2} />
                </div>
              )}
              <div>
                <p className="font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                  Giao diện
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {theme === "light" ? "Sáng" : "Tối"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`
                relative w-14 h-8 rounded-full transition-colors duration-300
                ${theme === "light" ? "bg-gray-300" : "bg-[#FF6B00]"}
              `}
            >
              <div
                className={`
                absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300
                ${theme === "light" ? "left-1" : "left-7"}
              `}
              />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-4 mb-4 shadow-md dark:shadow-none border border-transparent dark:border-gray-700">
          <button className="w-full flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-[#FF6B00]" strokeWidth={2} />
              </div>
              <div className="text-left">
                <p className="font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                  Ngôn ngữ
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tiếng Việt
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 shadow-md dark:shadow-none border border-transparent dark:border-gray-700">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-[#FF6B00]" strokeWidth={2} />
            </div>
            <div>
              <p className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">
                Thông tin
              </p>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  Bàn số:{" "}
                  <span className="font-bold text-[#FF6B00]">
                    {tableNumber}
                  </span>
                </p>
                <p>Nhà hàng: Food House</p>
                <p>Phiên bản: 1.0.0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2026 Food House Restaurant
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Gọi món QR - Không cần đăng nhập
          </p>
        </div>
      </div>
    </div>
  );
}
