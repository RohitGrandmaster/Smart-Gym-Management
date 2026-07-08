import { PrismaService } from '../../database/prisma.service';
export declare class StoreService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllProducts(query: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            category: string;
            price: number;
            stock: number;
            description: string | null;
            imageUrl: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    createProduct(dto: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            category: string;
            price: number;
            stock: number;
            description: string | null;
            imageUrl: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateProduct(id: number, dto: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            category: string;
            price: number;
            stock: number;
            description: string | null;
            imageUrl: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    removeProduct(id: number): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            category: string;
            price: number;
            stock: number;
            description: string | null;
            imageUrl: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    findAllOrders(query: any): Promise<{
        success: boolean;
        data: {
            orders: ({
                items: ({
                    product: {
                        id: number;
                        name: string;
                        category: string;
                        price: number;
                        stock: number;
                        description: string | null;
                        imageUrl: string | null;
                        isActive: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                } & {
                    id: number;
                    price: number;
                    orderId: number;
                    productId: number;
                    qty: number;
                })[];
            } & {
                id: number;
                createdAt: Date;
                total: number;
                method: string;
                status: string;
                notes: string | null;
            })[];
            total: number;
        };
    }>;
    createOrder(dto: any): Promise<{
        success: boolean;
        data: {
            items: {
                id: number;
                price: number;
                orderId: number;
                productId: number;
                qty: number;
            }[];
        } & {
            id: number;
            createdAt: Date;
            total: number;
            method: string;
            status: string;
            notes: string | null;
        };
    }>;
    getStoreSummary(): Promise<{
        success: boolean;
        data: {
            totalProducts: number;
            totalOrders: number;
            totalRevenue: number;
            lowStockProducts: {
                id: number;
                name: string;
                category: string;
                price: number;
                stock: number;
                description: string | null;
                imageUrl: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            }[];
        };
    }>;
}
