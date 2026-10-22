// RESPONSIBILITY: Provides all number, currency, and date formatting utilities for the entire frontend.
// Implements the Indian Numbering System as required by Design System Rule 21.
// All modules must import from this file — never duplicate formatCurrency elsewhere.

/**
 * Formats a number as Indian Rupee currency using the Indian Numbering System.
 * e.g. 123456 → "₹1,23,456"
 * e.g. 1234567 → "₹12,34,567"
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return '₹' + amount.toLocaleString('en-IN');
}

/**
 * Alias for formatINR — used widely across the members and finance modules.
 */
export const formatCurrency = formatINR;

/**
 * Abbreviates large currency KPI numbers for dashboard stat cards.
 * e.g. 124000 → "₹1.2L"
 * e.g. 23000000 → "₹2.3Cr"
 */
export function formatKPI(amount: number): string {
  if (isNaN(amount)) return '₹0';
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(1)}Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)}L`;
  if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(1)}K`;
  return `₹${amount}`;
}

/**
 * Formats a percentage to 1 decimal place.
 * e.g. 0.125 → "12.5%"
 * e.g. 12.5 → "12.5%"
 */
export function formatPercent(value: number): string {
  if (isNaN(value)) return '0.0%';
  // If value is a fraction (0–1), multiply by 100
  const pct = value > 1 ? value : value * 100;
  return `${pct.toFixed(1)}%`;
}

/**
 * Formats a UTC ISO 8601 date string into the user's local timezone display.
 * e.g. "2024-03-15T10:30:00Z" → "15 Mar 2024"
 */
export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

/**
 * Formats a UTC ISO 8601 date string into a short date format.
 * e.g. "2024-03-15T10:30:00Z" → "15/03/2024"
 */
export function formatDateShort(isoString: string | null | undefined): string {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleDateString('en-IN');
  } catch {
    return '—';
  }
}

/**
 * Formats a UTC ISO 8601 datetime string into local date + time.
 * e.g. "2024-03-15T10:30:00Z" → "15 Mar 2024, 4:00 PM"
 */
export function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

/**
 * Masks sensitive data for list/table views per Frontend Rule 45.
 * Full data is only shown in the detail/profile view.
 * @param value - The raw string to mask
 * @param type  - The type of data: 'phone' | 'email' | 'id'
 */
export function maskSensitiveData(
  value: string,
  type: 'phone' | 'email' | 'id' = 'id'
): string {
  if (!value) return '';
  if (type === 'phone') {
    if (value.length < 10) return value;
    return `${value.slice(0, 2)}******${value.slice(-2)}`;
  }
  if (type === 'email') {
    const parts = value.split('@');
    if (parts.length !== 2) return value;
    return `${parts[0].charAt(0)}***@${parts[1]}`;
  }
  // id: show last 4 chars
  return `***${value.slice(-4)}`;
}
