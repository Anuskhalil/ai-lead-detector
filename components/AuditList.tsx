// components/AuditList.tsx
'use client';

import { useEffect, useState } from 'react';
import { LeadAudit } from '../app/lib/types';
import AuditCard from './AuditCard';
import { Loader2, RefreshCw, Filter, Download, TrendingUp, Search } from 'lucide-react';

interface AuditListProps {
  refreshTrigger: number;
}

export default function AuditList({ refreshTrigger }: AuditListProps) {
  const [audits, setAudits] = useState<LeadAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Audited' | 'Email Sent'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/audit');
      const data = await response.json();

      if (data.success) {
        setAudits(data.data);
      }
    } catch (error) {
      console.error('Error fetching audits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, [refreshTrigger]);

  const filteredAudits = audits.filter(audit => {
    const matchesFilter = filter === 'all' || audit.status === filter;
    const matchesSearch = audit.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         audit.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: audits.length,
    sent: audits.filter(a => a.status === 'Email Sent').length,
    highScore: audits.filter(a => {
      const checks = [
        a.webServices.seoTagsPresent,
        a.webServices.isMobileResponsive,
        a.automation.hasChatbot,
        a.automation.hasVoiceAssistant,
        a.automation.hasSocialBot
      ];
      const passed = checks.filter(Boolean).length;
      return Math.round((passed / checks.length) * 100) >= 70;
    }).length
  };

  return (
    <div>
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-white to-primary-50 rounded-2xl p-6 mb-8 border border-primary-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-8 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full" />
              <h2 className="text-3xl font-bold text-gray-900">Audit Results</h2>
            </div>
            <p className="text-gray-600">
              Comprehensive analysis of all audited businesses
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200 min-w-[120px]">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                Total Audits
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200 min-w-[120px]">
              <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Emails Sent
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200 min-w-[120px]">
              <div className="text-2xl font-bold text-accent-600">{stats.highScore}</div>
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <div className="w-2 h-2 bg-accent-500 rounded-full" />
                High Scores
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-glass border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search audits by business or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <div className="absolute left-3 top-3.5">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {/* Filter buttons */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('Audited')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'Audited'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Audited
              </button>
              <button
                onClick={() => setFilter('Email Sent')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'Email Sent'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sent
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={fetchAudits}
                disabled={loading}
                className="p-3 bg-white border border-gray-300 rounded-xl hover:border-primary-300 transition-all disabled:opacity-50 hover:shadow-sm"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={() => {/* Export functionality */}}
                className="p-3 bg-white border border-gray-300 rounded-xl hover:border-primary-300 transition-all hover:shadow-sm flex items-center gap-2"
              >
                <Download className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading audits...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching the latest results</p>
        </div>
      ) : filteredAudits.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg mb-2">No audits found</p>
          <p className="text-gray-400 text-sm mb-6">
            {searchQuery ? 'Try a different search term' : 'Start by creating your first audit above'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredAudits.length}</span> of{' '}
              <span className="font-semibold">{audits.length}</span> audits
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Score ≥ 70</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                <span>Score 40-69</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>Score &lt; 40</span>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAudits.map((audit) => (
              <AuditCard key={audit._id} audit={audit} onEmailSent={fetchAudits} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}