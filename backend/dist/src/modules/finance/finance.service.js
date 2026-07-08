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
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let FinanceService = class FinanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPayment(dto) {
        const payment = await this.prisma.payment.create({
            data: { memberId: dto.memberId, amount: dto.amount, method: dto.method, notes: dto.notes, status: 'PAID', invoiceNo: 'INV-' + Date.now(), paidAt: new Date() },
        });
        await this.prisma.member.update({
            where: { id: dto.memberId },
            data: { paidAmount: { increment: dto.amount }, pendingAmount: { decrement: dto.amount } },
        });
        return { success: true, data: payment };
    }
    async findAllPayments(query) {
        const limit = query.limit ? parseInt(query.limit) : 50;
        const payments = await this.prisma.payment.findMany({
            include: { member: { include: { plan: true } } },
            take: limit,
            orderBy: { paidAt: 'desc' },
        });
        return { success: true, data: { payments, total: payments.length } };
    }
    async getPaymentsByMember(memberId) {
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
        const paymentsByMethod = await this.prisma.payment.groupBy({
            by: ['method'],
            _sum: { amount: true },
            where: { status: 'PAID' },
        });
        const revenueByMethod = {
            UPI: 0,
            Cash: 0,
            Card: 0,
            NetBanking: 0,
        };
        paymentsByMethod.forEach((p) => {
            if (p.method)
                revenueByMethod[p.method] = p._sum.amount || 0;
        });
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
        const revenueMap = new Map();
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
                    revenueMap.set(mName, revenueMap.get(mName) + p.amount);
            }
        });
        const monthlyData = Array.from(revenueMap.entries()).map(([month, revenue]) => ({ month, revenue }));
        return { success: true, data: { totalRevenue, monthlyRevenue, pendingAmount, totalPayments, revenueByMethod, monthlyData } };
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map