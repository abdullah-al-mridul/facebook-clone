
'use client';

import { motion } from 'framer-motion';

export default function UniversalLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="text-6xl font-bold text-primary"
      >
        F
      </motion.div>
    </div>
  );
}
