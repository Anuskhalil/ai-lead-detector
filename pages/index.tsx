// pages/index.tsx
// Main application page - ties everything together

import React, { useState } from 'react';
import Head from 'next/head';
import { DetectionResult } from '../types';
import InputSection from '../components/InputSection';
import ResultsList from '../components/ResultsList';

export default function Home() {
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles single website detection
   */
  const handleDetect = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Detecting website:', url);

      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Detection failed');
      }

      const result: DetectionResult = await response.json();
      console.log('Detection result:', result);

      // Add new result to the beginning of the list
      setResults((prev) => [result, ...prev]);
    } catch (err: any) {
      console.error('Detection error:', err);
      setError(err.message || 'Failed to detect website. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles bulk location-based detection
   */
  const handleBulkDetect = async (location: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Bulk detecting location:', location);

      const response = await fetch('/api/detect-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Bulk detection failed');
      }

      const data = await response.json();
      console.log('Bulk detection results:', data);

      // Add all new results to the list
      setResults((prev) => [...data.results, ...prev]);
    } catch (err: any) {
      console.error('Bulk detection error:', err);
      setError(err.message || 'Failed to scan location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AI Lead Detection Engine</title>
        <meta name="description" content="Detect agency service opportunities by analyzing websites" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AI Lead Detection Engine
            </h1>
            <p className="text-slate-400">
              Automatically detect agency service opportunities by analyzing websites
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-700 rounded-lg p-4">
              <p className="text-red-400">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          {/* Input Section */}
          <InputSection
            onDetect={handleDetect}
            onBulkDetect={handleBulkDetect}
            loading={loading}
          />

          {/* Results Section */}
          <ResultsList results={results} />
        </div>
      </div>
    </>
  );
}