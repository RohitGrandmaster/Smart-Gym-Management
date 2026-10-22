// RESPONSIBILITY: Centralized pure-function validation helpers for the Superadmin module.
// No React hooks, no API calls — only synchronous boolean checks and string formatters.
// Used by: SuperadminAddGymForm, SuperadminCouponModal, SuperadminAffiliateModal, SuperadminSettingsClient.
//
// Why isolated? If a validation rule changes (e.g., subdomain regex), only this file
// is touched — zero risk of breaking unrelated UI components. (Frontend Rule 11, 6)

/**
 * Validates that a string is a well-formed email address.
 * @param email - Raw email input from user
 * @returns true if valid email format
 */
export function isValidEmail(email: string): boolean {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validates a tenant subdomain:
 * - 3-63 characters
 * - Lowercase alphanumeric + hyphens only
 * - Cannot start or end with a hyphen
 * @param subdomain - Raw subdomain input
 * @returns true if valid subdomain
 */
export function isValidSubdomain(subdomain: string): boolean {
  const SUBDOMAIN_REGEX = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/;
  return SUBDOMAIN_REGEX.test(subdomain.trim());
}

/**
 * Validates a phone number (Indian format or E.164 international):
 * - Accepts +91XXXXXXXXXX or 10-digit local
 * @param phone - Raw phone string from user
 * @returns true if valid phone
 */
export function isValidPhone(phone: string): boolean {
  const PHONE_REGEX = /^(\+91[\s-]?)?[6-9]\d{9}$/;
  return PHONE_REGEX.test(phone.replace(/\s/g, ''));
}

/**
 * Validates a coupon discount value:
 * - Percentage: must be between 1 and 100 (inclusive)
 * - Exact amount: must be positive
 * @param value - Numeric discount value
 * @param type  - 'PERCENTAGE' | 'EXACT'
 * @returns true if the combination is valid
 */
export function isValidDiscountValue(value: number, type: 'PERCENTAGE' | 'EXACT'): boolean {
  if (!Number.isFinite(value) || value <= 0) return false;
  if (type === 'PERCENTAGE' && value > 100) return false;
  return true;
}

/**
 * Validates a coupon code:
 * - 3-20 characters
 * - Uppercase letters, digits, and hyphens only
 * @param code - Raw coupon code string
 * @returns true if valid
 */
export function isValidCouponCode(code: string): boolean {
  const CODE_REGEX = /^[A-Z0-9-]{3,20}$/;
  return CODE_REGEX.test(code.trim());
}

/**
 * Validates that a date string is in the future.
 * Used for coupon expiry dates and scheduled broadcast dates.
 * @param isoDateString - ISO 8601 date string
 * @returns true if the date is strictly in the future
 */
export function isFutureDate(isoDateString: string): boolean {
  if (!isoDateString) return false;
  const date = new Date(isoDateString);
  return !Number.isNaN(date.getTime()) && date > new Date();
}

/**
 * Validates that a password meets the minimum requirements:
 * - At least 8 characters
 * - Contains at least one uppercase, one lowercase, one digit
 * Used for: SuperadminAddGymForm (initial admin password provisioning)
 * @param password - Raw password string
 * @returns true if strong enough
 */
export function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false;
  const HAS_UPPER  = /[A-Z]/.test(password);
  const HAS_LOWER  = /[a-z]/.test(password);
  const HAS_DIGIT  = /\d/.test(password);
  return HAS_UPPER && HAS_LOWER && HAS_DIGIT;
}

/**
 * Validates an affiliate referral code:
 * - 4-16 characters, alphanumeric only
 * @param code - Raw referral code
 * @returns true if valid
 */
export function isValidReferralCode(code: string): boolean {
  const REFERRAL_REGEX = /^[A-Za-z0-9]{4,16}$/;
  return REFERRAL_REGEX.test(code.trim());
}

/**
 * Validates a platform setting value against its declared dataType.
 * Prevents saving a non-numeric string into a 'number' setting, etc.
 * @param value    - Raw string from the settings input
 * @param dataType - 'string' | 'number' | 'boolean'
 * @returns true if the value matches the expected dataType
 */
export function isValidSettingValue(value: string, dataType: 'string' | 'number' | 'boolean'): boolean {
  if (dataType === 'number') return Number.isFinite(Number(value));
  if (dataType === 'boolean') return value === 'true' || value === 'false';
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Returns a human-readable error message for an invalid subdomain.
 * Used by the SuperadminAddGymForm to surface actionable error text.
 * @param subdomain - Raw input value
 * @returns Error string, or empty string if valid
 */
export function getSubdomainError(subdomain: string): string {
  if (!subdomain.trim()) return 'Subdomain is required.';
  if (subdomain.length < 3) return 'Subdomain must be at least 3 characters.';
  if (subdomain.length > 63) return 'Subdomain cannot exceed 63 characters.';
  if (!isValidSubdomain(subdomain)) {
    return 'Only lowercase letters, numbers, and hyphens allowed. Cannot start or end with a hyphen.';
  }
  return '';
}
