// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
"use client";
// RESPONSIBILITY: Root orchestrator for the Landing page. Bootstraps the LandingProvider
// context tree and renders all 15 section components in their natural scroll order.
// This file owns the module wrapper div, CSS import, and font setting — nothing else.
import '@/app/landing/landing.css';
import { LandingProvider } from '@/app/landing/landing_context/LandingContext';
import LandingNavbar from '@/app/landing/landing_components/LandingNavbar/LandingNavbar';
import LandingHero from '@/app/landing/landing_components/LandingHero/LandingHero';
import LandingAbout from '@/app/landing/landing_components/LandingAbout/LandingAbout';
import LandingBmiCalc from '@/app/landing/landing_components/LandingBmiCalc/LandingBmiCalc';
import LandingPlans from '@/app/landing/landing_components/LandingPlans/LandingPlans';
import LandingTrainers from '@/app/landing/landing_components/LandingTrainers/LandingTrainers';
import LandingServices from '@/app/landing/landing_components/LandingServices/LandingServices';
import LandingSchedule from '@/app/landing/landing_components/LandingSchedule/LandingSchedule';
import LandingGallery from '@/app/landing/landing_components/LandingGallery/LandingGallery';
import LandingBooking from '@/app/landing/landing_components/LandingBooking/LandingBooking';
import LandingTransformations from '@/app/landing/landing_components/LandingTransformations/LandingTransformations';
import LandingTestimonials from '@/app/landing/landing_components/LandingTestimonials/LandingTestimonials';
import LandingContact from '@/app/landing/landing_components/LandingContact/LandingContact';
import LandingFooter from '@/app/landing/landing_components/LandingFooter/LandingFooter';

function LandingContent() {
  return (
    <div className="min-h-screen landing-module bg-background text-foreground font-sans" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <LandingNavbar />
      <LandingHero />
      <LandingAbout />
      <LandingBmiCalc />
      <LandingPlans />
      <LandingTrainers />
      <LandingServices />
      <LandingSchedule />
      <LandingGallery />
      <LandingBooking />
      <LandingTransformations />
      <LandingTestimonials />
      <LandingContact />
      <LandingFooter />
    </div>
  );
}

export default function LandingMain() {
  return (
    <LandingProvider>
      <LandingContent />
    </LandingProvider>
  );
}

