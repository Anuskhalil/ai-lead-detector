// app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Zap, Loader2, User, Mail, Lock, Eye, EyeOff, 
  ArrowRight, Sparkles, CheckCircle, Shield, X,
  Users, Target, Globe
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToMarketing, setAgreedToMarketing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          marketingEmails: agreedToMarketing,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/login?registered=true');
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
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

      {/* Form Section */}
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
                <span className="text-sm font-semibold">Start Free Trial</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Create Your Account
              </h1>
              <p className="text-gray-600">
                Join 500+ agencies already automating lead generation
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all placeholder:text-gray-400"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
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
                <p className="mt-2 text-xs text-gray-500">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                    className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${agreedToTerms ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}
                  >
                    {agreedToTerms && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>
                  <p className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-gray-900 font-medium hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-gray-900 font-medium hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => setAgreedToMarketing(!agreedToMarketing)}
                    className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${agreedToMarketing ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}
                  >
                    {agreedToMarketing && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>
                  <p className="text-sm text-gray-600">
                    Send me product updates and marketing emails
                  </p>
                </div>
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
                    Creating account...
                  </span>
                ) : (
                  'Start 14-Day Free Trial'
                )}
              </button>
            </form>

            {/* Login link */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-gray-900 font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Security */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Your data is securely encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Info */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-12">
        <div className="w-full max-w-md mx-auto flex flex-col justify-center">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">LeadGen AI</div>
                <div className="text-sm text-gray-600">AI-Powered Lead Generation</div>
              </div>
            </Link>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Join 500+ Agencies
              <br />
              <span className="text-gray-700">Growing with AI</span>
            </h2>

            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Users className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">500+ Agencies</h4>
                  <p className="text-gray-600 text-sm">Trusted by forward-thinking teams</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Target className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">95% Accuracy</h4>
                  <p className="text-gray-600 text-sm">AI-powered lead scoring</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Globe className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Global Reach</h4>
                  <p className="text-gray-600 text-sm">Analyze websites worldwide</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <div className="text-gray-500 text-sm">
                Start your free trial today. No credit card required.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}