'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Sparkles,
  CalendarCheck,
  User,
  LogOut,
  Menu,
  X,
  Search,
  Briefcase
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/explore' },
    {
      name: 'AI Assistant',
      href: '/ai-assistant',
      isAi: true
    },
    { name: 'My Bookings', href: '/my-bookings' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-nav text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal to-emerald-400 flex items-center justify-center shadow-lg shadow-teal/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-navy" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white">
                  Near<span className="text-teal">Me</span>
                </span>
                <span className="text-xs uppercase tracking-widest font-semibold px-2 py-0.5 rounded bg-teal/20 text-teal border border-teal/30">
                  Consulting
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium tracking-wide">
                Verified Nearby Advisors
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    active
                      ? 'bg-white/10 text-teal font-semibold'
                      : 'text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.isAi && (
                    <Sparkles className="w-4 h-4 text-accent-gold animate-pulse text-gold" />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Auth CTA Section */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/my-bookings"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm text-slate-200"
                >
                  <User className="w-4 h-4 text-teal" />
                  <span className="font-medium truncate max-w-[120px]">
                    {user?.name?.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-white/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-teal hover:bg-teal-hover text-navy shadow-md shadow-teal/20 transition-all hover:shadow-lg hover:shadow-teal/30 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-light/95 border-b border-white/10 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive(link.href)
                  ? 'bg-teal/20 text-teal font-semibold'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                {link.isAi && <Sparkles className="w-4 h-4 text-gold" />}
                {link.name}
              </div>
            </Link>
          ))}

          <div className="pt-4 border-t border-white/10">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm text-slate-300">
                  Signed in as{' '}
                  <span className="font-semibold text-white">{user?.name}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg text-sm font-medium border border-white/20 text-white hover:bg-white/5"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg text-sm font-semibold bg-teal text-navy hover:bg-teal-hover"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
