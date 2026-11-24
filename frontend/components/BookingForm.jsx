'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Briefcase
} from 'lucide-react';

const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM'
];

export default function BookingForm({ initialBusinessId = null }) {
  const router = useRouter();
  const { user } = useAuth();

  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(
    initialBusinessId || ''
  );
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  // Form Fields
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [service, setService] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [locationType, setLocationType] = useState('Online Video Consultation');
  const [requirements, setRequirements] = useState('');

  // Statuses
  const [checkingSlot, setCheckingSlot] = useState(false);
  const [slotAvailable, setSlotAvailable] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Min date today
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name || '');
      if (!email) setEmail(user.email || '');
      if (!phone && user.phone) setPhone(user.phone || '');
    }
  }, [user]);

  const fetchBusinesses = async () => {
    try {
      const res = await api.get('/api/businesses?limit=50');
      if (res.data?.success) {
        setBusinesses(res.data.data);
        if (initialBusinessId) {
          const match = res.data.data.find((b) => b._id === initialBusinessId);
          if (match) {
            setSelectedBusiness(match);
            setSelectedBusinessId(match._id);
            if (match.services && match.services.length > 0) {
              setService(match.services[0]);
            }
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load businesses for booking:', err);
    }
  };

  const handleBusinessChange = (bId) => {
    setSelectedBusinessId(bId);
    const found = businesses.find((b) => b._id === bId);
    setSelectedBusiness(found);
    if (found && found.services && found.services.length > 0) {
      setService(found.services[0]);
    }
    setSlotAvailable(null);
  };

  // Check availability when business, date, or time changes
  useEffect(() => {
    if (selectedBusinessId && bookingDate && bookingTime) {
      checkAvailability();
    } else {
      setSlotAvailable(null);
    }
  }, [selectedBusinessId, bookingDate, bookingTime]);

  const checkAvailability = async () => {
    setCheckingSlot(true);
    try {
      const res = await api.get('/api/bookings/check-availability', {
        params: {
          businessId: selectedBusinessId,
          bookingDate,
          bookingTime
        }
      });
      if (res.data?.success) {
        setSlotAvailable(res.data.available);
        if (!res.data.available) {
          toast.error(
            'This time slot has already been reserved. Please pick another time slot.'
          );
        }
      }
    } catch (err) {
      console.warn('Slot check warning:', err.message);
    } finally {
      setCheckingSlot(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!selectedBusinessId) {
      toast.error('Please select a consulting business');
      return;
    }
    if (!service) {
      toast.error('Please choose an advisory service');
      return;
    }
    if (!bookingDate || !bookingTime) {
      toast.error('Please select both a date and time slot');
      return;
    }
    if (bookingDate < todayStr) {
      toast.error('Booking date cannot be in the past');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      toast.error('Please provide a valid 10-digit phone number');
      return;
    }
    if (slotAvailable === false) {
      toast.error('The selected time slot is not available. Please choose another slot.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        businessId: selectedBusinessId,
        customerName: customerName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        service,
        bookingDate,
        bookingTime,
        location: locationType,
        requirements: requirements.trim()
      };

      const res = await api.post('/api/bookings', payload);

      if (res.data?.success) {
        toast.success('Consultation booked successfully!');
        setConfirmedBooking(res.data.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to confirm booking');
    } finally {
      setSubmitting(false);
    }
  };

  // If already confirmed, render confirmation view
  if (confirmedBooking) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl text-center max-w-2xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-teal/15 text-teal flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Booking Confirmed
          </span>
          <h2 className="text-2xl font-black text-navy">
            Consultation Reserved Successfully!
          </h2>
          <p className="text-xs text-slate-500">
            A confirmation email has been logged. Your consultation slot is securely reserved in MongoDB.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="p-5 rounded-2xl bg-bodyBg border border-slate-200 text-left space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500">Booking Reference:</span>
            <span className="font-mono font-bold text-navy bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              {confirmedBooking.bookingReference}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Practice:</span>
            <span className="font-bold text-navy">
              {confirmedBooking.businessId?.name || selectedBusiness?.name}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Service:</span>
            <span className="font-medium text-slate-800">
              {confirmedBooking.service}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Scheduled Date & Time:</span>
            <span className="font-bold text-teal">
              {confirmedBooking.bookingDate} at {confirmedBooking.bookingTime}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Client:</span>
            <span className="font-medium text-slate-800">
              {confirmedBooking.customerName} ({confirmedBooking.phone})
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Format:</span>
            <span className="font-medium text-slate-800">
              {confirmedBooking.location}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => router.push('/my-bookings')}
            className="w-full sm:w-auto px-6 py-2.5 bg-navy hover:bg-navy-light text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            View in My Bookings
          </button>
          <button
            onClick={() => {
              setConfirmedBooking(null);
              setBookingDate('');
              setBookingTime('');
              setRequirements('');
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Book Another Consultation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Business */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-navy uppercase tracking-wider">
            1. Select Consulting Business *
          </label>
          <select
            value={selectedBusinessId}
            onChange={(e) => handleBusinessChange(e.target.value)}
            required
            className="w-full p-3 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-navy focus:outline-none focus:border-teal"
          >
            <option value="">-- Choose a consulting practice --</option>
            {businesses.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name} — {b.category} ({b.city}) • Starts ₹{b.price}
              </option>
            ))}
          </select>
        </div>

        {/* Selected business preview snippet */}
        {selectedBusiness && (
          <div className="p-4 rounded-2xl bg-teal/5 border border-teal/20 flex items-center justify-between gap-4 text-xs">
            <div>
              <div className="font-bold text-navy">{selectedBusiness.name}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {selectedBusiness.address}, {selectedBusiness.city} • ★{' '}
                {selectedBusiness.rating}
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 block">Starting Fee</span>
              <span className="text-sm font-extrabold text-teal">
                ₹{selectedBusiness.price}
              </span>
            </div>
          </div>
        )}

        {/* Step 2: Select Service */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-navy uppercase tracking-wider">
            2. Consultation Service *
          </label>
          {selectedBusiness?.services && selectedBusiness.services.length > 0 ? (
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
              className="w-full p-3 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-navy focus:outline-none focus:border-teal"
            >
              {selectedBusiness.services.map((s, idx) => (
                <option key={idx} value={s}>
                  {s}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="e.g. Cloud Security Architecture, Startup Tax Filing"
              required
              className="w-full p-3 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
            />
          )}
        </div>

        {/* Step 3: Date & Time with Conflict Availability Checker */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-navy uppercase tracking-wider">
            3. Preferred Date & Time Slot *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="text-[11px] text-slate-500 mb-1">Date</div>
              <input
                type="date"
                min={todayStr}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
                className="w-full p-3 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
              />
            </div>

            <div>
              <div className="text-[11px] text-slate-500 mb-1">Time Slot</div>
              <select
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                required
                className="w-full p-3 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
              >
                <option value="">-- Choose time slot --</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Slot availability feedback */}
          {selectedBusinessId && bookingDate && bookingTime && (
            <div className="pt-1">
              {checkingSlot ? (
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border-2 border-teal border-t-transparent animate-spin" />
                  <span>Checking consultant calendar availability...</span>
                </div>
              ) : slotAvailable === true ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Slot is available! You can proceed to confirm.</span>
                </div>
              ) : slotAvailable === false ? (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>
                    Slot is occupied. Please select another time or date to avoid scheduling conflicts.
                  </span>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Step 4: Contact Details */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-navy uppercase tracking-wider">
            4. Your Contact Details *
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <div className="text-[11px] text-slate-500 mb-1">Full Name</div>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Vikram Mehta"
                required
                className="w-full p-3 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
              />
            </div>

            <div>
              <div className="text-[11px] text-slate-500 mb-1">Email Address</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full p-3 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
              />
            </div>

            <div>
              <div className="text-[11px] text-slate-500 mb-1">Phone Number</div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile"
                required
                className="w-full p-3 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
              />
            </div>
          </div>
        </div>

        {/* Step 5: Format & Requirements */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-navy uppercase tracking-wider">
            5. Consultation Format & Specific Requirements
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer flex items-center gap-2 ${
                locationType === 'Online Video Consultation'
                  ? 'border-teal bg-teal/10 text-navy'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <input
                type="radio"
                name="format"
                value="Online Video Consultation"
                checked={locationType === 'Online Video Consultation'}
                onChange={(e) => setLocationType(e.target.value)}
                className="accent-teal"
              />
              <span>Online Video Consultation (Google Meet / Zoom)</span>
            </label>

            <label
              className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer flex items-center gap-2 ${
                locationType === 'In-Person Practice Visit'
                  ? 'border-teal bg-teal/10 text-navy'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <input
                type="radio"
                name="format"
                value="In-Person Practice Visit"
                checked={locationType === 'In-Person Practice Visit'}
                onChange={(e) => setLocationType(e.target.value)}
                className="accent-teal"
              />
              <span>In-Person Practice Visit</span>
            </label>
          </div>

          <div>
            <textarea
              rows={3}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Briefly describe what you'd like to achieve during the consultation..."
              className="w-full p-3 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-teal" />
            <span>Instant database reservation • No upfront deposit</span>
          </div>

          <button
            type="submit"
            disabled={submitting || slotAvailable === false}
            className="px-8 py-3 bg-teal hover:bg-teal-hover disabled:opacity-50 text-navy font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <span>{submitting ? 'Confirming Reservation...' : 'Confirm Consultation'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
