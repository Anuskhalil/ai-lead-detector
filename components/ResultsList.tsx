// components/ResultsList.tsx
// Displays list of all detection results with export functionality

import React from 'react';
import { Download, Search } from 'lucide-react';
import { DetectionResult } from '../types';
import ResultCard from './ResultCard';
import { exportToCSV } from '../utils/export';

interface ResultsListProps {
  results: DetectionResult[];
}

export default function ResultsList({ results }: ResultsListProps) {
  if (results.length === 0) {
    return (
      <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-12 text-center">
        <Search className="w-16 h-16 mx-auto mb-4 text-slate-600" />
        <h3 className="text-xl font-bold mb-2 text-slate-400">No Results Yet</h3>
        <p className="text-slate-500">
          Enter a website URL or location above to start detecting opportunities
        </p>
      </div>
    );
  }

  const highQualityLeads = results.filter((r) => r.leadQuality === 'HIGH').length;
  const mediumQualityLeads = results.filter((r) => r.leadQuality === 'MEDIUM').length;
  const lowQualityLeads = results.filter((r) => r.leadQuality === 'LOW').length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Detection Results</h2>
          <button
            onClick={() => exportToCSV(results)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Total Scanned</p>
            <p className="text-2xl font-bold text-white">{results.length}</p>
          </div>
          <div className="bg-green-900/30 rounded-lg p-4">
            <p className="text-sm text-green-400 mb-1">High Quality</p>
            <p className="text-2xl font-bold text-green-400">{highQualityLeads}</p>
          </div>
          <div className="bg-yellow-900/30 rounded-lg p-4">
            <p className="text-sm text-yellow-400 mb-1">Medium Quality</p>
            <p className="text-2xl font-bold text-yellow-400">{mediumQualityLeads}</p>
          </div>
          <div className="bg-red-900/30 rounded-lg p-4">
            <p className="text-sm text-red-400 mb-1">Low Quality</p>
            <p className="text-2xl font-bold text-red-400">{lowQualityLeads}</p>
          </div>
        </div>
      </div>

      {/* Results Cards */}
      <div className="space-y-6">
        {results.map((result, index) => (
          <ResultCard key={index} result={result} />
        ))}
      </div>
    </div>
  );
}