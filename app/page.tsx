// app/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, Search, Mail, Brain, BarChart, Target, Users, 
  Shield, Sparkles, ArrowRight, ChevronRight, PlayCircle,
  LineChart, CheckCircle, Globe, Award, Rocket, Send,
  Filter, MousePointerClick, Bot, MessageSquare, Layout
} from 'lucide-react';

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Search,
      title: "Intelligent Lead Discovery",
      description: "AI-powered search across millions of websites to find businesses that need your services.",
      color: "blue",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "Deep Website Analysis",
      description: "Comprehensive audits for SEO, performance, tech stack, and growth opportunities.",
      color: "purple",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Mail,
      title: "AI-Powered Outreach",
      description: "Generate personalized emails that convert, powered by advanced language models.",
      color: "green",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: LineChart,
      title: "Performance Analytics",
      description: "Track conversions, engagement, and ROI with real-time dashboard insights.",
      color: "orange",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: Bot,
      title: "Automation Workflows",
      description: "Set up automated sequences for lead nurturing and follow-ups.",
      color: "indigo",
      gradient: "from-indigo-500 to-violet-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "GDPR compliant with bank-level encryption and secure data handling.",
      color: "red",
      gradient: "from-rose-500 to-red-500"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Define Your Target",
      description: "Set criteria like location, industry, and business size.",
      icon: Target
    },
    {
      number: "02",
      title: "AI Lead Discovery",
      description: "Our algorithms scan and identify high-potential leads.",
      icon: Search
    },
    {
      number: "03",
      title: "Smart Analysis",
      description: "Deep analysis of websites for actionable insights.",
      icon: Brain
    },
    {
      number: "04",
      title: "Convert with AI",
      description: "Personalized outreach that drives real conversions.",
      icon: Send
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director at GrowthHack",
      content: "LeadGen AI transformed our lead generation. We're seeing 3x more qualified leads with 70% less effort.",
      avatar: "SC"
    },
    {
      name: "Marcus Johnson",
      role: "CEO at Digital Agency Pro",
      content: "The AI analysis is incredibly accurate. It's like having a team of analysts working 24/7.",
      avatar: "MJ"
    },
    {
      name: "Alex Rodriguez",
      role: "Founder at TechScale",
      content: "Our conversion rates doubled in the first month. This platform pays for itself.",
      avatar: "AR"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">LeadGen AI</span>
                <span className="block text-xs text-gray-500 font-medium">by TechLabs</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <Link href="#features" className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors rounded-lg hover:bg-gray-50">
                Features
              </Link>
              <Link href="#how-it-works" className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors rounded-lg hover:bg-gray-50">
                How It Works
              </Link>
              <Link href="#testimonials" className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors rounded-lg hover:bg-gray-50">
                Testimonials
              </Link>
              <Link href="#pricing" className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors rounded-lg hover:bg-gray-50">
                Pricing
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden lg:inline-flex px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md group">
                Get Started
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-full border border-gray-200">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">AI-Powered Lead Generation</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Lead Generation
              <span className="block bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                with Artificial Intelligence
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Automatically discover high-quality leads, analyze their digital presence, and send personalized outreach that converts. Built for agencies that value results.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/register" className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-xl">
                Start 14-Day Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-700 font-semibold text-lg rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-lg">
                <PlayCircle className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <Users className="w-8 h-8 text-gray-700" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Agencies Trust Us</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <Target className="w-8 h-8 text-gray-700" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Accuracy Rate</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <Globe className="w-8 h-8 text-gray-700" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">AI Analysis</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
            {/* Browser Header */}
            <div className="bg-gray-900 px-6 py-4 flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 bg-gray-800 rounded-lg px-4 py-2">
                <div className="text-gray-400 text-sm font-mono">dashboard.leadgen.ai</div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-8 grid lg:grid-cols-2 gap-8">
              {/* Leads List */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900">Lead {i}</div>
                        <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Hot Lead
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">Lead score: 92/100</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analytics */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <BarChart className="w-6 h-6 text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">78%</div>
                      <div className="text-sm text-gray-600">Open Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">24%</div>
                      <div className="text-sm text-gray-600">Reply Rate</div>
                    </div>
                  </div>
                  <div className="h-32 bg-gradient-to-r from-gray-900/10 to-gray-900/5 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 text-gray-700">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold">CORE FEATURES</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="block text-gray-700">Scale Your Agency</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful AI tools designed to automate your lead generation process and drive real results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 transition-transform duration-500 group-hover:scale-110`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <div className="flex items-center gap-2 text-gray-700 font-medium group/link">
                  <span>Learn more</span>
                  <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 text-gray-700">
              <Rocket className="w-5 h-5" />
              <span className="text-sm font-semibold">SIMPLE WORKFLOW</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and start generating qualified leads immediately.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="relative inline-flex mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-gray-900/5 rounded-full blur-md" />
                    <div className="relative w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                      {step.number}
                    </div>
                  </div>
                  <div className="inline-flex p-3 rounded-xl bg-gray-100 mb-4">
                    <step.icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 text-gray-700">
              <Award className="w-5 h-5" />
              <span className="text-sm font-semibold">TRUSTED BY AGENCIES</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Loved by Marketing Teams
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
                <div className="flex gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Sparkles key={star} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              START YOUR JOURNEY
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Transform Your
              <br />
              <span className="text-gray-300">Lead Generation?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Join hundreds of agencies already scaling their business with AI-powered lead generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1">
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link href="/demo" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-white font-semibold text-lg rounded-xl border-2 border-white/30 hover:border-white/50 hover:bg-white/10 transition-all duration-300">
                <PlayCircle className="w-5 h-5" />
                Watch Demo
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>14-day free trial</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-bold">LeadGen AI</div>
                  <div className="text-sm text-gray-400">AI-Powered Lead Generation</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Automating lead generation for forward-thinking agencies.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Product</h3>
              <ul className="space-y-3">
                {['Features', 'How It Works', 'Pricing', 'API Docs', 'Status'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                {['About', 'Careers', 'Blog', 'Contact', 'Partners'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Legal</h3>
              <ul className="space-y-3">
                {['Privacy', 'Terms', 'Security', 'GDPR', 'Compliance'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-gray-400 text-sm">
                © 2024 LeadGen AI. All rights reserved.
              </div>
              <div className="text-gray-400 text-sm">
                Built for agencies that value results
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}