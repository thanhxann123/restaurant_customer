import { motion } from 'motion/react';
import { ChefHat, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

interface WelcomeScreenProps {
  tableNumber: string;
  onContinue: () => void;
}

export function WelcomeScreen({ tableNumber, onContinue }: WelcomeScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onContinue, 3000);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#FF6B00] via-[#FF8533] to-[#10B981]">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative h-full flex flex-col items-center justify-center px-6 text-white">
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
            Quét QR để gọi món ngay – Không cần đăng nhập
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="w-full max-w-xs h-16 bg-white text-[#FF6B00] rounded-3xl font-bold text-lg flex items-center justify-center gap-2 shadow-2xl"
        >
          Xem Menu & Gọi Món
          <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="absolute bottom-8 text-white/70 text-sm"
        >
          Tự động chuyển sau 3 giây...
        </motion.div>
      </div>
    </div>
  );
}
