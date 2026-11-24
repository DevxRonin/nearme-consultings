'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '../../../services/api';
import BusinessCard from '../../../components/BusinessCard';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Send,
  Award,
  ChevronLeft
} from 'lucide-react';

export default function BusinessDetailsPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchBusinessDetails();
  }, [id]);

  useEffect(() => {
    if (user?.name && !reviewerName) {
      setReviewerName(user.name);
    }
  }, [user]);

  const fetchBusinessDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/businesses/${id}`);
      if (res.data?.success) {
        setBusiness(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load business details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post('/api/reviews', {
        businessId: business._id,
        userName: reviewerName.trim() || 'Verified Client',
        rating: Number(rating),
        comment: comment.trim()
      });

      if (res.data?.success) {
        toast.success('Thank you! Your review has been published.');
        setComment('');
        fetchBusinessDetails();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bodyBg py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500">
            Loading consultant profile...
          </p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-bodyBg py-16 flex items-center justify-center">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-bold text-navy mb-2">Practice Not Found</h2>
          <p className="text-xs text-slate-500 mb-6">
            The requested consulting firm profile could not be located or has been archived.
          </p>
          <Link
            href="/explore"
            className="px-4 py-2 bg-teal text-navy font-bold text-xs rounded-xl shadow-sm hover:bg-teal-hover transition-colors"
          >
            Browse Other Consultants
          </Link>
        </div>
      </div>
    );
  }

  const defaultImg =
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';
  const coverImg =
    business.images && business.images.length > 0 ? business.images[0] : defaultImg;

  return (
    <div className="min-h-screen bg-bodyBg pb-16">
      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/explore" className="hover:text-teal flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Directory</span>
          </Link>
          <span>/</span>
          <span className="text-slate-400">{business.category}</span>
          <span>/</span>
          <span className="text-navy font-bold truncate max-w-[250px]">
            {business.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* HERO CARD */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Cover image banner */}
          <div className="relative h-64 sm:h-80 w-full bg-slate-900">
            <img
              src={coverImg}
              alt={business.name}
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent" />

            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="bg-teal text-navy font-bold text-xs px-3 py-1.5 rounded-full shadow-md">
                {business.category}
              </span>
              {business.isVerified && (
                <span className="bg-white/90 backdrop-blur text-navy font-semibold text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            {/* Title & Key Stats on Banner Bottom */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {business.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal" />
                    {business.address}, {business.city}
                  </span>
                  <span className="flex items-center gap-1 bg-white/10 backdrop-blur px-2.5 py-1 rounded-lg text-gold font-bold">
                    <Star className="w-3.5 h-3.5 fill-gold" />
                    {business.rating} ({business.reviewCount || 10} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-teal" />
                    {business.experienceYears || 8}+ Years Experience
                  </span>
                </div>
              </div>

              {/* Price & Primary CTA */}
              <div className="bg-navy-light/90 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 shrink-0">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-300">
                    Consultation Fee
                  </div>
                  <div className="text-xl font-black text-teal">
                    ₹{business.price}{' '}
                    <span className="text-xs font-normal text-slate-300">/ session</span>
                  </div>
                </div>
                <Link
                  href={`/book/${business._id}`}
                  className="px-5 py-2.5 bg-teal hover:bg-teal-hover text-navy font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Slot</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLS: OVERVIEW, SERVICES, REVIEWS */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-navy">About the Practice</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {business.description}
              </p>
            </div>

            {/* Available Services */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-navy">
                Specialized Consulting Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(business.services || []).map((service, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-bodyBg border border-slate-200/80 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-navy">{service}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        One-on-one tailored advisory with actionable deliverables.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Reviews Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-navy">
                    Client Reviews & Ratings
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(business.rating)
                              ? 'fill-gold'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-navy">
                      ★ {business.rating}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({business.reviews?.length || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Reviews Listing */}
              <div className="space-y-4">
                {business.reviews && business.reviews.length > 0 ? (
                  business.reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-navy">
                          {rev.userName}
                        </div>
                        <div className="flex items-center gap-0.5 text-gold text-xs">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-gold" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        "{rev.comment}"
                      </p>
                      <div className="text-[10px] text-slate-400">
                        {rev.createdAt
                          ? new Date(rev.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'Recent Client'}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    No client reviews submitted yet. Be the first to share your experience!
                  </p>
                )}
              </div>

              {/* Add Review Form */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-teal" />
                  <span>Leave a Verified Review</span>
                </h3>

                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="e.g. Rahul Patil"
                        required
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        Rating (1 to 5 Stars)
                      </label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
                      >
                        <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                        <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                        <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                        <option value={2}>★★☆☆☆ (2 Stars - Below Expectation)</option>
                        <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Your Detailed Feedback
                    </label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your consultation experience, practical outcomes, and advisor insights..."
                      required
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2.5 bg-navy hover:bg-teal hover:text-navy text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? 'Submitting...' : 'Submit Review'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT COL: QUICK DETAILS & BOOKING CARD */}
          <div className="space-y-6">
            {/* Quick Contact & Hours Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-navy pb-3 border-b border-slate-100">
                Practice Contact & Working Hours
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5 text-slate-600">
                  <Clock className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-navy block">Office Hours</span>
                    <span>{business.workingHours || 'Mon - Sat: 9:00 AM - 7:00 PM'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-slate-600">
                  <Phone className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-navy block">Phone Advisory</span>
                    <span>{business.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-slate-600">
                  <Mail className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-navy block">Official Email</span>
                    <span className="break-all">{business.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-slate-600">
                  <MapPin className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-navy block">Office Address</span>
                    <span>{business.address}, {business.city}, {business.state}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={`/book/${business._id}`}
                  className="w-full py-3 bg-teal hover:bg-teal-hover text-navy font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve Consultation Now</span>
                </Link>
              </div>
            </div>

            {/* Related Businesses */}
            {business.relatedBusinesses && business.relatedBusinesses.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-navy pb-2 border-b border-slate-100">
                  Similar {business.category} Experts
                </h3>
                <div className="space-y-3">
                  {business.relatedBusinesses.map((rel) => (
                    <Link
                      key={rel._id}
                      href={`/businesses/${rel._id}`}
                      className="p-3 rounded-2xl bg-bodyBg border border-slate-200/80 hover:border-teal/50 hover:bg-white transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-xs font-bold text-navy group-hover:text-teal transition-colors">
                          {rel.name}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {rel.city} • ★ {rel.rating}
                        </div>
                      </div>
                      <div className="text-xs font-extrabold text-navy">
                        ₹{rel.price}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
