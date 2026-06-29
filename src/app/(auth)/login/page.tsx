'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('admin@gymsmart.com');
  const [password, setPassword] = useState('superadmin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Instant login logic
    if (email && password) {
      document.cookie = "auth=superadmin; path=/; max-age=86400";
      window.location.href = '/dashboard';
    } else {
      setError('Please enter both email and password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0F172A] font-sans">
      
      {/* LEFT SIDE: Visual (60%) */}
      <div className="hidden lg:flex lg:w-[60%] relative bg-black overflow-hidden flex-col justify-between p-12">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url('/gym-hero.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4
        }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 to-transparent" />
        
        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <Image src="/logo.png" alt="GymSmart" width={48} height={48} className="rounded-xl shadow-lg" />
          <div>
            <h1 className="text-2xl font-black text-white leading-tight">GymSmart</h1>
            <p className="text-xs font-medium text-[#F43F5E] uppercase tracking-widest">Gym Management Made Simple</p>
          </div>
        </div>

        {/* Center Text */}
        <div className="relative z-10 mb-20 max-w-lg">
          <h2 className="text-5xl font-black text-white mb-6 leading-tight">
            Administrator Portal.<br/>
            <span className="text-[#4F46E5]">Secure access to GymSmart ERP.</span>
          </h2>
          <div className="flex items-center gap-3 text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-4 py-2 rounded-full w-max">
            <CheckCircle2 size={16} />
            <span className="text-sm font-semibold">System Online & Secure</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Form (40%) */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-6 sm:p-12 relative z-10 bg-[#0F172A]">
        
        {/* Mobile Logo (hidden on large screens) */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
          <Image src="/logo.png" alt="GymSmart" width={40} height={40} className="rounded-xl" />
          <h1 className="text-xl font-black text-white">GymSmart</h1>
        </div>

        <div className="w-full max-w-[420px] bg-[#1E2937] p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-slate-700/50">
          
          <div className="mb-8">
            <h2 className="text-[32px] font-bold text-white mb-2">SuperAdmin Access</h2>
            <p className="text-[#94A3B8]">Enter your administrative credentials to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address / Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#334155] border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all shadow-inner"
                  placeholder="admin@gymsmart.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <a href="#" className="text-sm font-medium text-[#4F46E5] hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#334155] border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all shadow-inner"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-1 pb-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded border-slate-600 bg-[#334155] text-[#4F46E5] focus:ring-[#4F46E5] focus:ring-offset-[#1E2937]" 
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-slate-300">Remember Me</label>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
              style={{ backgroundColor: '#F43F5E' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Log In'
              )}
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}
