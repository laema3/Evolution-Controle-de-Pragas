import { motion } from 'motion/react';
import { Bug } from 'lucide-react';

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
      <motion.div
        animate={{ 
          x: [-5, 5, -5],
          y: [-2, 2, -2],
          rotate: [-10, 10, -10]
        }}
        transition={{ 
          duration: 0.15, 
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Usando o ícone de Bug com cor de barata (marrom escuro) */}
        <Bug className="w-24 h-24 text-[#5A3A22]" />
      </motion.div>
      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="mt-6 font-bold text-[#5A3A22] text-xl tracking-widest uppercase"
      >
        Carregando...
      </motion.div>
    </div>
  );
}
