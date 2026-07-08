import { StoreService } from './store.service';
export declare class StoreController {
    private readonly storeService;
    constructor(storeService: StoreService);
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
    updateProduct(id: string, dto: any): Promise<{
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
    removeProduct(id: string): Promise<{
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
