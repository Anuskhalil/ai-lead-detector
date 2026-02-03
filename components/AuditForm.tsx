// components/AuditForm.tsx
'use client';

import { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface AuditFormProps {
  onAuditComplete: () => void;
}

export default function AuditForm({ onAuditComplete }: AuditFormProps) {
  const [mode, setMode] = useState<'single' | 'location'>('single');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode, input }),
      });

      const data = await response.json();

      if (data.success) {
        setInput('');
        onAuditComplete();
        if (mode === 'location') {
          alert(`✅ Created ${data.data.length} audits!`);
        }
      } else {
        setError(data.error || 'Failed to perform audit');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-primary-50 border-2 border-primary-200 rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        🔍 Start New Audit
      </h2>

      {/* Mode Toggle */}
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setMode('single')}
          className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
            mode === 'single'
              ? 'bg-primary-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-primary-300'
          }`}
        >
          <Search className="w-5 h-5" />
          Single Website
        </button>
        <button
          type="button"
          onClick={() => setMode('location')}
          className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
            mode === 'location'
              ? 'bg-primary-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-primary-300'
          }`}
        >
          <MapPin className="w-5 h-5" />
          Location Search
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {mode === 'single' ? 'Website URL' : 'Location Query'}
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'single'
                ? 'https://example.com'
                : 'Coffee shops in New York'
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-2">
            {mode === 'single'
              ? 'Enter a website URL to audit'
              : 'Example: "Dentists in San Francisco" (finds up to 10 businesses)'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {mode === 'location' ? 'Finding businesses...' : 'Analyzing...'}
            </>
          ) : (
            <>
              {mode === 'single' ? <Search className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
              Start Audit
            </>
          )}
        </button>
      </form>
    </div>
  );
}