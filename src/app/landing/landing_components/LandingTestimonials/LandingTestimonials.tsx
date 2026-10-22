// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
"use client";
// RESPONSIBILITY: Renders the Member Testimonials section — an aggregate rating card
// on the left and 4 individual review cards in a 2×2 grid on the right.
import { Star } from 'lucide-react';
import { TESTIMONIALS } from '@/app/landing/landing_utils/LandingSharedConstants';

export default function LandingTestimonials() {
  return (
    <section id="testimonials" className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            What Members{' '}
            <span style={{ background: 'var(--landing-text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Say
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Aggregate rating card */}
          <div className="lg:col-span-1 border border-primary/30 rounded-3xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden bg-primary/10">
            <div className="text-6xl font-black text-white mb-2">4.9</div>
            <div className="flex gap-1 justify-center mb-3 text-warning">
              {[1, 2, 3, 4, 5].map(s => <Star key={s} size={20} fill="currentColor" />)}
            </div>
            <p className="text-secondary">Based on 1,500+ reviews on Google & JustDial</p>
          </div>

          {/* Individual review cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-card border border-border rounded-3xl p-8 hover:border-warning/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-warning mb-4">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-secondary italic mb-6 leading-relaxed">&quot;{t.text}&quot;</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-secondary">{t.member}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

