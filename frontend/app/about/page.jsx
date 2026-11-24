'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  ShieldCheck,
  Target,
  Users,
  Award,
  Sparkles,
  Database,
  CalendarCheck,
  ArrowRight
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bodyBg py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/15 text-teal text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Our Mission & Architectural Standards</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-navy tracking-tight leading-tight">
            Bridging Local Enterprises with World-Class Advisory
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            NearMe Consulting was built on a simple conviction: finding a qualified IT architect, corporate CA, tax advisor, or legal partner shouldn't rely on unverified phone numbers or static lists.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-xs">
            <div className="text-3xl font-black text-teal">1,200+</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Sessions Booked</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-xs">
            <div className="text-3xl font-black text-navy">7</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Consulting Sectors</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-xs">
            <div className="text-3xl font-black text-gold">★ 4.8</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Average Client Rating</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-xs">
            <div className="text-3xl font-black text-emerald-600">100%</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Conflict-Free Slots</div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal/10 text-teal flex items-center justify-center font-bold">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-navy">
              Genuine Geospatial Discovery
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We leverage MongoDB 2dsphere indexes and Haversine spherical math to compute real-world distance between your coordinates and consulting practices.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-base font-bold text-navy">
              Truthful AI Recommendations
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our AI Assistant queries real database records and extracts intent without fabricating businesses, prices, or ratings. Zero hallucination guarantee.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-navy text-teal flex items-center justify-center font-bold">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-navy">
              Guaranteed Conflict-Free Locks
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every consultation booking executes availability checks preventing double-booking and ensuring your scheduled advisor is dedicated to your session.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-navy p-10 sm:p-14 rounded-3xl text-white text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Ready to find your consulting match?
          </h2>
          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            Browse our full directory of certified technology, legal, tax, and business coaches right around your area.
          </p>
          <div className="pt-2">
            <Link
              href="/explore"
              className="px-6 py-3 bg-teal hover:bg-teal-hover text-navy font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
            >
              <span>Explore Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
