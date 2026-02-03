'use client';

import { useState, useEffect } from 'react';
import LeadTable from '@/components/LeadTable';
import { FunnelIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const statuses = [
  { value: 'all', label: 'All Status', count: 0 },
  { value: 'new', label: 'New', count: 0 },
  { value: 'contacted', label: 'Contacted', count: 0 },
  { value: 'converted', label: 'Converted', count: 0 },
  { value: 'lost', label: 'Lost', count: 0 },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    minScore: 0,
    maxScore: 100,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    fetchLeads();
  }, [filters, pagination.page]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        status: filters.status,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const response = await fetch(`/api/leads?${queryParams}`);
      const result = await response.json();
      
      if (result.success) {
        setLeads(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({ ...prev, status }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-2">Manage and track all your generated leads</p>
        </div>
        <button className="btn-primary">
          Export Leads
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4 items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={filters.search}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-2.5">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {statuses.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => handleStatusChange(status.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      filters.status === status.value
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {status.label}
                    {status.count > 0 && (
                      <span className="ml-1 bg-white bg-opacity-50 px-1.5 py-0.5 rounded-full text-xs">
                        {status.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <FunnelIcon className="h-5 w-5 mr-1" />
              Filters
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900">Advanced Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Score
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.minScore}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      minScore: parseInt(e.target.value) 
                    }))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500">{filters.minScore}/100</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Score
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.maxScore}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      maxScore: parseInt(e.target.value) 
                    }))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500">{filters.maxScore}/100</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <select className="w-full input-field">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>All time</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No leads found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters or run a new audit.
              </p>
            </div>
          ) : (
            <>
              <LeadTable leads={leads} />
              
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span> of{' '}
                      <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              pagination.page === pageNum
                                ? 'z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}