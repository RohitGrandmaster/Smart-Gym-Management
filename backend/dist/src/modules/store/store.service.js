"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let StoreService = class StoreService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllProducts(query) {
        const data = await this.prisma.product.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
        return { success: true, data };
    }
    async createProduct(dto) {
        const data = await this.prisma.product.create({ data: dto });
        return { success: true, data };
    }
    async updateProduct(id, dto) {
        const data = await this.prisma.product.update({ where: { id }, data: dto });
        return { success: true, data };
    }
    async removeProduct(id) {
        const data = await this.prisma.product.update({ where: { id }, data: { isActive: false } });
        return { success: true, data };
    }
    async findAllOrders(query) {
        const orders = await this.prisma.order.findMany({
            include: { items: { include: { product: true } } },
            orderBy: { id: 'desc' },
        });
        return { success: true, data: { orders, total: orders.length } };
    }
    async createOrder(dto) {
        let total = 0;
        const order = await this.prisma.order.create({
            data: { total: 0, method: dto.method, status: 'Completed', notes: dto.notes },
        });
        for (const item of dto.items) {
            const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
            if (product) {
                total += product.price * item.qty;
                await this.prisma.orderItem.create({ data: { orderId: order.id, productId: item.productId, qty: item.qty, price: product.price } });
                await this.prisma.product.update({ where: { id: product.id }, data: { stock: { decrement: item.qty } } });
            }
        }
        const data = await this.prisma.order.update({ where: { id: order.id }, data: { total }, include: { items: true } });
        return { success: true, data };
    }
    async getStoreSummary() {
        const totalProducts = await this.prisma.product.count({ where: { isActive: true } });
        const totalOrders = await this.prisma.order.count();
        const totalRevenue = (await this.prisma.order.aggregate({ _sum: { total: true } }))._sum.total || 0;
        const lowStockProducts = await this.prisma.product.findMany({ where: { stock: { lte: 10 }, isActive: true } });
        return { success: true, data: { totalProducts, totalOrders, totalRevenue, lowStockProducts } };
    }
};
exports.StoreService = StoreService;
exports.StoreService = StoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StoreService);
//# sourceMappingURL=store.service.js.map