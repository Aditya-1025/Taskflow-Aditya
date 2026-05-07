import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="h-screen w-full flex bg-slate-950 overflow-hidden">
      {/* Left Side - Visual Panel */}
      <motion.div
        className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col items-center justify-center p-8 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
        />

        {/* Content */}
        <div className="relative z-10 text-center text-slate-200 max-w-md">
          {/* Logo */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h2
            className="text-3xl font-bold mb-3 leading-tight text-slate-100"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Manage Tasks Like a Pro
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-sm text-slate-400 mb-6 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Stay organized, collaborate seamlessly, and deliver projects on time.
          </motion.p>

          {/* Illustration - Animated shapes */}
          <motion.div
            className="relative h-28 flex items-center justify-center mb-4"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* Card illustration */}
            <motion.div
              className="absolute w-32 h-24 bg-slate-800/50 border border-slate-700 rounded-xl p-3"
              animate={{ y: [0, -8, 0], rotate: [-2, 0, 2] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="h-1.5 bg-slate-700 rounded w-2/3 mb-2" />
              <div className="h-1.5 bg-slate-700/60 rounded w-1/2 mb-2" />
              <div className="flex gap-2">
                <motion.div className="w-6 h-6 bg-slate-700/40 rounded" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <motion.div className="w-6 h-6 bg-slate-700/30 rounded" animate={{ scale: [1.1, 1, 1.1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
              </div>
            </motion.div>
          </motion.div>

          {/* Features list */}
          <motion.div
            className="mt-4 space-y-2 text-xs"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {['✓ Real-time collaboration', '✓ Smart task management', '✓ Team insights'].map((feature, i) => (
              <motion.p
                key={i}
                className="text-slate-400 font-medium"
                whileHover={{ x: 5 }}
              >
                {feature}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form Panel */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 relative h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background gradient for mobile */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 to-slate-950 pointer-events-none lg:hidden" />

        {children}
      </motion.div>
    </div>
  );
}
