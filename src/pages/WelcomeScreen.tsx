import { motion } from 'motion/react';
import { ChefHat, ArrowRight, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useTable } from '../hooks/useTable';

interface WelcomeScreenProps {
  tableNumber: string;
  tableId: number;
  onContinue: () => void;
}

export function WelcomeScreen({ tableNumber, tableId, onContinue }: WelcomeScreenProps) {
  const { joinTable, requestOpenTable, isWaitingForStaff, isTableOpened } = useTable();

  useEffect(() => {
    // Set ID bàn vào context ngay khi mount
    joinTable(tableId);
  }, [tableId, joinTable]);

  useEffect(() => {
    // Nếu đã có token trong localStorage, tự động continue
    if (isTableOpened) {
      onContinue();
    }
  }, [isTableOpened, onContinue]);

  const handleStart = () => {
    // Gửi yêu cầu mở bàn
    requestOpenTable(tableId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#FF6B00] via-[#FF8533] to-[#10B981]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url([https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80](https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative h-full flex flex-col items-center justify-center px-6 text-white">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
            <ChefHat className="w-14 h-14 text-[#FF6B00]" strokeWidth={2} />
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-3">
            Chào mừng đến Bàn {tableNumber}!
          </h1>
          <p className="text-lg text-white/90">
            {isWaitingForStaff 
              ? "Đang chờ nhân viên xác nhận..." 
              : "Vui lòng nhấn nút bên dưới để bắt đầu gọi món"}
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          disabled={isWaitingForStaff}
          className={`w-full max-w-xs h-16 rounded-3xl font-bold text-lg flex items-center justify-center gap-2 shadow-2xl transition-colors
            ${isWaitingForStaff 
              ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
              : "bg-white text-[#FF6B00]"
            }
          `}
        >
          {isWaitingForStaff ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Đang chờ...
            </>
          ) : (
            <>
              Yêu cầu mở bàn
              <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
            </>
          )}
        </motion.button>
        
        {isWaitingForStaff && (
           <p className="absolute bottom-20 text-white/80 text-sm animate-pulse">
             Vui lòng đợi trong giây lát...
           </p>
        )}
      </div>
    </div>
  );
}
