'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../services/api';
import BusinessCard from '../components/BusinessCard';
import toast from 'react-hot-toast';
import {
  Search,
  MapPin,
  Sparkles,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  CalendarCheck,
  Laptop,
  Briefcase,
  TrendingUp,
  Scale,
  GraduationCap,
  Megaphone,
  Layers,
  ChevronRight,
  CheckCircle2,
  Clock
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'IT Consulting',
    icon: Laptop,
    desc: 'Cloud, Cybersecurity, AI & Full-Stack',
    count: '3+ Experts'
  },
  {
    name: 'Business Consulting',
    icon: Briefcase,
    desc: 'Strategy, Startup Scale-up & Operations',
    count: '3+ Experts'
  },
  {
    name: 'Financial Consulting',
    icon: TrendingUp,
    desc: 'Corporate Tax, GST & Wealth Planning',
    count: '2+ Experts'
  },
  {
    name: 'Legal Consulting',
    icon: Scale,
    desc: 'Contracts, IP Patents & Compliances',
    count: '2+ Experts'
  },
  {
    name: 'Career Consulting',
    icon: GraduationCap,
    desc: 'Executive Coaching & Resume Reviews',
    count: '2+ Experts'
  },
  {
    name: 'Marketing Consulting',
    icon: Megaphone,
    desc: 'Performance SEO, Ads & Brand Building',
    count: '2+ Experts'
  },
  {
    name: 'Management Consulting',
    icon: Layers,
    desc: 'Supply Chain, Lean Six Sigma & Restructuring',
    count: '1+ Expert'
  }
];

export default function HomePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [popularBusinesses, setPopularBusinesses] = useState([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);

  useEffect(() => {
    fetchTopBusinesses();
  }, []);

  const fetchTopBusinesses = async () => {
    try {
      const res = await api.get('/api/businesses?limit=6&sort=rating_desc');
      if (res.data?.success) {
        setPopularBusinesses(res.data.data);
      }
    } catch (err) {
      console.warn('Could not fetch top businesses:', err.message);
    } finally {
      setLoadingBusinesses(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (locationTerm.trim()) params.append('city', locationTerm.trim());
    router.push(`/explore?${params.toString()}`);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    toast.loading('Detecting your GPS location...', { id: 'geo' });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        toast.success('Location detected! Finding nearest consultants...', {
          id: 'geo'
        });
        setIsLocating(false);
        router.push(`/explore?lat=${latitude}&lon=${longitude}&useGeo=true`);
      },
      (err) => {
        setIsLocating(false);
        toast.dismiss('geo');
        if (err.code === 1) {
          toast.error('Location permission was denied. Please enter your city manually.');
        } else {
          toast.error('Unable to fetch precise location. Please enter city manually.');
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden gradient-hero text-white pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Background glow ornaments */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-gold/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-teal shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Next-Gen Consulting Discovery Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              Find the Right Experts,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-emerald-300">
                Right Around You.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Discover trusted consulting professionals and services near your location.
              Compare, connect and book with confidence.
            </p>

            {/* Search Box Card */}
            <div className="pt-4">
              <form
                onSubmit={handleSearch}
                className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-2xl border border-white/20 flex flex-col md:flex-row gap-2.5 text-textMain"
              >
                {/* Location Input */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 md:w-1/3">
                  <MapPin className="w-4 h-4 text-teal shrink-0" />
                  <input
                    type="text"
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                    placeholder="City, area (e.g. Pune, Wakad)"
                    className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Service/Keyword Input */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex-1">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Service, firm or advisor (e.g. IT cloud, Tax CA)"
                    className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-teal hover:bg-teal-hover text-navy font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </form>

              {/* Action shortcuts */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={isLocating}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Navigation className={`w-3.5 h-3.5 text-teal ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Locating...' : 'Use My GPS Location'}</span>
                </button>

                <Link
                  href="/ai-assistant"
                  className="px-3.5 py-1.5 rounded-xl bg-gold/20 hover:bg-gold/30 border border-gold/30 text-gold font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI Assistant</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="text-xs font-bold text-teal uppercase tracking-widest mb-1">
                Explore Sectors
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy">
                Popular Consulting Categories
              </h2>
            </div>
            <Link
              href="/explore"
              className="mt-3 md:mt-0 text-sm font-semibold text-teal hover:text-navy transition-colors flex items-center gap-1 group"
            >
              <span>View All Sectors</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  href={`/explore?category=${encodeURIComponent(cat.name)}`}
                  className="p-5 rounded-2xl border border-slate-200/80 hover:border-teal/50 hover:shadow-lg transition-all duration-300 bg-bodyBg/50 hover:bg-white group"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal/10 text-teal flex items-center justify-center mb-4 group-hover:bg-teal group-hover:text-navy transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-navy text-base mb-1 group-hover:text-teal transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                    {cat.desc}
                  </p>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {cat.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* POPULAR NEARBY BUSINESSES */}
      <section className="py-16 bg-bodyBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="text-xs font-bold text-teal uppercase tracking-widest mb-1">
                Verified Directory
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy">
                Top Rated Consultants
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Hand-picked verified advisors with high client ratings and verified credentials.
              </p>
            </div>
            <Link
              href="/explore"
              className="mt-3 md:mt-0 text-sm font-semibold text-teal hover:text-navy transition-colors flex items-center gap-1 group"
            >
              <span>Explore All 13+ Consultants</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingBusinesses ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularBusinesses.map((b) => (
                <BusinessCard key={b._id} business={b} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW NEARME WORKS */}
      <section className="py-16 bg-white border-t border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-teal uppercase tracking-widest">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mt-1">
              How NearMe Works
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Book professional consulting services in minutes with our transparent, conflict-free platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-bodyBg border border-slate-200 text-center relative group hover:border-teal/40 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-navy text-teal flex items-center justify-center mx-auto mb-5 text-xl font-black shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">
                Discover or Ask AI
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter by genuine distance, hourly rates, and categories, or query our AI assistant in natural language.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-bodyBg border border-slate-200 text-center relative group hover:border-teal/40 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-teal text-navy flex items-center justify-center mx-auto mb-5 text-xl font-black shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">
                Evaluate & Select Slot
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review verified past client ratings, practice expertise, and real-time slot availability without double booking.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-bodyBg border border-slate-200 text-center relative group hover:border-teal/40 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-gold text-navy flex items-center justify-center mx-auto mb-5 text-xl font-black shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">
                Confirmed Consultation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive an instant unique booking reference, automatic email reminder, and direct advisor contact details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE NEARME */}
      <section className="py-16 bg-navy text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-teal/20 text-teal text-xs font-bold tracking-wider uppercase">
                Enterprise Standards
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Why Entrepreneurs & Leaders Choose NearMe
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Traditional directories display unverified contact cards and static reviews. NearMe Consulting combines genuine MongoDB geospatial indexes, real-time calendar slot validation, and intelligent AI matching.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal/20 flex items-center justify-center text-teal shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      Zero Hallucination AI Matching
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Our assistant strictly queries real database records—it never invents prices, ratings or slots.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal/20 flex items-center justify-center text-teal shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      Genuine Distance Calculations
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Haversine and GeoJSON spherical calculations show precise travel distances from your coordinates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal/20 flex items-center justify-center text-teal shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      Conflict-Free Scheduling
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Automated database slot locks ensure no two clients can reserve the exact same consultant time slot.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Showcase Card */}
            <div className="bg-navy-light/80 p-8 rounded-3xl border border-white/10 shadow-2xl relative">
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal text-navy flex items-center justify-center font-bold">
                    AI
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">NearMe Intelligence Engine</div>
                    <div className="text-xs text-slate-400">Contextual Intent Recognition</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  Online
                </span>
              </div>

              <div className="space-y-4 py-6">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                  <span className="text-teal font-semibold">User Query: </span>
                  "Find top-rated financial and GST consultants near Aundh under ₹1000"
                </div>

                <div className="p-3.5 rounded-xl bg-teal/10 border border-teal/30 text-xs text-slate-200">
                  <span className="text-gold font-semibold">AI Matcher: </span>
                  Identified category: <strong>Financial Consulting</strong>, Location: <strong>Aundh, Pune</strong>, Max Price: <strong>₹1000</strong>. Returned <strong>Vanguard Wealth & Tax Consultants</strong> (★ 4.9, ₹899).
                </div>
              </div>

              <Link
                href="/ai-assistant"
                className="w-full py-3 rounded-xl bg-teal hover:bg-teal-hover text-navy font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Sparkles className="w-4 h-4 text-navy" />
                <span>Try the Interactive AI Assistant</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-teal uppercase tracking-widest">
              Client Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mt-1">
              Trusted by 1,200+ Businesses
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Here is what founders and leaders say about finding their consulting partners on NearMe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-bodyBg border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-gold mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-4">
                  "We needed a corporate lawyer on short notice to finalize our angel investment agreements. Within 15 minutes we discovered LexJuris Associates, booked a 2:00 PM slot, and had contracts drafted the same day."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <div className="w-9 h-9 rounded-full bg-teal text-navy font-bold flex items-center justify-center text-xs">
                  RD
                </div>
                <div>
                  <div className="text-xs font-bold text-navy">Rohan Deshmukh</div>
                  <div className="text-[11px] text-slate-500">Founder, CloudScale Technologies</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-bodyBg border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-gold mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-4">
                  "The AI Assistant extracted exactly what I needed when I typed 'Show me top rated IT security auditors near Hinjawadi'. TechForge delivered top-notch vulnerability audit for our SaaS platform."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <div className="w-9 h-9 rounded-full bg-navy text-teal font-bold flex items-center justify-center text-xs">
                  PK
                </div>
                <div>
                  <div className="text-xs font-bold text-navy">Priya Kulkarni</div>
                  <div className="text-[11px] text-slate-500">VP Engineering, FinTrack India</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-bodyBg border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-gold mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-4">
                  "The slot availability prevention is brilliant. No back-and-forth phone calls or rescheduling. You choose your time, receive your booking reference, and consultation begins smoothly."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <div className="w-9 h-9 rounded-full bg-gold text-navy font-bold flex items-center justify-center text-xs">
                  AS
                </div>
                <div>
                  <div className="text-xs font-bold text-navy">Anil Sharma</div>
                  <div className="text-[11px] text-slate-500">Managing Director, Apex Logistics</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 bg-gradient-to-r from-navy via-navy-light to-navy text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">
            Ready to Accelerate Your Business Growth?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Find vetted consulting specialists in technology, finance, legal, and marketing within minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/explore"
              className="px-6 py-3 rounded-xl bg-teal hover:bg-teal-hover text-navy font-bold text-sm shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Browse All Consultants
            </Link>
            <Link
              href="/ai-assistant"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Ask AI Consultant</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
