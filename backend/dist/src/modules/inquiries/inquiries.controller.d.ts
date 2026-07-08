import { InquiriesService } from './inquiries.service';
export declare class InquiriesController {
    private readonly inquiriesService;
    constructor(inquiriesService: InquiriesService);
    findAll(query: any): Promise<{
        success: boolean;
        data: {
            inquiries: {
                id: number;
                name: string;
                phone: string;
                email: string | null;
                interest: string;
                status: import("@prisma/client").$Enums.InquiryStatus;
                source: string | null;
                notes: string | null;
                followUpDate: Date | null;
                createdAt: Date;
                updatedAt: Date;
            }[];
            total: number;
        };
    }>;
    create(dto: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            phone: string;
            email: string | null;
            interest: string;
            status: import("@prisma/client").$Enums.InquiryStatus;
            source: string | null;
            notes: string | null;
            followUpDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getStats(): Promise<{
        success: boolean;
        data: {
            total: number;
            new: number;
            followUp: number;
            converted: number;
            lost: number;
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            phone: string;
            email: string | null;
            interest: string;
            status: import("@prisma/client").$Enums.InquiryStatus;
            source: string | null;
            notes: string | null;
            followUpDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    }>;
    update(id: string, dto: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            phone: string;
            email: string | null;
            interest: string;
            status: import("@prisma/client").$Enums.InquiryStatus;
            source: string | null;
            notes: string | null;
            followUpDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            phone: string;
            email: string | null;
            interest: string;
            status: import("@prisma/client").$Enums.InquiryStatus;
            source: string | null;
            notes: string | null;
            followUpDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
