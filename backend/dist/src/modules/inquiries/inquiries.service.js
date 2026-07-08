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
exports.InquiriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let InquiriesService = class InquiriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const limit = query.limit ? parseInt(query.limit) : 200;
        const inquiries = await this.prisma.inquiry.findMany({ orderBy: { id: 'desc' }, take: limit });
        return { success: true, data: { inquiries, total: inquiries.length } };
    }
    async create(dto) {
        const data = await this.prisma.inquiry.create({ data: dto });
        return { success: true, data };
    }
    async findOne(id) {
        const data = await this.prisma.inquiry.findUnique({ where: { id } });
        return { success: true, data };
    }
    async update(id, dto) {
        const data = await this.prisma.inquiry.update({ where: { id }, data: dto });
        return { success: true, data };
    }
    async remove(id) {
        const data = await this.prisma.inquiry.delete({ where: { id } });
        return { success: true, data };
    }
    async getStats() {
        const [total, new_count, followUp, converted, lost] = await Promise.all([
            this.prisma.inquiry.count(),
            this.prisma.inquiry.count({ where: { status: 'NEW' } }),
            this.prisma.inquiry.count({ where: { status: 'FOLLOW_UP' } }),
            this.prisma.inquiry.count({ where: { status: 'CONVERTED' } }),
            this.prisma.inquiry.count({ where: { status: 'LOST' } }),
        ]);
        return { success: true, data: { total, new: new_count, followUp, converted, lost } };
    }
};
exports.InquiriesService = InquiriesService;
exports.InquiriesService = InquiriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InquiriesService);
//# sourceMappingURL=inquiries.service.js.map