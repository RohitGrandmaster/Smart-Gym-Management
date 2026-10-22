// RESPONSIBILITY: TypeScript types for the Blacklist module.

export type FetchState = 'idle' | 'loading' | 'success' | 'error';
export type BlacklistScope = 'global' | 'specific';

export interface BlacklistedMember {
  id: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  memberEmail: string;
  reason: string;
  blacklistedBy: string;
  blacklistedAt: string;
  scope: BlacklistScope;
  assignedGyms: string[];
  assignedGymNames: string[];
  isActive: boolean;
}

export interface BlacklistFormValues {
  memberId: string;
  memberName: string;
  memberPhone: string;
  memberEmail: string;
  reason: string;
  scope: BlacklistScope;
  assignedGyms: string[];
}

export interface BlacklistKPIData {
  totalBlacklisted: number;
  globalBans: number;
  gymSpecificBans: number;
  addedThisMonth: number;
}
