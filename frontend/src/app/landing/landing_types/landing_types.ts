// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Defines ALL TypeScript interfaces and types for the Landing module.
// Every shape used by LandingContext, useLandingLogic, and form components is declared here.
// Rule 7: Never define interfaces inside component files.
import React from 'react';
import { EMPTY_BOOKING_FORM, EMPTY_CONTACT_FORM } from '@/app/landing/landing_utils/LandingSharedConstants';

/** BMI calculation result shape. colorClass maps to a .bmi-result--* class in landing.css. */
export interface BmiResult {
  value:      string;
  status:     string;
  colorClass: string; // e.g. 'bmi-result--normal' — see landing.css
}

/** Full shape of the LandingContext value. Consumed by all landing sub-components. */
export interface LandingContextType {
  // Navbar state
  menuOpen:    boolean;
  setMenuOpen: (open: boolean) => void;
  scrolled:    boolean;

  // BMI state
  weight:       string;
  setWeight:    (w: string) => void;
  height:       string;
  setHeight:    (h: string) => void;
  bmiResult:    BmiResult | null;
  calculateBMI: (e: React.FormEvent) => void;

  // Booking state
  isBooking:       boolean;
  bookingSuccess:  boolean;
  bookingData:     typeof EMPTY_BOOKING_FORM;
  setBookingData:  React.Dispatch<React.SetStateAction<typeof EMPTY_BOOKING_FORM>>;
  handleBooking:   (e: React.FormEvent) => void;

  // Contact state
  isSending:      boolean;
  contactSuccess: boolean;
  contactData:    typeof EMPTY_CONTACT_FORM;
  setContactData: React.Dispatch<React.SetStateAction<typeof EMPTY_CONTACT_FORM>>;
  handleContact:  (e: React.FormEvent) => void;
}

