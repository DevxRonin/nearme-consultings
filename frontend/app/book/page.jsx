'use client';

import React from 'react';
import BookingForm from '../../components/BookingForm';

export default function GeneralBookingPage() {
  return (
    <div className="min-h-screen bg-bodyBg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-teal uppercase tracking-widest">
            Direct Scheduling
          </span>
          <h1 className="text-3xl font-extrabold text-navy tracking-tight mt-1">
            Book a Professional Consultation
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Select a verified advisor, choose an available time slot, and reserve your consultation instantly.
          </p>
        </div>

        <BookingForm />
      </div>
    </div>
  );
}
