import { PlansService } from './plans.service';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
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
    findOne(id: string): Promise<{
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
    update(id: string, dto: any): Promise<{
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
    remove(id: string): Promise<{
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
