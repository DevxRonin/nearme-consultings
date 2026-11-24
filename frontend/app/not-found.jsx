'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Home, Search, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-bodyBg">
      <div className="text-center max-w-md bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-teal/15 text-teal flex items-center justify-center mx-auto">
          <Compass className="w-9 h-9 text-navy animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-6xl font-black text-navy tracking-tight">
            4<span className="text-teal">0</span>4
          </span>
          <h1 className="text-lg font-bold text-navy">Page Not Found</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            The page or consultation resource you are looking for has moved, expired, or does not exist.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-navy hover:bg-navy-light text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/explore"
            className="w-full sm:w-auto px-5 py-2.5 bg-teal hover:bg-teal-hover text-navy text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Explore Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
