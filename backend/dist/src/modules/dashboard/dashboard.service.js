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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);
        const totalMembers = await this.prisma.member.count();
        const activeMembers = await this.prisma.member.count({
            where: { status: 'ACTIVE' },
        });
        const pendingMembers = await this.prisma.member.count({
            where: { status: 'PENDING' },
        });
        const expiredMembers = await this.prisma.member.count({
            where: { status: 'EXPIRED' },
        });
        const newMembersThisMonth = await this.prisma.member.count({
            where: { joinDate: { gte: firstDayOfMonth } },
        });
        const totalRevenueResult = await this.prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: 'PAID' },
        });
        const totalRevenue = totalRevenueResult._sum.amount || 0;
        const monthlyRevenueResult = await this.prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: 'PAID', paidAt: { gte: firstDayOfMonth } },
        });
        const monthlyRevenue = monthlyRevenueResult._sum.amount || 0;
        const pendingPaymentsResult = await this.prisma.member.aggregate({
            _sum: { pendingAmount: true },
        });
        const pendingPayments = pendingPaymentsResult._sum.pendingAmount || 0;
        const totalStaff = await this.prisma.staff.count();
        const activeStaff = await this.prisma.staff.count({
            where: { isActive: true },
        });
        const totalProducts = await this.prisma.product.count();
        const lowStockCount = await this.prisma.product.count({
            where: { stock: { lte: 10 } },
        });
        const totalInquiries = await this.prisma.inquiry.count();
        const newInquiries = await this.prisma.inquiry.count({
            where: { status: 'NEW' },
        });
        const recentMembersForChart = await this.prisma.member.findMany({
            where: { joinDate: { gte: sixMonthsAgo } },
            select: { joinDate: true },
        });
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
        const memberGrowthMap = new Map();
        const revenueMap = new Map();
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(now.getMonth() - i);
            const mName = monthNames[d.getMonth()];
            memberGrowthMap.set(mName, 0);
            revenueMap.set(mName, 0);
        }
        recentMembersForChart.forEach((m) => {
            const mName = monthNames[m.joinDate.getMonth()];
            if (memberGrowthMap.has(mName))
                memberGrowthMap.set(mName, memberGrowthMap.get(mName) + 1);
        });
        recentPaymentsForChart.forEach((p) => {
            if (p.paidAt) {
                const mName = monthNames[p.paidAt.getMonth()];
                if (revenueMap.has(mName))
                    revenueMap.set(mName, revenueMap.get(mName) + p.amount);
            }
        });
        const memberGrowth = Array.from(memberGrowthMap.entries()).map(([month, count]) => ({ month, count }));
        const revenueChart = Array.from(revenueMap.entries()).map(([month, revenue]) => ({ month, revenue }));
        const membersWithPlans = await this.prisma.member.findMany({
            include: { plan: true },
        });
        const planCounts = new Map();
        membersWithPlans.forEach((m) => {
            const pName = m.plan?.name || 'Unknown';
            planCounts.set(pName, (planCounts.get(pName) || 0) + 1);
        });
        const membersByPlan = Array.from(planCounts.entries()).map(([plan, count]) => ({ plan, count }));
        const pendingPaymentsList = await this.prisma.member.findMany({
            where: { pendingAmount: { gt: 0 } },
            select: { id: true, name: true, pendingAmount: true, expiryDate: true },
            take: 10,
        });
        return {
            success: true,
            data: {
                totalMembers,
                activeMembers,
                newMembersThisMonth,
                totalRevenue,
                monthlyRevenue,
                pendingPayments,
                totalStaff,
                activeStaff,
                totalProducts,
                lowStockCount,
                totalInquiries,
                newInquiries,
                memberGrowth,
                revenueChart,
                membersByPlan,
                membersByStatus: { active: activeMembers, pending: pendingMembers, expired: expiredMembers },
                recentMembers: await this.prisma.member.findMany({ take: 5, orderBy: { id: 'desc' }, include: { plan: true } }),
                recentPayments: await this.prisma.payment.findMany({ take: 5, orderBy: { id: 'desc' }, include: { member: true } }),
                pendingPaymentsList,
            },
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map