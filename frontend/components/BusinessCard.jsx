'use client';

import React from 'react';
import Link from 'next/link';
import {
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Navigation
} from 'lucide-react';

export default function BusinessCard({ business }) {
  if (!business) return null;

  const defaultImage =
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';
  const displayImage =
    business.images && business.images.length > 0
      ? business.images[0]
      : defaultImage;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1">
      {/* Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-navy text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          {business.category}
        </div>

        {/* Distance Badge (if present) */}
        {business.distanceKm !== undefined && business.distanceKm !== null && (
          <div className="absolute top-3 right-3 bg-teal text-navy text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Navigation className="w-3 h-3 fill-navy" />
            <span>{business.distanceKm} km away</span>
          </div>
        )}

        {/* Rating and Price Overlay at Bottom of Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-1 bg-navy/70 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
            <span>{business.rating}</span>
            <span className="text-slate-300">({business.reviewCount || 10})</span>
          </div>
          <div className="bg-navy/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-teal">
            Starts ₹{business.price}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Business Title & Verified */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <Link
              href={`/businesses/${business._id}`}
              className="text-lg font-bold text-navy hover:text-teal transition-colors line-clamp-1"
            >
              {business.name}
            </Link>
            {business.isVerified && (
              <ShieldCheck
                className="w-4 h-4 text-teal shrink-0 mt-1"
                title="Verified Practice"
              />
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <MapPin className="w-3.5 h-3.5 text-teal shrink-0" />
            <span className="truncate">{business.address || business.city}</span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {business.description}
          </p>

          {/* Available Services Chips */}
          <div className="mb-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Available Advisory
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(business.services || []).slice(0, 2).map((srv, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60 truncate max-w-[200px]"
                >
                  {srv}
                </span>
              ))}
              {(business.services || []).length > 2 && (
                <span className="text-[11px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded-md border border-slate-200/60 font-medium">
                  +{(business.services || []).length - 2} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          <Link
            href={`/businesses/${business._id}`}
            className="flex-1 text-center py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy transition-all"
          >
            View Details
          </Link>
          <Link
            href={`/book/${business._id}`}
            className="flex-1 text-center py-2 px-3 rounded-xl bg-navy hover:bg-teal hover:text-navy text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1 group/btn"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
