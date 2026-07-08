import { PrismaService } from '../../database/prisma.service';
export declare class PlansService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: any): Promise<{
        success: boolean;
        data: {
            name: string;
            tier: import("@prisma/client").$Enums.PlanTier;
            price1Month: number;
            price3Month: number;
            price6Month: number;
            price12Month: number;
            features: string[];
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    }>;
    findAll(): Promise<{
        success: boolean;
        data: {
            name: string;
            tier: import("@prisma/client").$Enums.PlanTier;
            price1Month: number;
            price3Month: number;
            price6Month: number;
            price12Month: number;
            features: string[];
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        }[];
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: {
            name: string;
            tier: import("@prisma/client").$Enums.PlanTier;
            price1Month: number;
            price3Month: number;
            price6Month: number;
            price12Month: number;
            features: string[];
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        } | null;
    }>;
    update(id: number, dto: any): Promise<{
        success: boolean;
        data: {
            name: string;
            tier: import("@prisma/client").$Enums.PlanTier;
            price1Month: number;
            price3Month: number;
            price6Month: number;
            price12Month: number;
            features: string[];
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    }>;
    remove(id: number): Promise<{
        success: boolean;
        data: {
            name: string;
            tier: import("@prisma/client").$Enums.PlanTier;
            price1Month: number;
            price3Month: number;
            price6Month: number;
            price12Month: number;
            features: string[];
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    }>;
}
