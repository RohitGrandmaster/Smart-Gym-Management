// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
"use client";
// RESPONSIBILITY: Renders the fixed top navigation bar for the landing page.
// Shows logo, anchor links, theme toggle, and CTA buttons. Reads scroll state
// from LandingContext to apply a blur/dark backdrop when user scrolls down.
// On mobile, renders a full-screen slide-down menu triggered by the hamburger icon.
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useLandingContext } from '@/app/landing/landing_context/LandingContext';
import { LandingUrlConfig } from '@/app/landing/landing_url_config';
import { ThemeToggle } from '@/components/ThemeToggle';

const NAV_LINKS = ['About', 'Plans', 'Trainers', 'Services', 'Schedule', 'Booking', 'Gallery'];

export default function LandingNavbar() {
  const { menuOpen, setMenuOpen, scrolled } = useLandingContext();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-20 transition-all duration-300 ${scrolled ? 'landing-navbar--scrolled' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="GymSmart" width={40} height={40} className="rounded-lg object-cover" />
          <div>
            <span className="font-bold text-lg text-white tracking-tight">GymSmart</span>
            <span className="text-xs text-warning block -mt-1 tracking-widest uppercase">Fitness ERP</span>
          </div>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-secondary">
          {NAV_LINKS.map(item => (
            <Link key={item} href={`#${item.toLowerCase()}`} className="hover:text-warning transition-colors">
              {item}
            </Link>
          ))}
        </div>

        {/* Desktop CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link href={LandingUrlConfig.PAGES.SAAS_LOGIN} className="text-sm font-medium text-warning hover:text-white transition-colors px-3 py-1.5 border border-warning/30 rounded-lg">
            Superadmin Login
          </Link>
          <Link href={LandingUrlConfig.PAGES.ERP_LOGIN} className="text-sm font-medium text-secondary hover:text-white transition-colors px-3 py-1.5">
            ERP Login
          </Link>
          <Link href={LandingUrlConfig.ANCHORS.BOOKING} className="text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-all hover:scale-105 bg-primary hover:bg-primary-hover">
            Join Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-secondary"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/98 border-t border-white/10 px-4 py-4 space-y-3 h-screen overflow-y-auto">
          {[...NAV_LINKS, 'Contact'].map(item => (
            <Link key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="block text-secondary hover:text-warning py-2 text-sm font-medium">
              {item}
            </Link>
          ))}
          <div className="flex gap-3 pt-2 flex-col">
            <Link href={LandingUrlConfig.PAGES.SAAS_LOGIN} className="w-full text-center border border-warning text-warning py-2.5 rounded-xl text-sm font-medium">
              Superadmin Login
            </Link>
            <Link href={LandingUrlConfig.PAGES.ERP_LOGIN} className="w-full text-center border border-white/20 py-2.5 rounded-xl text-sm font-medium text-secondary">
              ERP Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

