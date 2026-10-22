// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
"use client";
// RESPONSIBILITY: Renders the full-page Hero section with headline, CTA buttons,
// and the social proof stats strip below the CTAs. No context reads — pure presentation.
import Link from 'next/link';
import { ChevronDown, Play, ArrowRight } from 'lucide-react';
import { LandingUrlConfig } from '@/app/landing/landing_url_config';
import { STATS } from '@/app/landing/landing_utils/LandingSharedConstants';

export default function LandingHero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0" style={{ backgroundImage: `url('/gym-hero.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(20,10,0,0.8) 100%)' }} />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top, var(--landing-bg-dark), transparent)' }} />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
        {/* Welcome badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-warning mb-8">
          <span className="w-2 h-2 rounded-full bg-success motion-safe:animate-pulse" />
          Welcome to GymSmart
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6">
          <span className="text-white">Transform Your Body,</span>
          <br />
          <span style={{ background: 'var(--landing-text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Build Your Confidence
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          Join our premium fitness center with expert trainers, personalized workout plans, diet guidance, and modern equipment.{' '}
          <br className="hidden sm:block" />
          <strong className="text-white">Your fitness journey starts today.</strong>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href={LandingUrlConfig.ANCHORS.PLANS} className="px-8 py-4 text-white font-bold text-lg rounded-2xl transition-all hover:scale-105 hover:shadow-2xl flex items-center gap-2 w-full sm:w-auto justify-center bg-primary hover:bg-primary-hover" style={{ boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
            Start Journey <ArrowRight size={20} />
          </Link>
          <Link href={LandingUrlConfig.ANCHORS.BOOKING} className="px-8 py-4 font-bold text-lg rounded-2xl border-2 border-border text-white hover:bg-white/10 transition-all flex items-center gap-2 w-full sm:w-auto justify-center backdrop-blur-sm">
            <Play size={20} className="text-primary" fill="currentColor" /> Book Trial
          </Link>
          <Link href={LandingUrlConfig.ANCHORS.CONTACT} className="px-8 py-4 font-bold text-lg rounded-2xl border-2 border-border text-secondary hover:bg-white/5 transition-all flex items-center gap-2 w-full sm:w-auto justify-center backdrop-blur-sm">
            Contact Us
          </Link>
        </div>

        {/* Stats strip — uses STATS from LandingSharedConstants (Violation 11 fix) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-secondary mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 motion-safe:animate-bounce z-10">
        <ChevronDown size={28} className="text-white/50" />
      </div>
    </section>
  );
}

