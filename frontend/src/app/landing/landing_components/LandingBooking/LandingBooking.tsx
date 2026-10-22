// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
"use client";
// RESPONSIBILITY: Renders the Online Booking section with a 3-option radio selector
// (Trial / Membership / Class Slot) and a booking form. Reads/writes state via LandingContext.
// Section uses the .landing-booking-section CSS class (no arbitrary hex values).
import { CheckCircle, Ticket, CreditCard, Calendar, ArrowRight } from 'lucide-react';
import { useLandingContext } from '@/app/landing/landing_context/LandingContext';

export default function LandingBooking() {
  const { bookingSuccess, isBooking, bookingData, setBookingData, handleBooking } = useLandingContext();

  return (
    // landing-booking-section replaces bg-gradient-to-br from-background to-[#1a1a1a] (Violation 7 fix)
    <section id="booking" className="py-24 px-4 landing-booking-section">
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-block text-xs font-bold tracking-widest uppercase text-warning bg-warning/10 border border-warning/20 rounded-full px-4 py-2 mb-5">
            Quick Action
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Online{' '}
            <span style={{ background: 'var(--landing-text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Booking
            </span>
          </h2>
          <p className="text-secondary max-w-xl mx-auto">
            Book your trial, buy membership, or reserve a slot online in seconds.
          </p>
        </div>

        <div className="bg-black border border-border rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {bookingSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center motion-safe:animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="text-success" size={40} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h3>
              <p className="text-secondary">
                Thank you for choosing GymSmart. Our team will contact you shortly to confirm the details.
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleBooking}>
              {/* Booking type selector */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {([
                  { value: 'trial',      icon: Ticket,     label: 'Book Trial' },
                  { value: 'membership', icon: CreditCard, label: 'Buy Membership' },
                  { value: 'class',      icon: Calendar,   label: 'Reserve Class Slot' },
                ] as const).map(({ value, icon: Icon, label }) => (
                  <label key={value} className="cursor-pointer">
                    <input type="radio" name="booking_type" value={value} checked={bookingData.type === value} onChange={e => setBookingData({ ...bookingData, type: e.target.value })} className="peer sr-only" />
                    <div className="bg-card border border-border rounded-xl p-4 text-center peer-checked:border-warning peer-checked:bg-warning/10 transition-all">
                      <Icon className="mx-auto mb-2 text-warning" size={24} />
                      <span className="font-semibold text-white">{label}</span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-xs font-medium text-secondary block mb-2">Full Name <span className="text-danger">*</span></label>
                  <input type="text" required value={bookingData.name} onChange={e => setBookingData({ ...bookingData, name: e.target.value })} placeholder="John Doe" className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white placeholder-muted-foreground focus:outline-none focus:border-warning transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-medium text-secondary block mb-2">Email Address <span className="text-danger">*</span></label>
                  <input type="email" required pattern=".*\.com$" title="Email must end with .com" value={bookingData.email} onChange={e => setBookingData({ ...bookingData, email: e.target.value })} placeholder="john@example.com" className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white placeholder-muted-foreground focus:outline-none focus:border-warning transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-secondary block mb-2">Phone / WhatsApp <span className="text-danger">*</span></label>
                  <div className="flex bg-card border border-border rounded-xl focus-within:border-warning focus-within:ring-1 focus-within:ring-warning transition-colors overflow-hidden">
                    <span className="flex items-center justify-center px-4 bg-muted/20 text-secondary border-r border-border text-sm font-medium">
                      +91
                    </span>
                    <input 
                      type="tel" 
                      required 
                      value={bookingData.phone} 
                      onChange={e => {
                        // Strip all non-numeric characters and limit to 10 digits
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setBookingData({ ...bookingData, phone: val });
                      }} 
                      onKeyDown={(e) => {
                        if (['e', 'E', '-', '+', '.'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      maxLength={10}
                      placeholder="9876543210" 
                      className="w-full px-4 py-3 bg-transparent text-white placeholder-muted-foreground focus:outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-secondary block mb-2">Preferred Date <span className="text-danger">*</span></label>
                  <input type="date" min={new Date().toISOString().split('T')[0]} required value={bookingData.date} onChange={e => setBookingData({ ...bookingData, date: e.target.value })} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white placeholder-muted-foreground focus:outline-none focus:border-warning transition-colors [&::-webkit-calendar-picker-indicator]:filter-invert" />
                </div>
              </div>

              <button type="submit" disabled={isBooking} className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all hover:scale-105 hover:shadow-2xl mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 bg-primary hover:bg-primary-hover" style={{ boxShadow: isBooking ? 'none' : '0 0 30px rgba(99,102,241,0.3)' }}>
                {isBooking ? 'Processing...' : <><span>Proceed to Book</span> <ArrowRight size={18} /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

