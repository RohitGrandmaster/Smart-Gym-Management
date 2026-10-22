// RESPONSIBILITY: Production-safe logger utility. All console output in the codebase MUST
// go through this logger — never call console.log/warn/error directly in components or hooks.
// In production builds, all log calls are no-ops to prevent data leakage and performance cost.
// Frontend Rule 46.

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Centralized logger for the GymSmart ERP frontend.
 * - In development: logs normally to the browser console.
 * - In production: all methods are no-ops (complete silence).
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.log('[MembersStore] Hydrating with SSR data');
 *   logger.error('[API] Request failed:', err);
 */
export const logger = {
  /**
   * Logs general informational messages (development only).
   */
  log: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Logs warning messages (development only).
   */
  warn: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Logs error messages (development only).
   * In production, errors surface via error boundaries and Sentry/monitoring.
   */
  error: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.error(...args);
    }
  },

  /**
   * Logs debug messages (development only).
   */
  debug: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};
