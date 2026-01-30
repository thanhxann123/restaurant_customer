import { Sun, Moon, Info } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

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

        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-4 mb-4 shadow-md">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                {theme === 'light' ? <Sun className="text-[#FF6B00]" /> : <Moon className="text-[#FF6B00]" />}
              </div>
              <div className="text-left">
                 <p className="font-bold text-[#0F172A] dark:text-[#F1F5F9]">Giao diện</p>
                 <p className="text-sm text-gray-500">{theme === 'light' ? 'Sáng' : 'Tối'}</p>
              </div>
            </div>
            <button onClick={toggleTheme} className="bg-gray-200 px-4 py-2 rounded-full text-sm font-bold">
              Đổi
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 shadow-md">
           <div className="flex items-center gap-3 mb-2">
             <Info className="text-[#FF6B00]" />
             <p className="font-bold dark:text-white">Thông tin</p>
           </div>
           <p className="text-sm text-gray-500 ml-9">Bàn số: {tableNumber}</p>
           <p className="text-sm text-gray-500 ml-9">Phiên bản: 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
