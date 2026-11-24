'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-teal flex items-center justify-center text-navy font-bold shadow-md">
                <Compass className="w-5 h-5 text-navy" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Near<span className="text-teal">Me</span> Consulting
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The AI-powered discovery and booking platform connecting entrepreneurs, businesses, and professionals with trusted local consultants right around you.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal font-medium bg-teal/10 px-3 py-1.5 rounded-full w-fit border border-teal/20">
              <ShieldCheck className="w-4 h-4" />
              <span>Real Database Verified Experts</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Consulting Sectors
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/explore?category=IT+Consulting" className="hover:text-teal transition-colors">
                  IT & Cloud Advisory
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Business+Consulting" className="hover:text-teal transition-colors">
                  Business & Startup Strategy
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Financial+Consulting" className="hover:text-teal transition-colors">
                  Tax, Wealth & Audit
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Legal+Consulting" className="hover:text-teal transition-colors">
                  Corporate & Legal Law
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Career+Consulting" className="hover:text-teal transition-colors">
                  Career Coaching & Mock HR
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Marketing+Consulting" className="hover:text-teal transition-colors">
                  Growth Marketing & SEO
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Platform Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/explore" className="hover:text-teal transition-colors">
                  Explore Directory
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant" className="hover:text-teal transition-colors">
                  AI Recommendation Agent
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="hover:text-teal transition-colors">
                  Track Consultations
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal transition-colors">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal transition-colors">
                  Partner Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Demo Note */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Contact & Support
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal shrink-0" />
                <span>Pune & PCMC Tech Hub, MH</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal shrink-0" />
                <span>support@nearmeconsulting.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal shrink-0" />
                <span>+91 1800 200 4500</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NearMe Consulting Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">
              ⚡ Notice: Demo listings provided for demonstration & evaluation purposes.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
