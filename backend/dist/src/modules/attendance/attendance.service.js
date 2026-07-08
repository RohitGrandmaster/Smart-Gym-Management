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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let AttendanceService = class AttendanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async markAttendance(dto) {
        const data = await this.prisma.attendance.create({ data: dto });
        return { success: true, data };
    }
    async findAll(query) {
        const data = await this.prisma.attendance.findMany({
            orderBy: { date: 'desc' },
            include: { member: { select: { name: true } }, staff: { select: { name: true } } },
        });
        return { success: true, data };
    }
    async getTodayStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const [totalCheckIns, memberCheckIns, staffCheckIns] = await Promise.all([
            this.prisma.attendance.count({ where: { date: { gte: today, lt: tomorrow } } }),
            this.prisma.attendance.count({ where: { date: { gte: today, lt: tomorrow }, memberId: { not: null } } }),
            this.prisma.attendance.count({ where: { date: { gte: today, lt: tomorrow }, staffId: { not: null } } }),
        ]);
        return { success: true, data: { totalCheckIns, memberCheckIns, staffCheckIns } };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map