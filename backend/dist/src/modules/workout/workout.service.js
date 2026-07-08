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
exports.WorkoutService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let WorkoutService = class WorkoutService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllWorkouts(query) {
        const data = await this.prisma.workout.findMany({ where: { isActive: true }, orderBy: { id: 'asc' } });
        return { success: true, data };
    }
    async createWorkout(dto) {
        const data = await this.prisma.workout.create({ data: dto });
        return { success: true, data };
    }
    async updateWorkout(id, dto) {
        const data = await this.prisma.workout.update({ where: { id }, data: dto });
        return { success: true, data };
    }
    async removeWorkout(id) {
        const data = await this.prisma.workout.update({ where: { id }, data: { isActive: false } });
        return { success: true, data };
    }
    async findAllDietPlans(query) {
        const data = await this.prisma.dietPlan.findMany({ where: { isActive: true }, orderBy: { id: 'asc' } });
        return { success: true, data };
    }
    async createDietPlan(dto) {
        const data = await this.prisma.dietPlan.create({ data: dto });
        return { success: true, data };
    }
    async updateDietPlan(id, dto) {
        const data = await this.prisma.dietPlan.update({ where: { id }, data: dto });
        return { success: true, data };
    }
    async removeDietPlan(id) {
        const data = await this.prisma.dietPlan.update({ where: { id }, data: { isActive: false } });
        return { success: true, data };
    }
};
exports.WorkoutService = WorkoutService;
exports.WorkoutService = WorkoutService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkoutService);
//# sourceMappingURL=workout.service.js.map