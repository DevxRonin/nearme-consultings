'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Search,
  LogIn,
  ShieldCheck,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function MyBookingsPage() {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // Email lookup for non-logged in guests
  const [lookupEmail, setLookupEmail] = useState('');
  const [activeEmail, setActiveEmail] = useState('');

  useEffect(() => {
    if (user?.email) {
      setActiveEmail(user.email);
      fetchBookings(user.email);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBookings = async (emailToUse) => {
    setLoading(true);
    try {
      const url = emailToUse
        ? `/api/bookings/my?email=${encodeURIComponent(emailToUse)}`
        : '/api/bookings/my';
      const res = await api.get(url);
      if (res.data?.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      toast.error('Could not load bookings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLookupSubmit = (e) => {
    e.preventDefault();
    if (!lookupEmail.trim()) {
      toast.error('Please enter your booking email');
      return;
    }
    setActiveEmail(lookupEmail.trim());
    fetchBookings(lookupEmail.trim());
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this consultation booking?')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      const res = await api.patch(`/api/bookings/${bookingId}/cancel`);
      if (res.data?.success) {
        toast.success('Consultation has been cancelled');
        fetchBookings(activeEmail || user?.email);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-bodyBg py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-teal uppercase tracking-widest">
              Consultation Dashboard
            </span>
            <h1 className="text-3xl font-extrabold text-navy tracking-tight mt-1">
              My Scheduled Bookings
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track your confirmed sessions, view advisor coordinates, or manage appointments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/book"
              className="px-4 py-2 bg-teal hover:bg-teal-hover text-navy font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>+ Book Consultation</span>
            </Link>
          </div>
        </div>

        {/* Email Lookup Banner if not logged in or searching alternate email */}
        {!isAuthenticated && !activeEmail && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy text-teal flex items-center justify-center font-bold">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy">
                  Access Your Consultation Bookings
                </h3>
                <p className="text-xs text-slate-500">
                  Enter the email address you provided when reserving your consultation.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleLookupSubmit}
              className="flex flex-col sm:flex-row gap-2.5 pt-2"
            >
              <input
                type="email"
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
                placeholder="Enter your email (e.g. rahul@example.com)"
                required
                className="flex-1 p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-navy hover:bg-navy-light text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                Find My Bookings
              </button>
            </form>

            <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
              <span>Have an account?</span>
              <Link href="/login" className="text-teal font-semibold hover:underline">
                Log In to automatically view all past consultations
              </Link>
            </div>
          </div>
        )}

        {/* Active email indicator */}
        {activeEmail && (
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 text-xs text-slate-600">
            <div>
              Showing bookings associated with:{' '}
              <strong className="text-navy">{activeEmail}</strong>
            </div>
            <button
              onClick={() => fetchBookings(activeEmail)}
              className="text-teal hover:text-navy flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        )}

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl h-44 animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-navy">
              No Consultations Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You do not have any active or past consultation bookings registered under this email.
            </p>
            <Link
              href="/explore"
              className="inline-block px-5 py-2.5 bg-teal text-navy font-bold text-xs rounded-xl shadow-sm hover:bg-teal-hover transition-colors"
            >
              Discover & Book Consultants
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const isCancelled = booking.status === 'cancelled';
              const isConfirmed = booking.status === 'confirmed';

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    {/* Status Badge & Reference */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          isConfirmed
                            ? 'bg-emerald-100 text-emerald-800'
                            : isCancelled
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        Ref: {booking.bookingReference}
                      </span>
                    </div>

                    {/* Business Name & Service */}
                    <div>
                      <h3 className="text-lg font-bold text-navy">
                        {booking.businessId?.name || 'Consulting Practice'}
                      </h3>
                      <div className="text-xs font-semibold text-teal mt-0.5">
                        {booking.service}
                      </div>
                    </div>

                    {/* Date, Time & Format */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-teal" />
                        {booking.bookingDate}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-teal" />
                        {booking.bookingTime}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-teal" />
                        {booking.location}
                      </span>
                    </div>

                    {/* Requirements note if present */}
                    {booking.requirements && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 italic">
                        "{booking.requirements}"
                      </p>
                    )}
                  </div>

                  {/* Right Action */}
                  <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6">
                    {booking.businessId?._id && (
                      <Link
                        href={`/businesses/${booking.businessId._id}`}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:text-navy text-xs font-semibold hover:bg-slate-50 transition-colors w-full text-center"
                      >
                        View Profile
                      </Link>
                    )}

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold border border-red-200 transition-colors w-full text-center"
                      >
                        {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
