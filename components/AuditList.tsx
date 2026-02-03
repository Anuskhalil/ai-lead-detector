// components/AuditList.tsx
'use client';

import { useEffect, useState } from 'react';
import { LeadAudit } from '../app/lib/types';
import AuditCard from './AuditCard';
import { Loader2, RefreshCw } from 'lucide-react';

interface AuditListProps {
  refreshTrigger: number;
}

export default function AuditList({ refreshTrigger }: AuditListProps) {
  const [audits, setAudits] = useState<LeadAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Audited' | 'Email Sent'>('all');

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/audit');
      const data = await response.json();

      if (data.success) {
        const filteredAudits = filter === 'all' 
          ? data.data 
          : data.data.filter((audit: LeadAudit) => audit.status === filter);
        setAudits(filteredAudits);
      }
    } catch (error) {
      console.error('Error fetching audits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, [refreshTrigger, filter]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          📊 All Audits ({audits.length})
        </h2>
        
        <div className="flex gap-3 items-center">
          {/* Filter buttons */}
          <div className="flex gap-2 bg-white border-2 border-gray-200 rounded-xl p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('Audited')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'Audited'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Audited
            </button>
            <button
              onClick={() => setFilter('Email Sent')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'Email Sent'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Sent
            </button>
          </div>

          <button
            onClick={fetchAudits}
            disabled={loading}
            className="bg-white border-2 border-gray-200 p-3 rounded-xl hover:border-primary-300 transition-all disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : audits.length === 0 ? (
        <div className="text-center py-20 bg-white border-2 border-dashed border-gray-300 rounded-2xl">
          <p className="text-gray-500 text-lg">No audits found</p>
          <p className="text-gray-400 text-sm mt-2">Start by creating your first audit above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audits.map((audit) => (
            <AuditCard key={audit._id} audit={audit} onEmailSent={fetchAudits} />
          ))}
        </div>
      )}
    </div>
  );
}