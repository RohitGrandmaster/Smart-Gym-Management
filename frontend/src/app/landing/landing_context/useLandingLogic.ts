// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Encapsulates ALL stateful logic for the Landing page.
// Returns a plain object consumed by LandingProvider → LandingContext.
// This file contains ONLY state + handlers — zero JSX.
//
// DATA FLOW: LandingSharedConstants (EMPTY_*) → useState → handlers (useCallback)
//            → return value → LandingProvider → useLandingContext() → leaf components
//
// Rule 6: All JSX has been removed. Rule 15: All handlers are memoized with useCallback.
// Rule 37: JSDoc on each exported function and non-obvious handler.
import { useState, useEffect, useCallback } from 'react';
import type { LandingContextType, BmiResult } from '@/app/landing/landing_types/landing_types';
import { EMPTY_BOOKING_FORM, EMPTY_CONTACT_FORM } from '@/app/landing/landing_utils/LandingSharedConstants';
import { landingApi } from '@/app/landing/landing_api/landing_api';

/**
 * Core logic hook for the Landing page. Aggregates all reactive state
 * (navbar scroll, BMI calculator, booking form, contact form) into a single
 * stable object that is memoized by LandingProvider before being passed to context.
 */
export function useLandingLogic(): LandingContextType {
  // ── Navbar state ──────────────────────────────────────────────────────── //
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ── BMI Calculator state ──────────────────────────────────────────────── //
  const [weight,    setWeight]    = useState('');
  const [height,    setHeight]    = useState('');
  const [bmiResult, setBmiResult] = useState<BmiResult | null>(null);

  // ── Booking Form state ────────────────────────────────────────────────── //
  const [isBooking,      setIsBooking]      = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData,    setBookingData]    = useState(EMPTY_BOOKING_FORM);

  // ── Contact Form state ────────────────────────────────────────────────── //
  const [isSending,      setIsSending]      = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactData,    setContactData]    = useState(EMPTY_CONTACT_FORM);

  // ── Scroll effect (navbar background change) ──────────────────────────── //
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  /**
   * Calculates BMI from the current height/weight state values.
   * Sets bmiResult with the computed value, status label, and a CSS class name
   * (colorClass) that maps to a .bmi-result--* rule in landing.css.
   */
  const calculateBMI = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !height) return;
    const h   = parseFloat(height) / 100;
    const w   = parseFloat(weight);
    const bmi = w / (h * h);

    let status:     string;
    let colorClass: string;

    if (bmi < 18.5)                       { status = 'Underweight';   colorClass = 'bmi-result--underweight'; }
    else if (bmi >= 18.5 && bmi < 24.9)  { status = 'Normal Weight'; colorClass = 'bmi-result--normal';      }
    else if (bmi >= 25    && bmi < 29.9)  { status = 'Overweight';    colorClass = 'bmi-result--overweight';  }
    else                                  { status = 'Obese';         colorClass = 'bmi-result--obese';       }

    setBmiResult({ value: bmi.toFixed(1), status, colorClass });
  }, [weight, height]);

  /**
   * Handles booking form submission. Simulates API call with a 1.5s timeout.
   * Clears the form and shows the success state for 5 seconds on completion.
   */
  const handleBooking = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.name || !bookingData.email || !bookingData.phone || !bookingData.date) return;
    
    setIsBooking(true);
    try {
      await landingApi.submitBooking({
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        date: bookingData.date,
        type: bookingData.type,
      });
      
      setBookingSuccess(true);
      setBookingData(EMPTY_BOOKING_FORM);
      setTimeout(() => setBookingSuccess(false), 5000);
    } catch (error) {
      // apiFetch handles toast.error automatically
      // Silently handled in state
    } finally {
      setIsBooking(false);
    }
  }, [bookingData]);

  /**
   * Handles contact form submission. Simulates API call with a 1.5s timeout.
   * Clears the form and shows the success state for 5 seconds on completion.
   */
  const handleContact = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email || !contactData.message) return;
    
    setIsSending(true);
    try {
      await landingApi.submitContact({
        name: contactData.name,
        email: contactData.email,
        message: contactData.message,
      });
      
      setContactSuccess(true);
      setContactData(EMPTY_CONTACT_FORM);
      setTimeout(() => setContactSuccess(false), 5000);
    } catch (error) {
      // Silently handled in state
    } finally {
      setIsSending(false);
    }
  }, [contactData]);

  return {
    menuOpen, setMenuOpen, scrolled,
    weight, setWeight, height, setHeight, bmiResult, calculateBMI,
    isBooking, bookingSuccess, bookingData, setBookingData, handleBooking,
    isSending, contactSuccess, contactData, setContactData, handleContact,
  };
}

