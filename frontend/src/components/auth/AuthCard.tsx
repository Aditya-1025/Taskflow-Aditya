import React from 'react';
import { motion } from 'framer-motion';

interface AuthCardProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export default function AuthCard({ children, maxWidth = 'max-w-sm' }: AuthCardProps) {
  return (
    <motion.div
      className={`${maxWidth} w-full relative z-10`}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dark card with subtle border */}
      <div className="relative bg-slate-800/80 rounded-2xl p-6 border border-slate-700/50">
        {/* Subtle top border accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500/50 via-cyan-500/50 to-teal-500/50 rounded-t-2xl" />

        {/* Content */}
        <div className="relative">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
