import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

interface AuthInputProps {
  type?: string;
  placeholder?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  error?: string;
  required?: boolean;
  autoComplete?: string;
}

export default function AuthInput({
  type = 'text',
  placeholder,
  label,
  value,
  onChange,
  icon,
  error,
  required,
  autoComplete,
}: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const displayType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {label && (
        <motion.label
          className="block text-xs font-semibold text-slate-300 tracking-wide uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {label}
          {required && <span className="text-teal-400 ml-1">*</span>}
        </motion.label>
      )}

      <div className="relative group">
        {/* Input container */}
        <div className="relative flex items-center gap-3">
          {/* Icon */}
          {icon && (
            <motion.div
              className="absolute left-3 text-slate-500 group-focus-within:text-teal-400 transition-colors pointer-events-none"
              animate={isFocused ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.div>
          )}

          {/* Input field */}
          <input
            type={displayType}
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoComplete={autoComplete}
            required={required}
            className={`w-full relative z-10 bg-slate-700/40 border border-slate-600/60 rounded-lg py-2.5 transition-all duration-300 outline-none text-slate-100 placeholder-slate-500 text-sm ${
              icon ? 'pl-10' : 'pl-3'
            } pr-3 hover:border-slate-600 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20`}
          />

          {/* Password visibility toggle */}
          {isPassword && (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-slate-500 hover:text-slate-400 transition-colors p-0.5"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </motion.button>
          )}
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-sm text-rose-500 font-medium mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
