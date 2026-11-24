'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Compass, User, Mail, Lock, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      router.push('/my-bookings');
    } catch (err) {
      // handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bodyBg py-16 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal/15 text-teal flex items-center justify-center mx-auto mb-3">
            <Compass className="w-7 h-7 text-navy" />
          </div>
          <h1 className="text-2xl font-black text-navy">Create an Account</h1>
          <p className="text-xs text-slate-500">
            Join NearMe Consulting to book and manage sessions with verified experts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Aditi Kulkarni"
                required
                className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
              Password (min. 6 characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
              Account Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-navy focus:outline-none focus:border-teal"
            >
              <option value="customer">Client (Book & Manage Consultations)</option>
              <option value="admin">Platform Admin (Manage Practice Bookings)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal hover:bg-teal-hover disabled:opacity-50 text-navy font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Registering Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-teal font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
