import React from 'react';
import { motion } from 'framer-motion';

interface AuthButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export default function AuthButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  isLoading = false,
  variant = 'primary',
  fullWidth = true,
  icon,
}: AuthButtonProps) {
  const variants = {
    primary:
      'bg-gradient-to-r from-teal-600/80 to-cyan-600/80 hover:from-teal-600 hover:to-cyan-600 text-slate-100 shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30',
    secondary:
      'bg-slate-700/60 hover:bg-slate-700 text-slate-200 shadow-lg shadow-slate-700/20 hover:shadow-slate-700/30',
    outline:
      'border border-slate-600 hover:border-slate-500 text-slate-300 hover:bg-slate-700/30 hover:text-slate-200',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`relative group ${fullWidth ? 'w-full' : ''} ${variants[variant]} font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden text-sm`}
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <span className="relative z-10 flex items-center justify-center gap-3">
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5"
          >
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" opacity="0.3" />
              <path d="M12 2a10 10 0 0 1 0 20" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
        ) : icon ? (
          icon
        ) : null}
        <span>{children}</span>
      </span>
    </motion.button>
  );
}
