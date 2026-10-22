// RESPONSIBILITY: Renders the top banner with module title and save status indicator for the Settings page.
'use client';
import Link from 'next/link';

import { GYM_DETAILS } from '@/app/admin/admin_utils/AdminSharedConstants';

export default function AdminSettingsBanner() {
  return (
    <div className="rounded-xl p-6 text-white mt-6 shadow-lg shadow-primary/20" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))' }}>
      <h3 className="text-xl font-bold mb-2">Ready to take your Gym to the next level?</h3>
      <p className="text-white/90 mb-4">Get a FREE demo and see how GymSmart can transform your business</p>
      
      <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
        <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">Call or WhatsApp for FREE Demo</p>
        <p className="text-2xl font-black tracking-tight mb-4">{GYM_DETAILS.phone}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`https://wa.me/${GYM_DETAILS.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-card text-primary font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-colors shadow-sm">
            WhatsApp Demo
          </Link>
          <Link href={`tel:${GYM_DETAILS.phone.replace(/[^0-9+]/g, '')}`} className="flex-1 border border-white/30 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
            Call Now
          </Link>
        </div>
      </div>
    </div>
  );
}
