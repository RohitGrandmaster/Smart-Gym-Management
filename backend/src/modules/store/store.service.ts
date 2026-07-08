import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async findAllProducts(query: any) {
    const data = await this.prisma.product.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
    return { success: true, data };
  }
  async createProduct(dto: any) {
    const data = await this.prisma.product.create({ data: dto });
    return { success: true, data };
  }
  async updateProduct(id: number, dto: any) {
    const data = await this.prisma.product.update({ where: { id }, data: dto });
    return { success: true, data };
  }
  async removeProduct(id: number) {
    const data = await this.prisma.product.update({ where: { id }, data: { isActive: false } });
    return { success: true, data };
  }

  async findAllOrders(query: any) {
    const orders = await this.prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { id: 'desc' },
    });
    return { success: true, data: { orders, total: orders.length } };
  }

  async createOrder(dto: any) {
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
}
