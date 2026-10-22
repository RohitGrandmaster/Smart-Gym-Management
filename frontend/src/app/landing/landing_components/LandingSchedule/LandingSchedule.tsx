// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
"use client";
// RESPONSIBILITY: Renders the Class Schedule section as a horizontally scrollable
// timetable showing 4 time slots × 7 days from LandingSharedConstants.SCHEDULE.
import { SCHEDULE } from '@/app/landing/landing_utils/LandingSharedConstants';

export default function LandingSchedule() {
  return (
    <section id="schedule" className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block text-xs font-bold tracking-widest uppercase text-warning bg-warning/10 border border-warning/20 rounded-full px-4 py-2 mb-5">
            Timetable
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Class{' '}
            <span style={{ background: 'var(--landing-text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Schedule
            </span>
          </h2>
          <p className="text-secondary max-w-xl mx-auto">
            Dynamic batches designed for morning and evening flexibility
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse bg-card rounded-2xl overflow-hidden border border-border">
            <thead>
              <tr className="bg-white/10 text-white">
                <th className="py-4 px-4 text-left font-semibold">Time</th>
                <th className="py-4 px-4 text-left font-semibold">Monday</th>
                <th className="py-4 px-4 text-left font-semibold">Tuesday</th>
                <th className="py-4 px-4 text-left font-semibold">Wednesday</th>
                <th className="py-4 px-4 text-left font-semibold">Thursday</th>
                <th className="py-4 px-4 text-left font-semibold">Friday</th>
                <th className="py-4 px-4 text-left font-semibold">Saturday</th>
                <th className="py-4 px-4 text-left font-semibold text-warning">Sunday</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {SCHEDULE.map((row) => (
                <tr key={row.time} className="hover:bg-white/5 transition-colors text-sm text-secondary">
                  <td className="py-4 px-4 font-semibold text-warning">{row.time}</td>
                  <td className="py-4 px-4">{row.monday}</td>
                  <td className="py-4 px-4">{row.tuesday}</td>
                  <td className="py-4 px-4">{row.wednesday}</td>
                  <td className="py-4 px-4">{row.thursday}</td>
                  <td className="py-4 px-4">{row.friday}</td>
                  <td className="py-4 px-4">{row.saturday}</td>
                  <td className="py-4 px-4 text-secondary">{row.sunday}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

