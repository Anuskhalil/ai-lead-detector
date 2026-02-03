'use client';

import { useState } from 'react';
import AuditForm from '@/components/AuditForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function AuditPage() {
  const [auditResult, setAuditResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'single' | 'location'>('single');
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleLocationAudit = async (location: string) => {
    setLocationLoading(true);
    try {
      const response = await fetch('/api/audit/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location })
      });
      const result = await response.json();
      setLocationResults(result.data || []);
    } catch (error) {
      console.error('Location audit error:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Website Auditor</h1>
        <p className="text-gray-600 mt-2">Analyze websites and generate qualified leads</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('single')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'single'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MagnifyingGlassIcon className="h-5 w-5 inline mr-2" />
            Single Website Audit
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'location'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MapPinIcon className="h-5 w-5 inline mr-2" />
            Location-Based Audit
          </button>
        </nav>
      </div>

      {activeTab === 'single' ? (
        <>
          <AuditForm onAuditComplete={setAuditResult} />
          {auditResult && <ResultsDisplay data={auditResult} />}
        </>
      ) : (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit by Location</h3>
          <p className="text-gray-600 mb-6">
            Enter a city or region to find and audit multiple businesses in that area.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Location
              </label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="e.g., New York, NY or London, UK"
                  className="flex-1 input-field"
                  id="locationInput"
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('locationInput') as HTMLInputElement;
                    if (input.value) {
                      handleLocationAudit(input.value);
                    }
                  }}
                  disabled={locationLoading}
                  className="btn-primary px-6"
                >
                  {locationLoading ? 'Searching...' : 'Find Businesses'}
                </button>
              </div>
            </div>

            {locationResults.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">
                  Found {locationResults.length} businesses
                </h4>
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Business
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Website
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Phone
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Rating
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {locationResults.map((business, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                            {business.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <a
                              href={business.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-900"
                            >
                              Visit Site
                            </a>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {business.phone}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <span className="text-yellow-400">★</span>
                              <span className="ml-1">{business.rating}</span>
                              <span className="mx-1">•</span>
                              <span className="text-gray-500">{business.reviews} reviews</span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <button className="text-primary-600 hover:text-primary-900">
                              Audit Now
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}