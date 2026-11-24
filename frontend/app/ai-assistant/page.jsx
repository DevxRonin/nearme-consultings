'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  Sparkles,
  Send,
  MapPin,
  Bot,
  User,
  Star,
  Navigation,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  HelpCircle
} from 'lucide-react';

const SUGGESTED_QUERIES = [
  'Find the best IT consultant near Pimpri under ₹1000',
  'Show top-rated financial and GST consultants',
  'Find career coaching and resume consultants in Wakad',
  'Recommend a corporate legal advisor in Shivaji Nagar',
  'Find consultants within 10 km under ₹800'
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text:
        "Hello! I am your NearMe AI Consulting Assistant. I analyze our verified database of local consulting firms to find the exact match for your domain, budget, and location.\n\nHow can I help you today? You can ask me to find top-rated IT advisors, career coaches, or financial consultants near you.",
      results: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const [userCoords, setUserCoords] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setDetectingLocation(true);
    toast.loading('Acquiring your location for precise nearby AI matching...', {
      id: 'gps-ai'
    });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords([pos.coords.longitude, pos.coords.latitude]);
        setUserLocation('Current GPS Location');
        setDetectingLocation(false);
        toast.success('Location active! AI will calculate real travel distances.', {
          id: 'gps-ai'
        });
      },
      (err) => {
        setDetectingLocation(false);
        toast.dismiss('gps-ai');
        toast.error('Location permission was denied. You can enter your city manually.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSend = async (queryText = null) => {
    const q = (queryText || input).trim();
    if (!q) return;

    const userMsg = {
      sender: 'user',
      text: q
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const payload = {
        question: q,
        location: userLocation,
        coordinates: userCoords
      };

      const res = await api.post('/api/ai/chat', payload);

      if (res.data?.success) {
        const aiMsg = {
          sender: 'ai',
          text: res.data.answer,
          results: res.data.results || [],
          parsedQuery: res.data.parsedQuery
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      const errMsg = {
        sender: 'ai',
        text:
          "I'm sorry, I encountered a temporary problem querying our database. Please try again or rephrase your request.",
        results: []
      };
      setMessages((prev) => [...prev, errMsg]);
      toast.error(err.message || 'AI request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bodyBg py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real Database Grounded AI Agent</span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy tracking-tight">
            NearMe AI Consulting Assistant
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Natural language discovery without hallucinations. Grounded strictly in our verified database.
          </p>
        </div>

        {/* Chat Container Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg flex flex-col h-[700px] overflow-hidden">
          {/* Top Bar of Chat with Location Setting */}
          <div className="p-4 bg-navy text-white flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal text-navy flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>NearMe AI Expert Matcher</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-slate-300">
                  Ready • Analyzes domain, budget, and GPS distance
                </div>
              </div>
            </div>

            {/* Location selector pill */}
            <div className="flex items-center gap-2 text-xs">
              <input
                type="text"
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                placeholder="Set location (e.g. Pimpri)"
                className="px-2.5 py-1 text-xs rounded-lg bg-white/10 border border-white/15 text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleLocateMe}
                disabled={detectingLocation}
                className="px-2.5 py-1 rounded-lg bg-teal text-navy font-bold text-xs flex items-center gap-1 hover:bg-teal-hover transition-colors"
                title="Detect GPS"
              >
                <Navigation
                  className={`w-3 h-3 ${detectingLocation ? 'animate-spin' : ''}`}
                />
                <span>GPS</span>
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-slate-50/50">
            {messages.map((msg, idx) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${
                    isAi ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {isAi && (
                    <div className="w-8 h-8 rounded-xl bg-navy text-teal flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                      isAi
                        ? 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                        : 'bg-navy text-white shadow-md'
                    }`}
                  >
                    {/* Render message with line breaks */}
                    <div className="whitespace-pre-line font-medium">
                      {msg.text}
                    </div>

                    {/* Grounded Matching Business Cards */}
                    {isAi && msg.results && msg.results.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="text-[11px] font-bold text-navy flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
                          <span>Matching Database Records:</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.results.map((biz) => (
                            <div
                              key={biz._id}
                              className="p-3 rounded-xl bg-bodyBg border border-slate-200/80 hover:border-teal/50 hover:bg-white transition-all flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="font-bold text-navy text-xs truncate">
                                    {biz.name}
                                  </span>
                                  <span className="text-[10px] font-bold text-teal shrink-0">
                                    ₹{biz.price}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-500 mb-2">
                                  {biz.city}
                                  {biz.distanceKm !== null &&
                                    biz.distanceKm !== undefined && (
                                      <span> • {biz.distanceKm} km away</span>
                                    )}{' '}
                                  • ★ {biz.rating}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                <Link
                                  href={`/businesses/${biz._id}`}
                                  className="text-[10px] text-slate-600 hover:text-navy font-semibold"
                                >
                                  View Profile
                                </Link>
                                <Link
                                  href={`/book/${biz._id}`}
                                  className="ml-auto px-2.5 py-1 bg-navy hover:bg-teal hover:text-navy text-white text-[10px] font-bold rounded-lg transition-colors"
                                >
                                  Book Slot
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {!isAi && (
                    <div className="w-8 h-8 rounded-xl bg-teal text-navy flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-navy text-teal flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Sparkles className="w-3.5 h-3.5 text-teal animate-spin" />
                    <span>Analyzing database, extracting intent and matching consultants...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggested Quick Queries Pills */}
          <div className="px-4 py-2.5 bg-slate-100/70 border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto custom-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-teal" /> Try:
            </span>
            {SUGGESTED_QUERIES.map((sq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(sq)}
                className="text-[11px] bg-white text-slate-700 px-3 py-1 rounded-full border border-slate-200 hover:border-teal hover:text-teal shrink-0 transition-colors shadow-2xs"
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Input Box Form */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask e.g. 'Best IT consultant near Hinjawadi under ₹1200'..."
                className="flex-1 p-3 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-5 py-3 bg-teal hover:bg-teal-hover disabled:opacity-40 text-navy font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
