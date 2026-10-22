// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
"use client";
// RESPONSIBILITY: Renders the About section — mission text, feature checklist on the left,
// and a 2×2 grid of stat cards on the right. All data from LandingSharedConstants.
// No context reads — pure presentation component.
import { CheckCircle } from 'lucide-react';
import { ABOUT_STATS_CARDS, ABOUT_FEATURES } from '@/app/landing/landing_utils/LandingSharedConstants';

export default function LandingAbout() {
  return (
    <section id="about" className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Mission text + feature list */}
          <div>
            <div className="inline-block text-xs font-bold tracking-widest uppercase text-warning bg-warning/10 border border-warning/20 rounded-full px-4 py-2 mb-5">
              About GymSmart
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6 leading-tight">
              Building Stronger <br />
              <span style={{ background: 'var(--landing-text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Communities since 2010
              </span>
            </h2>
            <h3 className="text-xl font-bold text-foreground mb-2">Our Mission & Vision</h3>
            <p className="text-secondary text-lg leading-relaxed mb-6">
              To inspire and empower our community to lead healthier, happier lives through premium fitness facilities, expert guidance, and a supportive environment.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {ABOUT_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-secondary">
                  <CheckCircle size={16} className="text-warning flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Right: 2×2 stat card grid */}
          <div className="grid grid-cols-2 gap-4">
            {ABOUT_STATS_CARDS.map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-2xl p-6 hover:border-warning/30 transition-all">
                {/* iconClass maps to a .landing-stat-icon--* gradient in landing.css (Rule 4/36) */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.iconClass}`}>
                  <s.icon size={22} className="text-white" />
                </div>
                <div className="text-3xl font-black text-foreground mb-1">{s.value}</div>
                <div className="text-secondary text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

