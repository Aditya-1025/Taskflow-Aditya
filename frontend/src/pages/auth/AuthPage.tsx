import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import SocialLoginButtons from '../../components/auth/SocialLoginButtons';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('MEMBER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await authService.login({ email, password });
      login(res.data);
      setSuccess('Welcome back! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.signup({ name, email, password, role });
      login(res.data);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setError('');
    setSuccess('');
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <AuthCard>
                {/* Header */}
                <motion.div
                  className="text-center mb-6"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h1 className="text-3xl font-bold text-slate-100 mb-1">
                    Welcome Back
                  </h1>
                  <p className="text-slate-400 text-sm">
                    Good to see you again.
                  </p>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Success message */}
                  {success && (
                    <motion.div
                      className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-700 rounded-xl text-center font-medium"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {success}
                    </motion.div>
                  )}

                  {/* Error message */}
                  {error && (
                    <motion.div
                      className="p-4 bg-rose-100 border border-rose-300 text-rose-700 rounded-xl text-center font-medium"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  <AuthInput
                    type="email"
                    label="Email Address"
                    placeholder="name@company.com"
                    value={email}
                    onChange={setEmail}
                    icon={<Mail size={20} />}
                    required
                    autoComplete="email"
                  />

                  <AuthInput
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChange={setPassword}
                    icon={<Lock size={20} />}
                    required
                    autoComplete="current-password"
                  />

                  {/* Remember me & Forgot password */}
                  <div className="flex items-center justify-between text-xs gap-2">
                    <motion.label
                      className="flex items-center gap-2 cursor-pointer group"
                      whileHover={{ x: 2 }}
                    >
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded border border-slate-600 bg-slate-700/40 checked:bg-teal-600 checked:border-teal-600 transition-colors cursor-pointer"
                        defaultChecked
                      />
                      <span className="text-slate-400 group-hover:text-slate-300 transition-colors">
                        Remember me
                      </span>
                    </motion.label>
                    <motion.a
                      href="#"
                      className="text-teal-400 hover:text-teal-300 transition-colors font-medium"
                      whileHover={{ x: 2 }}
                    >
                      Forgot?
                    </motion.a>
                  </div>

                  <AuthButton type="submit" disabled={loading} isLoading={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </AuthButton>
                </form>

                {/* Social login */}
                <SocialLoginButtons />

                {/* Toggle to register */}
                <motion.p
                  className="text-center mt-4 text-slate-400 text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Don't have an account?{' '}
                  <motion.button
                    onClick={toggleMode}
                    className="text-teal-400 hover:text-teal-300 font-bold transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    Create Account
                  </motion.button>
                </motion.p>
              </AuthCard>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <AuthCard>
                {/* Header */}
                <motion.div
                  className="text-center mb-6"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h1 className="text-3xl font-bold text-slate-100 mb-1">
                    Let's Get Started
                  </h1>
                  <p className="text-slate-400 text-sm">
                    Join thousands of teams managing their tasks.
                  </p>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleRegister} className="space-y-3">
                  {/* Success message */}
                  {success && (
                    <motion.div
                      className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-700 rounded-xl text-center font-medium"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {success}
                    </motion.div>
                  )}

                  {/* Error message */}
                  {error && (
                    <motion.div
                      className="p-4 bg-rose-100 border border-rose-300 text-rose-700 rounded-xl text-center font-medium"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  <AuthInput
                    type="text"
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={setName}
                    icon={<UserIcon size={20} />}
                    required
                    autoComplete="name"
                  />

                  <AuthInput
                    type="email"
                    label="Email Address"
                    placeholder="name@company.com"
                    value={email}
                    onChange={setEmail}
                    icon={<Mail size={20} />}
                    required
                    autoComplete="email"
                  />

                  <AuthInput
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChange={setPassword}
                    icon={<Lock size={20} />}
                    required
                    autoComplete="new-password"
                  />

                  <AuthInput
                    type="password"
                    label="Confirm Password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    icon={<Lock size={20} />}
                    required
                    autoComplete="new-password"
                  />

                  {/* Role selection */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <label className="block text-sm font-semibold text-slate-700 tracking-wide">
                      I am joining as <span className="text-teal-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['MEMBER', 'ADMIN'].map((r) => (
                        <motion.label
                          key={r}
                          className="relative cursor-pointer group"
                          whileHover={{ scale: 1.02 }}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={r}
                            checked={role === r}
                            onChange={(e) => setRole(e.target.value as Role)}
                            className="sr-only"
                          />
                          <div
                            className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center font-semibold cursor-pointer ${
                              role === r
                                ? 'bg-teal-100 border-teal-500 text-teal-700'
                                : 'bg-slate-100 border-slate-300 text-slate-600 hover:border-slate-400'
                            }`}
                          >

                            {r === 'MEMBER' ? '👤 Member' : '👨‍💼 Admin'}
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </motion.div>

                  {/* Terms */}
                  <motion.label
                    className="flex items-start gap-3 cursor-pointer group"
                    whileHover={{ x: 2 }}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded-lg border border-slate-300 bg-white checked:bg-teal-500 checked:border-teal-500 transition-colors cursor-pointer mt-1"
                      defaultChecked
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors leading-relaxed">
                      I agree to the Terms of Service and Privacy Policy
                    </span>
                  </motion.label>

                  <AuthButton type="submit" disabled={loading} isLoading={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </AuthButton>
                </form>

                {/* Social login */}
                <SocialLoginButtons />

                {/* Toggle to login */}
                <motion.p
                  className="text-center mt-8 text-slate-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Already have an account?{' '}
                  <motion.button
                    onClick={toggleMode}
                    className="text-teal-600 hover:text-teal-700 font-bold transition-colors relative group"
                    whileHover={{ scale: 1.05 }}
                  >
                    Sign In
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-600 to-cyan-600 origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </motion.p>
              </AuthCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}
