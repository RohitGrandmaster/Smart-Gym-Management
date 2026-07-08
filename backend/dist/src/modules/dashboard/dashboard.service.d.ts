import { PrismaService } from '../../database/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        success: boolean;
        data: {
            totalMembers: number;
            activeMembers: number;
            newMembersThisMonth: number;
            totalRevenue: number;
            monthlyRevenue: number;
            pendingPayments: number;
            totalStaff: number;
            activeStaff: number;
            totalProducts: number;
            lowStockCount: number;
            totalInquiries: number;
            newInquiries: number;
            memberGrowth: {
                month: string;
                count: number;
            }[];
            revenueChart: {
                month: string;
                revenue: number;
            }[];
            membersByPlan: {
                plan: string;
                count: number;
            }[];
            membersByStatus: {
                active: number;
                pending: number;
                expired: number;
            };
            recentMembers: ({
                plan: {
                    id: number;
                    isActive: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    tier: import("@prisma/client").$Enums.PlanTier;
                    price1Month: number;
                    price3Month: number;
                    price6Month: number;
                    price12Month: number;
                    features: string[];
                };
            } & {
                status: import("@prisma/client").$Enums.MemberStatus;
                id: number;
                pendingAmount: number;
                planId: number;
                paidAmount: number;
                name: string;
                email: string;
                phone: string;
                gender: import("@prisma/client").$Enums.Gender;
                address: string | null;
                branch: string;
                billingCycle: import("@prisma/client").$Enums.BillingCycle;
                joinDate: Date;
                expiryDate: Date;
                photo: string | null;
                createdAt: Date;
                updatedAt: Date;
            })[];
            recentPayments: ({
                member: {
                    status: import("@prisma/client").$Enums.MemberStatus;
                    id: number;
                    pendingAmount: number;
                    planId: number;
                    paidAmount: number;
                    name: string;
                    email: string;
                    phone: string;
                    gender: import("@prisma/client").$Enums.Gender;
                    address: string | null;
                    branch: string;
                    billingCycle: import("@prisma/client").$Enums.BillingCycle;
                    joinDate: Date;
                    expiryDate: Date;
                    photo: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                status: import("@prisma/client").$Enums.PaymentStatus;
                amount: number;
                id: number;
                memberId: number;
                createdAt: Date;
                method: string;
                notes: string | null;
                invoiceNo: string;
                paidAt: Date;
            })[];
            pendingPaymentsList: {
                id: number;
                pendingAmount: number;
                name: string;
                expiryDate: Date;
            }[];
        };
    }>;
}
