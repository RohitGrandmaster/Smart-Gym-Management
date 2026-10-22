// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders the premium login form card. Strictly a View layer — all state and logic lives in useLoginForm.ts.
// All UI strings come from LoginSharedConstants — zero inline strings.
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ChevronLeft } from 'lucide-react';
import { useLoginForm } from '@/app/auth/login/login_components/LoginForm/useLoginForm';
import { LoginSharedConstants } from '@/app/auth/login/login_constants/LoginSharedConstants';

export default function LoginForm() {
  const { form, status, showPassword, setShowPassword, onSubmit, handleDemoSuperadminLogin, handleDemoAdminLogin, handleDemoManagerLogin, handleDemoTrainerLogin } = useLoginForm();
  const { register, handleSubmit, formState: { errors } } = form;
  const isLoading = status === 'loading';

  return (
    <div className="w-full max-w-md flex flex-col gap-8">

      {/* ── Back to Home (TC-01 fix) ── */}
      <Link
        href="/landing"
        className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors self-start"
        aria-label="Back to landing page"
      >
        <ChevronLeft size={16} />
        Back to Home
      </Link>

      {/* ── Brand header (mobile shows this; desktop hero panel shows it there) ── */}
      <div className="flex flex-col items-center text-center gap-2">
        <div
          className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl ring-2 ring-primary/30 mb-1"
          style={{ boxShadow: '0 0 32px rgba(99,102,241,0.25)' }}
        >
          <Image
            src={LoginSharedConstants.ASSETS.LOGO}
            alt={LoginSharedConstants.TEXT.BRAND}
            width={64}
            height={64}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        <h1 className="text-2xl font-black text-primary">{LoginSharedConstants.TEXT.FORM_TITLE}</h1>
        <p className="text-sm text-secondary">{LoginSharedConstants.TEXT.FORM_SUBTITLE}</p>
      </div>

      {/* ── Form card ── */}
      <div
        className="rounded-2xl border border-border p-8 space-y-5"
        style={{
          background: 'var(--bg-card)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold text-secondary uppercase tracking-wider"
            >
              {LoginSharedConstants.TEXT.FORM_EMAIL_LABEL}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail
                  size={16}
                  className="text-secondary transition-colors group-focus-within:text-primary"
                />
              </div>
              <input
                id="login-email"
                type="email"
                {...register('email')}
                disabled={isLoading}
                className={[
                  'w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium transition-all outline-none',
                  'bg-input text-primary placeholder:text-disabled',
                  'border',
                  errors.email
                    ? 'border-danger ring-1 ring-danger/40'
                    : 'border-border focus:border-primary focus:ring-1 focus:ring-primary/30',
                  'disabled:opacity-60 disabled:cursor-not-allowed',
                ].join(' ')}
                placeholder={LoginSharedConstants.TEXT.FORM_EMAIL_PLACEHOLDER}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-danger flex items-center gap-1 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold text-secondary uppercase tracking-wider"
            >
              {LoginSharedConstants.TEXT.FORM_PASSWORD_LABEL}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock
                  size={16}
                  className="text-secondary transition-colors group-focus-within:text-primary"
                />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                disabled={isLoading}
                className={[
                  'w-full pl-10 pr-11 py-3 rounded-xl text-sm font-medium transition-all outline-none',
                  'bg-input text-primary placeholder:text-disabled',
                  'border',
                  errors.password
                    ? 'border-danger ring-1 ring-danger/40'
                    : 'border-border focus:border-primary focus:ring-1 focus:ring-primary/30',
                  'disabled:opacity-60 disabled:cursor-not-allowed',
                ].join(' ')}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-secondary hover:text-primary transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-danger flex items-center gap-1 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className={[
              'w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200',
              'flex items-center justify-center gap-2',
              'disabled:opacity-70 disabled:cursor-not-allowed',
              isLoading
                ? 'bg-primary'
                : 'bg-primary hover:opacity-90 active:scale-[0.98] shadow-lg',
            ].join(' ')}
            style={
              !isLoading
                ? { boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }
                : undefined
            }
          >
            {isLoading ? (
              <Loader2 size={18} className="motion-safe:animate-spin" />
            ) : (
              <>
                {LoginSharedConstants.TEXT.FORM_SUBMIT}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          {/* Demo Login buttons */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-semibold text-secondary uppercase">Quick Login Demos</span>
            <div className="flex-grow border-t border-border"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleDemoSuperadminLogin}
              className={[
                'w-full py-2.5 rounded-xl font-bold text-xs transition-all duration-200',
                'flex items-center justify-center gap-2 border border-warning/30',
                'text-warning hover:bg-warning/5 active:scale-[0.98]',
                'disabled:opacity-70 disabled:cursor-not-allowed',
              ].join(' ')}
            >
              Superadmin
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleDemoAdminLogin}
              className={[
                'w-full py-2.5 rounded-xl font-bold text-xs transition-all duration-200',
                'flex items-center justify-center gap-2 border border-primary/30',
                'text-primary hover:bg-primary/5 active:scale-[0.98]',
                'disabled:opacity-70 disabled:cursor-not-allowed',
              ].join(' ')}
            >
              Admin
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleDemoManagerLogin}
              className={[
                'w-full py-2.5 rounded-xl font-bold text-xs transition-all duration-200',
                'flex items-center justify-center gap-2 border border-success/30',
                'text-success hover:bg-success/5 active:scale-[0.98]',
                'disabled:opacity-70 disabled:cursor-not-allowed',
              ].join(' ')}
            >
              Manager
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleDemoTrainerLogin}
              className={[
                'w-full py-2.5 rounded-xl font-bold text-xs transition-all duration-200',
                'flex items-center justify-center gap-2 border border-info/30',
                'text-info hover:bg-info/5 active:scale-[0.98]',
                'disabled:opacity-70 disabled:cursor-not-allowed',
              ].join(' ')}
            >
              Trainer
            </button>
          </div>
        </form>
      </div>

      {/* ── Footer ── */}
      <p className="text-center text-xs text-disabled">
        {LoginSharedConstants.TEXT.FOOTER}
      </p>
    </div>
  );
}

