// app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { 
  Zap, Loader2, Mail, Lock, Eye, EyeOff, 
  ArrowRight, Sparkles, CheckCircle, X,
  Brain, Target
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Account created successfully! Please sign in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-white">
      {/* Close button */}
      <Link
        href="/"
        className="fixed top-6 right-6 z-50 p-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm"
      >
        <X className="w-5 h-5 text-gray-600" />
      </Link>

      {/* Left Panel - Info */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-900 to-gray-800 p-12">
        <div className="w-full max-w-md mx-auto flex flex-col justify-center">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">LeadGen AI</div>
                <div className="text-sm text-gray-300">AI-Powered Lead Generation</div>
              </div>
            </Link>

            <h2 className="text-3xl font-bold text-white mb-6">
              Welcome Back
              <br />
              <span className="text-gray-300">Continue Your Journey</span>
            </h2>

            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">AI-Powered Analysis</h4>
                  <p className="text-gray-300 text-sm">Smart website auditing</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">High-Quality Leads</h4>
                  <p className="text-gray-300 text-sm">95% accuracy rate</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <div className="text-gray-300 text-sm">
                500+ agencies trust LeadGen AI for their growth
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">LeadGen AI</span>
                <span className="block text-xs text-gray-500">by TechLabs</span>
              </div>
            </Link>
          </div>

          {/* Form */}
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-full border border-gray-200">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Welcome Back</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Sign In to Your Account
              </h1>
              <p className="text-gray-600">
                Access your AI-powered lead generation tools
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-700 text-sm">{successMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all placeholder:text-gray-400"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded border flex items-center justify-center ${rememberMe ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}
                >
                  {rememberMe && <CheckCircle className="w-4 h-4 text-white" />}
                </button>
                <span className="text-sm text-gray-600">Remember me for 30 days</span>
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Register link */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link href="/register" className="text-gray-900 font-medium hover:underline">
                  Sign up for free
                </Link>
              </p>
            </div>

            {/* Security */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
              <CheckCircle className="w-4 h-4" />
              <span>Your data is protected with enterprise security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}