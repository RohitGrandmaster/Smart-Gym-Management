// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Centralizes all static text, asset paths, and UI data for the Login module to avoid magic strings in components.
// All hero section copy, form labels, and asset paths live here — never inline strings in JSX.
export const LoginSharedConstants = {
  ASSETS: {
    LOGO: '/logo.png',
    HERO_IMAGE: '/gym-hero.jpg',
  },
  TEXT: {
    BRAND: 'GymSmart',
    BRAND_TAGLINE: 'Gym Management Made Simple',
    TITLE: 'Run Your Gym.',
    SUBTITLE: 'Not Spreadsheets.',
    SECURE_BADGE: 'System Online & Secure',
    FORM_TITLE: 'Welcome Back',
    FORM_SUBTITLE: 'Sign in to your admin dashboard',
    FORM_EMAIL_LABEL: 'Email Address',
    FORM_EMAIL_PLACEHOLDER: 'admin@gymsmart.com',
    FORM_PASSWORD_LABEL: 'Password',
    FORM_SUBMIT: 'Sign In',
    FORM_SUBMITTING: 'Signing in…',
    FOOTER: 'Secured with 256-bit encryption · GymSmart ERP',
  },
  HERO_STATS: [
    { value: '500+', label: 'Gyms Managed' },
    { value: '2L+',  label: 'Active Members' },
    { value: '99.9%', label: 'Uptime SLA' },
  ],
  HERO_FEATURES: [
    'Members, Plans & Renewals — in one place',
    'Real-time attendance & biometric sync',
    'Finance, HR & Payroll management',
    'WhatsApp & Email automation built-in',
  ],
};

