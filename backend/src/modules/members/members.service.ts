import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    const cycleMonths: Record<string, number> = { ONE_MONTH: 1, THREE_MONTHS: 3, SIX_MONTHS: 6, TWELVE_MONTHS: 12 };
    const joinDate = dto.joinDate ? new Date(dto.joinDate) : new Date();
    const expiryDate = new Date(joinDate);
    expiryDate.setMonth(expiryDate.getMonth() + (cycleMonths[dto.billingCycle] || 1));
    const data = await this.prisma.member.create({
      data: { ...dto, joinDate, expiryDate, status: 'ACTIVE', paidAmount: 0, pendingAmount: 0 },
      include: { plan: true },
    });
    return { success: true, data };
  }

  async findAll(query: any) {
    const limit = query.limit ? parseInt(query.limit) : 50;
    const members = await this.prisma.member.findMany({ include: { plan: true }, take: limit, orderBy: { id: 'desc' } });
    return { success: true, data: { members, total: members.length, page: 1, limit } };
  }

  async findOne(id: number) {
    const data = await this.prisma.member.findUnique({ where: { id }, include: { plan: true, payments: true } });
    return { success: true, data };
  }

  async update(id: number, dto: any) {
    const data = await this.prisma.member.update({ where: { id }, data: dto, include: { plan: true } });
    return { success: true, data };
  }

  async remove(id: number) {
    const data = await this.prisma.member.delete({ where: { id } });
    return { success: true, data };
  }

  async renewMembership(id: number, dto: any) {
    const data = await this.prisma.member.update({ where: { id }, data: { status: 'ACTIVE' } });
    return { success: true, data };
  }

  async getStats() {
    const [total, active, pending, expired] = await Promise.all([
      this.prisma.member.count(),
      this.prisma.member.count({ where: { status: 'ACTIVE' } }),
      this.prisma.member.count({ where: { status: 'PENDING' } }),
      this.prisma.member.count({ where: { status: 'EXPIRED' } }),
    ]);
    return { success: true, data: { total, active, pending, expired } };
  }
}
