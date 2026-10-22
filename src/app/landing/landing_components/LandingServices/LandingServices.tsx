// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
"use client";
// RESPONSIBILITY: Renders the Services & Programs section as a 3-column card grid.
// Each card icon uses a static CSS class (s.colorClass) from landing.css, avoiding
// dynamic Tailwind class string construction which defeats Tailwind's purge scanner.
import { SERVICES } from '@/app/landing/landing_utils/LandingSharedConstants';

export default function LandingServices() {
  return (
    <section id="services" className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block text-xs font-bold tracking-widest uppercase text-warning bg-warning/10 border border-warning/20 rounded-full px-4 py-2 mb-5">
            Our Programs
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Services{' '}
            <span style={{ background: 'var(--landing-text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              & Programs
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <div key={s.title} className="bg-card border border-border rounded-2xl p-6 hover:border-warning/30 hover:bg-white/10 transition-all group">
              {/* colorClass maps to .landing-service-icon--* in landing.css (Violation 1/10 fix) */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${s.colorClass}`}>
                <s.icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="text-secondary text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

