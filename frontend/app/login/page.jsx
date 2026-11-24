'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Compass, Mail, Lock, ArrowRight, ShieldCheck, Key } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.push('/my-bookings');
    } catch (err) {
      // handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    toast.success(`Filled demo credentials for ${demoEmail}`);
  };

  return (
    <div className="min-h-screen bg-bodyBg py-16 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal/15 text-teal flex items-center justify-center mx-auto mb-3">
            <Compass className="w-7 h-7 text-navy" />
          </div>
          <h1 className="text-2xl font-black text-navy">Welcome Back</h1>
          <p className="text-xs text-slate-500">
            Sign in to access your consultations and client dashboard.
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Cards */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="font-bold text-navy flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <Key className="w-3.5 h-3.5 text-teal" />
            <span>Quick Demo Credentials</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('customer@nearme.com', 'customer123')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-teal text-left transition-colors"
            >
              <div className="font-bold text-navy text-[11px]">Client Demo</div>
              <div className="text-[10px] text-slate-500">customer@nearme.com</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@nearme.com', 'admin123')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-teal text-left transition-colors"
            >
              <div className="font-bold text-navy text-[11px]">Admin Demo</div>
              <div className="text-[10px] text-slate-500">admin@nearme.com</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal hover:bg-teal-hover disabled:opacity-50 text-navy font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link href="/register" className="text-teal font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
