'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../services/api';
import BusinessCard from '../../components/BusinessCard';
import toast from 'react-hot-toast';
import {
  Search,
  Filter,
  MapPin,
  Navigation,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Star,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'IT Consulting',
  'Business Consulting',
  'Financial Consulting',
  'Legal Consulting',
  'Career Consulting',
  'Marketing Consulting',
  'Management Consulting'
];

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [cityInput, setCityInput] = useState(searchParams.get('city') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'rating_desc');
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1', 10)
  );

  // Geolocation state
  const [userCoords, setUserCoords] = useState(
    searchParams.get('lat') && searchParams.get('lon')
      ? {
          lat: parseFloat(searchParams.get('lat')),
          lon: parseFloat(searchParams.get('lon'))
        }
      : null
  );
  const [radiusKm, setRadiusKm] = useState(searchParams.get('radius') || '25');
  const [isLocating, setIsLocating] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, [
    selectedCategory,
    minRating,
    maxPrice,
    sortBy,
    currentPage,
    userCoords,
    radiusKm
  ]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      if (userCoords) {
        // Use Nearby Geospatial endpoint
        const params = {
          latitude: userCoords.lat,
          longitude: userCoords.lon,
          radius: radiusKm,
          limit: 12
        };
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (maxPrice) params.maxPrice = maxPrice;
        if (minRating) params.minRating = minRating;

        const res = await api.get('/api/businesses/nearby', { params });
        if (res.data?.success) {
          setBusinesses(res.data.data);
          setTotalCount(res.data.count);
          setTotalPages(1);
        }
      } else {
        // Standard filter & search endpoint
        const params = {
          page: currentPage,
          limit: 9,
          sort: sortBy
        };
        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (cityInput.trim()) params.city = cityInput.trim();
        if (minRating) params.minRating = minRating;
        if (maxPrice) params.maxPrice = maxPrice;

        const res = await api.get('/api/businesses', { params });
        if (res.data?.success) {
          setBusinesses(res.data.data);
          setTotalCount(res.data.pagination.total);
          setTotalPages(res.data.pagination.totalPages);
        }
      }
    } catch (err) {
      toast.error('Could not load businesses: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBusinesses();
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    toast.loading('Acquiring precise GPS coordinates...', { id: 'gps' });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        };
        setUserCoords(coords);
        setIsLocating(false);
        toast.success('GPS coordinates locked! Showing nearest consultants.', {
          id: 'gps'
        });
      },
      (err) => {
        setIsLocating(false);
        toast.dismiss('gps');
        toast.error('Permission denied or location unavailable.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setCityInput('');
    setMinRating('');
    setMaxPrice('');
    setSortBy('rating_desc');
    setUserCoords(null);
    setCurrentPage(1);
    toast.success('Filters reset');
  };

  return (
    <div className="min-h-screen bg-bodyBg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-navy tracking-tight">
                Explore Consulting Businesses
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Discover, compare, and book verified consulting professionals across sectors.
              </p>
            </div>

            {/* Geolocation indicator / button */}
            <div className="flex items-center gap-3">
              {userCoords ? (
                <div className="flex items-center gap-2 bg-teal/15 text-teal border border-teal/30 px-3 py-1.5 rounded-xl text-xs font-semibold">
                  <Navigation className="w-3.5 h-3.5 fill-teal" />
                  <span>GPS Active ({radiusKm} km radius)</span>
                  <button
                    onClick={() => setUserCoords(null)}
                    className="text-navy hover:text-red-500 font-bold ml-1"
                    title="Clear GPS"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleUseLocation}
                  disabled={isLocating}
                  className="px-3.5 py-2 rounded-xl bg-navy text-teal hover:bg-navy-light text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Navigation
                    className={`w-3.5 h-3.5 text-teal ${isLocating ? 'animate-spin' : ''}`}
                  />
                  <span>Use My Location</span>
                </button>
              )}

              <button
                onClick={() => setShowMobileFilter(!showMobileFilter)}
                className="md:hidden px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-teal" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Quick Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-6 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-2.5"
          >
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl flex-1 border border-slate-200/60">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by practice name, keyword, or service..."
                className="w-full bg-transparent text-sm focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl sm:w-64 border border-slate-200/60">
              <MapPin className="w-4 h-4 text-teal shrink-0" />
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="City or area (e.g. Pune, Baner)"
                className="w-full bg-transparent text-sm focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-teal hover:bg-teal-hover text-navy font-bold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </form>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* DESKTOP FILTERS SIDEBAR */}
          <div
            className={`lg:block ${
              showMobileFilter ? 'block' : 'hidden'
            } space-y-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm h-fit sticky top-28`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-navy text-sm">
                <SlidersHorizontal className="w-4 h-4 text-teal" />
                <span>Filters & Preferences</span>
              </div>
              <button
                onClick={clearFilters}
                className="text-xs text-slate-400 hover:text-teal flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                Consulting Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* If GPS Active: Radius Filter */}
            {userCoords && (
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-navy uppercase tracking-wider mb-2">
                  <span>Search Radius</span>
                  <span className="text-teal font-extrabold">{radiusKm} km</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="1"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(e.target.value)}
                  className="w-full accent-teal cursor-pointer"
                />
              </div>
            )}

            {/* Minimum Rating */}
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                Minimum Client Rating
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: 'All', val: '' },
                  { label: '4.0+', val: '4.0' },
                  { label: '4.5+', val: '4.5' },
                  { label: '4.8+', val: '4.8' }
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setMinRating(item.val);
                      setCurrentPage(1);
                    }}
                    className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all ${
                      minRating === item.val
                        ? 'bg-navy text-teal border-navy'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Budget */}
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                Max Consultation Budget
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="e.g. 1000"
                  className="w-full p-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal"
                />
              </div>
              <div className="flex gap-1.5 mt-2">
                {[500, 800, 1000, 1500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setMaxPrice(preset.toString());
                      setCurrentPage(1);
                    }}
                    className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 hover:bg-teal/10 hover:text-teal"
                  >
                    ≤ ₹{preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                Sort Results By
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal"
              >
                <option value="rating_desc">Highest Rated (★ 5.0 - 1.0)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newly Listed</option>
              </select>
            </div>
          </div>

          {/* MAIN RESULTS FEED */}
          <div className="lg:col-span-3 space-y-6">
            {/* Results count & status bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 bg-white px-4 py-3 rounded-xl border border-slate-200">
              <div>
                Showing <strong className="text-navy">{businesses.length}</strong>{' '}
                of <strong className="text-navy">{totalCount}</strong> verified
                consulting practices
              </div>
              {userCoords && (
                <span className="text-teal font-semibold">
                  Filtered by GPS proximity
                </span>
              )}
            </div>

            {/* Loading Skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200"
                  />
                ))}
              </div>
            ) : businesses.length === 0 ? (
              /* Empty state */
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-navy">
                  No matching consultants found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  We could not find any consulting practices matching all your filter criteria. Try expanding your radius or adjusting your budget limit.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-teal text-navy font-bold text-xs rounded-xl shadow-sm hover:bg-teal-hover transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Grid of Cards */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((biz) => (
                  <BusinessCard key={biz._id} business={biz} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && !userCoords && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(totalPages)].map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        currentPage === pNum
                          ? 'bg-navy text-teal shadow-md'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-teal">
          Loading directory...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
