export declare class CreateMemberDto {
    name: string;
    email: string;
    phone: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    address?: string;
    branch: string;
    planId: number;
    billingCycle: 'ONE_MONTH' | 'THREE_MONTHS' | 'SIX_MONTHS' | 'TWELVE_MONTHS';
    joinDate: string;
    paidAmount?: number;
}
