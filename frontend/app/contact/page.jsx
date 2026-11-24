'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Your message has been sent to the NearMe team!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-bodyBg py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal uppercase tracking-widest">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
            Contact NearMe Consulting
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Have questions about booking, onboarding your practice, or platform integrations? Our advisory operations team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Card */}
          <div className="bg-navy text-white p-8 rounded-3xl space-y-8 flex flex-col justify-between shadow-xl">
            <div className="space-y-6">
              <h2 className="text-xl font-black">Support Headquarters</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect with our partnership support desk. We respond to all business and client queries within 4 business hours.
              </p>

              <div className="space-y-4 pt-2 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Main Tech Office</div>
                    <div className="text-slate-300">
                      Phase 1, Hinjawadi Rajiv Gandhi Infotech Park, Pune, Maharashtra 411057
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Direct Email</div>
                    <div className="text-slate-300">support@nearmeconsulting.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Toll-Free Helpline</div>
                    <div className="text-slate-300">+91 1800 200 4500</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Support Operating Hours</div>
                    <div className="text-slate-300">Monday – Saturday: 9:00 AM – 7:00 PM IST</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-teal block">For Consultants & Practices:</span>
              <span>Interested in listing your practice? Email partner@nearmeconsulting.com</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-navy">Send an Inquiry</h2>

            {submitted && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Thank you! Your inquiry has been received. Our team will get back to you shortly.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sameer Kulkarni"
                    required
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    required
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Inquiry about Practice Onboarding or Booking Reschedule"
                  required
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you today? Provide any relevant consultation reference numbers..."
                  required
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-teal hover:bg-teal-hover text-navy font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
