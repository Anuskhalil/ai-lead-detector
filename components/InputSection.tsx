// components/InputSection.tsx
// Input form for single URL or bulk location detection

import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface InputSectionProps {
  onDetect: (url: string) => Promise<void>;
  onBulkDetect: (location: string) => Promise<void>;
  loading: boolean;
}

export default function InputSection({ onDetect, onBulkDetect, loading }: InputSectionProps) {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [url, setUrl] = useState('');
  const [location, setLocation] = useState('');

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      await onDetect(url.trim());
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      await onBulkDetect(location.trim());
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6 mb-8">
      {/* Tab Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('single')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'single'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Single Website
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'bulk'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Bulk (Location-based)
        </button>
      </div>

      {/* Single Website Form */}
      {activeTab === 'single' && (
        <form onSubmit={handleSingleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Website URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={loading}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-slate-400 disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Website...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Detect Opportunities
              </>
            )}
          </button>
        </form>
      )}

      {/* Bulk Location Form */}
      {activeTab === 'bulk' && (
        <form onSubmit={handleBulkSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Location (City, State, Country)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="New York, NY, USA"
              disabled={loading}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-slate-400 disabled:opacity-50"
            />
          </div>
          
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
            <p className="text-sm text-slate-300">
              <strong>Note:</strong> This will scrape Google Maps for businesses in the specified location,
              extract their websites, and analyze each one for opportunities. This may take several minutes.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading || !location.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Scanning Location...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Scan Location
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}