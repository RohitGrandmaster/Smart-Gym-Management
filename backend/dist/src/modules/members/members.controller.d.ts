import { MembersService } from './members.service';
export declare class MembersController {
    private readonly membersService;
    constructor(membersService: MembersService);
    create(createMemberDto: any): Promise<{
        success: boolean;
        data: {
            plan: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                tier: import("@prisma/client").$Enums.PlanTier;
                price1Month: number;
                price3Month: number;
                price6Month: number;
                price12Month: number;
                features: string[];
                isActive: boolean;
            };
        } & {
            name: string;
            email: string;
            phone: string;
            gender: import("@prisma/client").$Enums.Gender;
            address: string | null;
            branch: string;
            billingCycle: import("@prisma/client").$Enums.BillingCycle;
            status: import("@prisma/client").$Enums.MemberStatus;
            joinDate: Date;
            expiryDate: Date;
            paidAmount: number;
            pendingAmount: number;
            photo: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            planId: number;
        };
    }>;
    getStats(): Promise<{
        success: boolean;
        data: {
            total: number;
            active: number;
            pending: number;
            expired: number;
        };
    }>;
    findAll(query: any): Promise<{
        success: boolean;
        data: {
            members: ({
                plan: {
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    id: number;
                    tier: import("@prisma/client").$Enums.PlanTier;
                    price1Month: number;
                    price3Month: number;
                    price6Month: number;
                    price12Month: number;
                    features: string[];
                    isActive: boolean;
                };
            } & {
                name: string;
                email: string;
                phone: string;
                gender: import("@prisma/client").$Enums.Gender;
                address: string | null;
                branch: string;
                billingCycle: import("@prisma/client").$Enums.BillingCycle;
                status: import("@prisma/client").$Enums.MemberStatus;
                joinDate: Date;
                expiryDate: Date;
                paidAmount: number;
                pendingAmount: number;
                photo: string | null;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                planId: number;
            })[];
            total: number;
            page: number;
            limit: number;
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: ({
            plan: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                tier: import("@prisma/client").$Enums.PlanTier;
                price1Month: number;
                price3Month: number;
                price6Month: number;
                price12Month: number;
                features: string[];
                isActive: boolean;
            };
            payments: {
                status: import("@prisma/client").$Enums.PaymentStatus;
                createdAt: Date;
                id: number;
                memberId: number;
                amount: number;
                method: string;
                notes: string | null;
                invoiceNo: string;
                paidAt: Date;
            }[];
        } & {
            name: string;
            email: string;
            phone: string;
            gender: import("@prisma/client").$Enums.Gender;
            address: string | null;
            branch: string;
            billingCycle: import("@prisma/client").$Enums.BillingCycle;
            status: import("@prisma/client").$Enums.MemberStatus;
            joinDate: Date;
            expiryDate: Date;
            paidAmount: number;
            pendingAmount: number;
            photo: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            planId: number;
        }) | null;
    }>;
    update(id: string, updateMemberDto: any): Promise<{
        success: boolean;
        data: {
            plan: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                tier: import("@prisma/client").$Enums.PlanTier;
                price1Month: number;
                price3Month: number;
                price6Month: number;
                price12Month: number;
                features: string[];
                isActive: boolean;
            };
        } & {
            name: string;
            email: string;
            phone: string;
            gender: import("@prisma/client").$Enums.Gender;
            address: string | null;
            branch: string;
            billingCycle: import("@prisma/client").$Enums.BillingCycle;
            status: import("@prisma/client").$Enums.MemberStatus;
            joinDate: Date;
            expiryDate: Date;
            paidAmount: number;
            pendingAmount: number;
            photo: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            planId: number;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        data: {
            name: string;
            email: string;
            phone: string;
            gender: import("@prisma/client").$Enums.Gender;
            address: string | null;
            branch: string;
            billingCycle: import("@prisma/client").$Enums.BillingCycle;
            status: import("@prisma/client").$Enums.MemberStatus;
            joinDate: Date;
            expiryDate: Date;
            paidAmount: number;
            pendingAmount: number;
            photo: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            planId: number;
        };
    }>;
    renewMembership(id: string, body: any): Promise<{
        success: boolean;
        data: {
            name: string;
            email: string;
            phone: string;
            gender: import("@prisma/client").$Enums.Gender;
            address: string | null;
            branch: string;
            billingCycle: import("@prisma/client").$Enums.BillingCycle;
            status: import("@prisma/client").$Enums.MemberStatus;
            joinDate: Date;
            expiryDate: Date;
            paidAmount: number;
            pendingAmount: number;
            photo: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            planId: number;
        };
    }>;
}
