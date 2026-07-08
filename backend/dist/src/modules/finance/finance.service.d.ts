import { PrismaService } from '../../database/prisma.service';
export declare class FinanceService {
    private prisma;
    constructor(prisma: PrismaService);
    createPayment(dto: any): Promise<{
        success: boolean;
        data: {
            amount: number;
            method: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            notes: string | null;
            invoiceNo: string;
            paidAt: Date;
            createdAt: Date;
            id: number;
            memberId: number;
        };
    }>;
    findAllPayments(query: any): Promise<{
        success: boolean;
        data: {
            payments: ({
                member: {
                    plan: {
                        createdAt: Date;
                        id: number;
                        name: string;
                        updatedAt: Date;
                        tier: import("@prisma/client").$Enums.PlanTier;
                        price1Month: number;
                        price3Month: number;
                        price6Month: number;
                        price12Month: number;
                        features: string[];
                        isActive: boolean;
                    };
                } & {
                    status: import("@prisma/client").$Enums.MemberStatus;
                    createdAt: Date;
                    id: number;
                    name: string;
                    email: string;
                    phone: string;
                    gender: import("@prisma/client").$Enums.Gender;
                    address: string | null;
                    branch: string;
                    planId: number;
                    billingCycle: import("@prisma/client").$Enums.BillingCycle;
                    joinDate: Date;
                    expiryDate: Date;
                    paidAmount: number;
                    pendingAmount: number;
                    photo: string | null;
                    updatedAt: Date;
                };
            } & {
                amount: number;
                method: string;
                status: import("@prisma/client").$Enums.PaymentStatus;
                notes: string | null;
                invoiceNo: string;
                paidAt: Date;
                createdAt: Date;
                id: number;
                memberId: number;
            })[];
            total: number;
        };
    }>;
    getPaymentsByMember(memberId: number): Promise<{
        success: boolean;
        data: {
            amount: number;
            method: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            notes: string | null;
            invoiceNo: string;
            paidAt: Date;
            createdAt: Date;
            id: number;
            memberId: number;
        }[];
    }>;
    getSummary(): Promise<{
        success: boolean;
        data: {
            totalRevenue: number;
            monthlyRevenue: number;
            pendingAmount: number;
            totalPayments: number;
            revenueByMethod: Record<string, number>;
            monthlyData: {
                month: string;
                revenue: number;
            }[];
        };
    }>;
}
