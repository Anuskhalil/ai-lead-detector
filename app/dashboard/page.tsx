// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AuditForm from '@/components/AuditForm';
import AuditList from '@/components/AuditList';
import { Zap, LogOut, User } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleAuditComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Zap className="text-accent-500 w-10 h-10" />
                <h1 className="text-3xl font-bold">AI Lead Gen Dashboard</h1>
              </div>
              <p className="text-primary-100">
                Welcome back, {session.user?.name}! 👋
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
                <User className="w-5 h-5" />
                <span className="text-sm">{session.user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-primary-200 rounded-2xl p-6 shadow-lg">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {refreshTrigger}
            </div>
            <div className="text-sm text-gray-600">Audits Created</div>
          </div>
          
          <div className="bg-white border-2 border-green-200 rounded-2xl p-6 shadow-lg">
            <div className="text-4xl font-bold text-green-600 mb-2">
              ∞
            </div>
            <div className="text-sm text-gray-600">Available Credits</div>
          </div>
          
          <div className="bg-white border-2 border-accent-200 rounded-2xl p-6 shadow-lg">
            <div className="text-4xl font-bold text-accent-600 mb-2">
              AI
            </div>
            <div className="text-sm text-gray-600">Powered by Google Gemini</div>
          </div>
        </div>

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
            You're logged in as {session.user?.email}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            © 2024 AI Lead Gen & Agency Auditor
          </p>
        </div>
      </footer>
    </div>
  );
}