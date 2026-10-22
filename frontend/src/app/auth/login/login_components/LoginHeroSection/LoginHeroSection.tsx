// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders the premium visual hero panel for the login page (desktop only, hidden on mobile).
// Uses CSS animations defined inline for the animated gradient mesh background.
// All text content is sourced from LoginSharedConstants — never inline strings here.
import Image from 'next/image';
import { CheckCircle2, TrendingUp, Users, Zap } from 'lucide-react';
import { LoginSharedConstants } from '@/app/auth/login/login_constants/LoginSharedConstants';

const HERO_ICONS = [TrendingUp, Users, Zap];

export default function LoginHeroSection() {
  return (
    <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden flex-col justify-between p-12 bg-sidebar">
      {/* ── Animated gradient mesh background ── */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 80% 70% at 10% 20%, var(--primary) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 90% 80%, var(--info) 0%, transparent 55%)',
          }}
        />
        {/* Floating orbs */}
        <div
          className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background: 'var(--primary)',
            top: '-10%',
            right: '-5%',
            animation: 'floatOrb1 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{
            background: 'var(--info)',
            bottom: '10%',
            left: '5%',
            animation: 'floatOrb2 16s ease-in-out infinite',
          }}
        />
        {/* Grid lines overlay */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.04,
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* ── Gym hero photo with overlay ── */}
      <div className="absolute inset-0">
        <Image
          src={LoginSharedConstants.ASSETS.HERO_IMAGE}
          alt="Gym"
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>

      {/* ── TOP: Brand ── */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl overflow-hidden shadow-lg shadow-primary/30 ring-1 ring-primary/40">
          <Image
            src={LoginSharedConstants.ASSETS.LOGO}
            alt={LoginSharedConstants.TEXT.BRAND}
            width={44}
            height={44}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-xl font-black text-primary leading-none">{LoginSharedConstants.TEXT.BRAND}</p>
          <p className="text-xs font-medium text-secondary uppercase tracking-widest mt-0.5">
            {LoginSharedConstants.TEXT.BRAND_TAGLINE}
          </p>
        </div>
      </div>

      {/* ── MIDDLE: Hero copy + feature bullets ── */}
      <div className="relative z-10 space-y-8">
        {/* Headline */}
        <div>
          <h2 className="text-5xl font-black text-primary leading-tight tracking-tight">
            {LoginSharedConstants.TEXT.TITLE}
            <br />
            <span
              className="bg-clip-text text-transparent bg-gradient-to-br from-primary to-blue-500"
            >
              {LoginSharedConstants.TEXT.SUBTITLE}
            </span>
          </h2>
          <p className="mt-4 text-base text-secondary leading-relaxed max-w-sm">
            The all-in-one gym management platform trusted by fitness businesses across India.
          </p>
        </div>

        {/* Feature bullets */}
        <ul className="space-y-3">
          {LoginSharedConstants.HERO_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <CheckCircle2 size={17} className="text-success flex-shrink-0" />
              <span className="text-sm text-secondary">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Glass stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {LoginSharedConstants.HERO_STATS.map((stat, i) => {
            const Icon = HERO_ICONS[i];
            return (
              <div
                key={stat.label}
                className="rounded-xl border border-border p-4 flex flex-col gap-2"
                style={{
                  background: 'rgba(26, 26, 46, 0.6)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <Icon size={16} className="text-primary" />
                <p className="text-2xl font-black text-primary leading-none">{stat.value}</p>
                <p className="text-xs font-medium text-secondary uppercase tracking-wide leading-tight">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM: Trust badge ── */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-success/30 bg-success-bg/40 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-success motion-safe:animate-pulse" />
          <span className="text-xs font-semibold text-success">{LoginSharedConstants.TEXT.SECURE_BADGE}</span>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 20px) scale(1.1); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -25px) scale(1.08); }
        }
      `}</style>
    </div>
  );
}

