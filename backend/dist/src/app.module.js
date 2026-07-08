"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./database/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const members_module_1 = require("./modules/members/members.module");
const plans_module_1 = require("./modules/plans/plans.module");
const finance_module_1 = require("./modules/finance/finance.module");
const hr_module_1 = require("./modules/hr/hr.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const store_module_1 = require("./modules/store/store.module");
const workout_module_1 = require("./modules/workout/workout.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const inquiries_module_1 = require("./modules/inquiries/inquiries.module");
const settings_module_1 = require("./modules/settings/settings.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            members_module_1.MembersModule,
            plans_module_1.PlansModule,
            finance_module_1.FinanceModule,
            hr_module_1.HrModule,
            attendance_module_1.AttendanceModule,
            store_module_1.StoreModule,
            workout_module_1.WorkoutModule,
            dashboard_module_1.DashboardModule,
            inquiries_module_1.InquiriesModule,
            settings_module_1.SettingsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map