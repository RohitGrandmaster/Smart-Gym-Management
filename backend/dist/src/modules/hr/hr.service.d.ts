import { PrismaService } from '../../database/prisma.service';
export declare class HrService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllStaff(query: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            email: string;
            phone: string;
            role: string;
            salary: number;
            branch: string;
            gender: import("@prisma/client").$Enums.Gender;
            address: string | null;
            joinDate: Date;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    createStaff(dto: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            email: string;
            phone: string;
            role: string;
            salary: number;
            branch: string;
            gender: import("@prisma/client").$Enums.Gender;
            address: string | null;
            joinDate: Date;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    findOneStaff(id: number): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            email: string;
            phone: string;
            role: string;
            salary: number;
            branch: string;
            gender: import("@prisma/client").$Enums.Gender;
            address: string | null;
            joinDate: Date;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    }>;
    updateStaff(id: number, dto: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            email: string;
            phone: string;
            role: string;
            salary: number;
            branch: string;
            gender: import("@prisma/client").$Enums.Gender;
            address: string | null;
            joinDate: Date;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    removeStaff(id: number): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            email: string;
            phone: string;
            role: string;
            salary: number;
            branch: string;
            gender: import("@prisma/client").$Enums.Gender;
            address: string | null;
            joinDate: Date;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    findAllPayrolls(query: any): Promise<{
        success: boolean;
        data: ({
            staff: {
                id: number;
                name: string;
                email: string;
                phone: string;
                role: string;
                salary: number;
                branch: string;
                gender: import("@prisma/client").$Enums.Gender;
                address: string | null;
                joinDate: Date;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: number;
            createdAt: Date;
            staffId: number;
            month: string;
            amount: number;
            status: string;
            paidAt: Date | null;
            notes: string | null;
        })[];
    }>;
    createPayroll(dto: any): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            staffId: number;
            month: string;
            amount: number;
            status: string;
            paidAt: Date | null;
            notes: string | null;
        };
    }>;
    updatePayrollStatus(id: number, status: string): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            staffId: number;
            month: string;
            amount: number;
            status: string;
            paidAt: Date | null;
            notes: string | null;
        };
    }>;
    getHrSummary(): Promise<{
        success: boolean;
        data: {
            totalStaff: number;
            activeStaff: number;
            totalPayrollThisMonth: number;
            paidCount: number;
            pendingCount: number;
        };
    }>;
}
