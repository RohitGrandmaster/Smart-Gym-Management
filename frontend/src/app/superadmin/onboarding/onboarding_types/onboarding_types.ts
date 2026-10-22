// RESPONSIBILITY: TypeScript types for the Tenant Onboarding module.

export type OnboardingStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'STALLED';
export type TrialStatus = 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'CONVERTED';
export type ChecklistItem = {
  key: string;
  label: string;
  done: boolean;
};

export interface TenantOnboarding {
  id: string;
  gymName: string;
  ownerName: string;
  adminEmail: string;
  phone: string;
  plan: string;
  signupDate: string;
  trialEndsAt: string | null;
  trialStatus: TrialStatus;
  onboardingStatus: OnboardingStatus;
  emailVerified: boolean;
  welcomeEmailSent: boolean;
  checklist: ChecklistItem[];
  daysInTrial: number;
  trialDaysLeft: number;
}
