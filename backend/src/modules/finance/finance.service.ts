import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async createPayment(dto: any) {
    const payment = await this.prisma.payment.create({
      data: { memberId: dto.memberId, amount: dto.amount, method: dto.method, notes: dto.notes, status: 'PAID', invoiceNo: 'INV-' + Date.now(), paidAt: new Date() },
    });
    await this.prisma.member.update({
      where: { id: dto.memberId },
      data: { paidAmount: { increment: dto.amount }, pendingAmount: { decrement: dto.amount } },
    });
    return { success: true, data: payment };
  }

  async findAllPayments(query: any) {
    const limit = query.limit ? parseInt(query.limit) : 50;
    const payments = await this.prisma.payment.findMany({
      include: { member: { include: { plan: true } } },
      take: limit,
      orderBy: { paidAt: 'desc' },
    });
    return { success: true, data: { payments, total: payments.length } };
  }

  async getPaymentsByMember(memberId: number) {
    const data = await this.prisma.payment.findMany({ where: { memberId }, orderBy: { paidAt: 'desc' } });
    return { success: true, data };
  }

  async getSummary() {
    const totalRevenueResult = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'PAID' },
    });
    const totalRevenue = totalRevenueResult._sum.amount || 0;

    const totalPayments = await this.prisma.payment.count();

    const pendingAmountResult = await this.prisma.member.aggregate({
      _sum: { pendingAmount: true },
    });
    const pendingAmount = pendingAmountResult._sum.pendingAmount || 0;

    // Dynamic Revenue by Method
    const paymentsByMethod = await this.prisma.payment.groupBy({
      by: ['method'],
      _sum: { amount: true },
      where: { status: 'PAID' },
    });

    const revenueByMethod: Record<string, number> = {
      UPI: 0,
      Cash: 0,
      Card: 0,
      NetBanking: 0,
    };
    paymentsByMethod.forEach((p) => {
      if (p.method) revenueByMethod[p.method] = p._sum.amount || 0;
    });

    // Dynamic Monthly Data
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyRevenueResult = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'PAID', paidAt: { gte: firstDayOfMonth } },
    });
    const monthlyRevenue = monthlyRevenueResult._sum.amount || 0;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const recentPaymentsForChart = await this.prisma.payment.findMany({
      where: { status: 'PAID', paidAt: { gte: sixMonthsAgo } },
      select: { paidAt: true, amount: true },
    });

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const revenueMap = new Map<string, number>();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(now.getMonth() - i);
      const mName = monthNames[d.getMonth()];
      revenueMap.set(mName, 0);
    }

    recentPaymentsForChart.forEach((p) => {
      if (p.paidAt) {
        const mName = monthNames[p.paidAt.getMonth()];
        if (revenueMap.has(mName))
          revenueMap.set(mName, revenueMap.get(mName)! + p.amount);
      }
    });

    const monthlyData = Array.from(revenueMap.entries()).map(
      ([month, revenue]) => ({ month, revenue }),
    );

    return { success: true, data: { totalRevenue, monthlyRevenue, pendingAmount, totalPayments, revenueByMethod, monthlyData } };
  }
}
