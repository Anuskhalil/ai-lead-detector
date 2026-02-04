// app/page.tsx

import Link from 'next/link';
import { Zap, Search, Mail, TrendingUp, Shield, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="text-accent-500 w-8 h-8" />
            <h1 className="text-2xl font-bold text-gray-900">LeadGen AI</h1>
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium transition-all shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-block mb-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
          🚀 AI-Powered Lead Generation
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Find Leads, Audit Websites,<br />
          <span className="text-primary-600">Send Perfect Pitches</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Automatically discover businesses that need your services, analyze their websites, 
          and generate personalized outreach emails powered by AI. Close more deals with less effort.
        </p>

        <div className="flex gap-4 justify-center mb-12">
          <Link
            href="/register"
            className="px-8 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Free Trial
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 font-bold text-lg transition-all border-2 border-gray-200"
          >
            See How It Works
          </Link>
        </div>

        <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span>500+ agencies using</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Generate Leads
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white border-2 border-primary-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="bg-primary-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Search className="text-primary-600 w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Smart Website Auditing
            </h3>
            <p className="text-gray-600 mb-4">
              Automatically analyze websites for SEO, mobile responsiveness, tech stack, 
              chatbots, and more. Identify exactly what they're missing.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>SEO & meta tag detection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Tech stack identification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Chatbot & automation analysis</span>
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border-2 border-accent-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="bg-accent-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="text-accent-600 w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Location-Based Search
            </h3>
            <p className="text-gray-600 mb-4">
              Find businesses in any location that need your services. 
              Search "Dentists in NYC" and get instant leads with contact info.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Google Maps integration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Bulk lead generation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Contact email extraction</span>
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border-2 border-green-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Mail className="text-green-600 w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              AI-Powered Outreach
            </h3>
            <p className="text-gray-600 mb-4">
              Generate personalized pitch emails with Google Gemini AI. 
              Each email is tailored to the specific problems you detected.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Google Gemini AI integration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Personalized for each lead</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>One-click email sending</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-600">
                1
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600 text-sm">
                Create your free account in seconds
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-600">
                2
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Find Leads</h3>
              <p className="text-gray-600 text-sm">
                Search by location or enter website URLs
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-600">
                3
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">AI Audit</h3>
              <p className="text-gray-600 text-sm">
                Our AI analyzes and identifies opportunities
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-600">
                4
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Send Pitches</h3>
              <p className="text-gray-600 text-sm">
                AI generates and sends perfect emails
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to 10x Your Lead Generation?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of agencies automating their outreach with AI
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-primary-600 rounded-xl hover:bg-gray-100 font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Free Trial →
          </Link>
          <p className="text-sm mt-4 opacity-75">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="text-accent-500 w-6 h-6" />
            <span className="text-xl font-bold">LeadGen AI</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 LeadGen AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}