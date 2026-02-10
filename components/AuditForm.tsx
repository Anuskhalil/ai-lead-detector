// components/AuditForm.tsx
'use client';

import { useState } from 'react';
import { Search, MapPin, Loader2, Globe, Building2, Sparkles, Target } from 'lucide-react';

interface AuditFormProps {
  onAuditComplete: (result: any) => void;
}

export default function AuditForm({ onAuditComplete }: AuditFormProps) {
  const [mode, setMode] = useState<'single' | 'location'>('single');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);

  const validateUrl = (url: string) => {
    if (mode !== 'single') return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (mode === 'single' && value) {
      setIsValidUrl(validateUrl(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'single' && !isValidUrl && input) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

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
        setIsValidUrl(true);
        onAuditComplete(data.data);
        if (mode === 'location') {
          // Show success toast instead of alert
          showNotification(`Successfully created ${data.data.length} audits!`, 'success');
        } else {
          showNotification('Audit completed successfully!', 'success');
        }
      } else {
        setError(data.error || 'Failed to perform audit');
        showNotification(data.error || 'Failed to perform audit', 'error');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      showNotification('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    // You can integrate a toast notification library here
    // For now, using console.log
    console.log(`${type}: ${message}`);
  };

  const examples = {
    single: [
      'https://example.com',
      'https://businesswebsite.com',
      'https://restaurantonline.com'
    ],
    location: [
      'Dentists in San Francisco',
      'Coffee shops in New York',
      'Law firms in Chicago',
      'Restaurants in Austin'
    ]
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-accent-500/10 to-primary-500/10 rounded-full blur-3xl" />

      <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-3xl p-6 md:p-8 shadow-2xl shadow-primary-500/5">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Start New Audit
              </h2>
              <p className="text-gray-600 mt-1">
                Analyze websites or discover businesses by location
              </p>
            </div>
          </div>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setMode('single')}
            className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
              mode === 'single'
                ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-25 shadow-lg shadow-primary-500/10'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50/50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                mode === 'single'
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                  : 'bg-gray-100 group-hover:bg-primary-100'
              }`}>
                <Globe className={`w-6 h-6 ${
                  mode === 'single' ? 'text-gray-600' : 'text-gray-600 group-hover:text-primary-600'
                }`} />
              </div>
              {mode === 'single' && (
                <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
              )}
            </div>
            
            <h3 className={`text-lg font-bold mb-2 ${
              mode === 'single' ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
            }`}>
              Single Website
            </h3>
            <p className="text-sm text-gray-600">
              Analyze a specific website for technical SEO, performance, and automation opportunities
            </p>
            
            {mode === 'single' && (
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-5 h-5 text-primary-500" />
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMode('location')}
            className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
              mode === 'location'
                ? 'border-accent-500 bg-gradient-to-br from-accent-50 to-accent-25 shadow-lg shadow-accent-500/10'
                : 'border-gray-200 hover:border-accent-300 hover:bg-gray-50/50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                mode === 'location'
                  ? 'bg-gradient-to-br from-accent-500 to-accent-600'
                  : 'bg-gray-100 group-hover:bg-accent-100'
              }`}>
                <Building2 className={`w-6 h-6 ${
                  mode === 'location' ? 'text-gray-600' : 'text-gray-600 group-hover:text-accent-600'
                }`} />
              </div>
              {mode === 'location' && (
                <div className="w-3 h-3 bg-accent-500 rounded-full animate-pulse" />
              )}
            </div>
            
            <h3 className={`text-lg font-bold mb-2 ${
              mode === 'location' ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
            }`}>
              Location Search
            </h3>
            <p className="text-sm text-gray-600">
              Discover up to 10 businesses in a specific location and analyze them automatically
            </p>
            
            {mode === 'location' && (
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-5 h-5 text-accent-500" />
              </div>
            )}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                {mode === 'single' ? 'Website URL' : 'Location Query'}
              </label>
              <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                {mode === 'single' ? 'URL Required' : 'Search Required'}
              </span>
            </div>
            
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                {mode === 'single' ? (
                  <Globe className="w-5 h-5 text-gray-400" />
                ) : (
                  <MapPin className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={
                  mode === 'single'
                    ? 'Enter website URL (e.g., https://example.com)'
                    : 'What businesses and where? (e.g., "Dentists in San Francisco")'
                }
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                  error && !isValidUrl
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : 'border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'
                } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                required
                disabled={loading}
              />
              {input && mode === 'single' && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {isValidUrl ? (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  ) : (
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </div>
              )}
            </div>

            {/* Examples */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2 font-medium">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {examples[mode].map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setInput(example)}
                    className="text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Helper Text */}
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
              {mode === 'single' ? (
                <>
                  <Search className="w-3 h-3" />
                  Enter a complete website URL including https://
                </>
              ) : (
                <>
                  <MapPin className="w-3 h-3" />
                  Be specific for better results (e.g., "Italian restaurants in Boston")
                </>
              )}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="animate-slide-up bg-gradient-to-r from-red-50 to-red-25 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-4 h-4 bg-red-500 rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-800">{error}</p>
                  <p className="text-xs text-red-600 mt-1">
                    Please check your input and try again
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !input.trim() || (mode === 'single' && !isValidUrl)}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group cursor-pointer ${
              loading || !input.trim() || (mode === 'single' && !isValidUrl)
                ? 'bg-gray-200 text-black cursor-not-allowed'
                : mode === 'single'
                ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-black shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-black shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                <span className="relative z-10">
                  {mode === 'location' ? 'Discovering businesses...' : 'Analyzing website...'}
                </span>
              </>
            ) : (
              <>
                {mode === 'single' ? (
                  <Search className="w-5 h-5 relative z-10" />
                ) : (
                  <MapPin className="w-5 h-5 relative z-10" />
                )}
                <span className="relative z-10">
                  {mode === 'location' ? 'Discover & Analyze' : 'Start Analysis'}
                </span>
              </>
            )}
          </button>

          {/* Features Indicator */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-600">Fast Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-600">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-600">Detailed Reports</span>
              </div>
            </div>
          </div>
        </form>

        {/* Quick Stats */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary-600">99%</div>
              <div className="text-xs text-gray-500">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-accent-600">3 min</div>
              <div className="text-xs text-gray-500">Avg. Time</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">24/7</div>
              <div className="text-xs text-gray-500">Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}