'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import BookingForm from '../../../components/BookingForm';

export default function BusinessSpecificBookingPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-bodyBg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-teal uppercase tracking-widest">
            Confirmed Practice Reservation
          </span>
          <h1 className="text-3xl font-extrabold text-navy tracking-tight mt-1">
            Book Your Consultation
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Schedule a guaranteed advisory slot with instant database conflict checking.
          </p>
        </div>

        <BookingForm initialBusinessId={id} />
      </div>
    </div>
  );
}
