// app/page.tsx
'use client';

import { useState } from 'react';
import AuditForm from '@/components/AuditForm';
import AuditList from '@/components/AuditList';
import { Zap } from 'lucide-react';

export default function HomePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAuditComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Zap className="text-accent-500 w-10 h-10" />
                AI Lead Gen & Auditor
              </h1>
              <p className="text-primary-100 text-lg">
                Automated lead generation and technical auditing for agencies
              </p>
            </div>
            
            <div className="hidden md:flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-500">
                  {refreshTrigger}
                </div>
                <div className="text-sm text-primary-100">Audits Run</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Audit Form */}
        <div className="animate-fade-in">
          <AuditForm onAuditComplete={handleAuditComplete} />
        </div>

        {/* Audit List */}
        <div className="animate-fade-in">
          <AuditList refreshTrigger={refreshTrigger} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-primary-100">
            Phase 4: Beautiful User Interface Complete! ✨
          </p>
        </div>
      </footer>
    </div>
  );
}