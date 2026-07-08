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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutController = void 0;
const common_1 = require("@nestjs/common");
const workout_service_1 = require("./workout.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let WorkoutController = class WorkoutController {
    workoutService;
    constructor(workoutService) {
        this.workoutService = workoutService;
    }
    findAllWorkouts(query) {
        return this.workoutService.findAllWorkouts(query);
    }
    createWorkout(dto) {
        return this.workoutService.createWorkout(dto);
    }
    updateWorkout(id, dto) {
        return this.workoutService.updateWorkout(+id, dto);
    }
    removeWorkout(id) {
        return this.workoutService.removeWorkout(+id);
    }
    findAllDietPlans(query) {
        return this.workoutService.findAllDietPlans(query);
    }
    createDietPlan(dto) {
        return this.workoutService.createDietPlan(dto);
    }
    updateDietPlan(id, dto) {
        return this.workoutService.updateDietPlan(+id, dto);
    }
    removeDietPlan(id) {
        return this.workoutService.removeDietPlan(+id);
    }
};
exports.WorkoutController = WorkoutController;
__decorate([
    (0, common_1.Get)('exercises'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkoutController.prototype, "findAllWorkouts", null);
__decorate([
    (0, common_1.Post)('exercises'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkoutController.prototype, "createWorkout", null);
__decorate([
    (0, common_1.Patch)('exercises/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkoutController.prototype, "updateWorkout", null);
__decorate([
    (0, common_1.Delete)('exercises/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkoutController.prototype, "removeWorkout", null);
__decorate([
    (0, common_1.Get)('diet-plans'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkoutController.prototype, "findAllDietPlans", null);
__decorate([
    (0, common_1.Post)('diet-plans'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkoutController.prototype, "createDietPlan", null);
__decorate([
    (0, common_1.Patch)('diet-plans/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkoutController.prototype, "updateDietPlan", null);
__decorate([
    (0, common_1.Delete)('diet-plans/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkoutController.prototype, "removeDietPlan", null);
exports.WorkoutController = WorkoutController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('workout'),
    __metadata("design:paramtypes", [workout_service_1.WorkoutService])
], WorkoutController);
//# sourceMappingURL=workout.controller.js.map