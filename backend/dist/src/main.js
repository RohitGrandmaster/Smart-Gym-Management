"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('GymSmart ERP API')
        .setDescription('Complete Gym Management System REST API')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
        .addTag('Auth', 'Authentication endpoints')
        .addTag('Members', 'Gym member management')
        .addTag('Plans', 'Membership plans')
        .addTag('Finance', 'Payments and billing')
        .addTag('HR', 'Staff and payroll')
        .addTag('Attendance', 'Attendance tracking')
        .addTag('Store', 'Product store and POS')
        .addTag('Workout', 'Workout and diet library')
        .addTag('Dashboard', 'Analytics and KPIs')
        .addTag('Inquiries', 'Lead management')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: { persistAuthorization: true },
    });
    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`\n🏋️  GymSmart Backend is running!`);
    console.log(`🚀  API:     http://localhost:${port}/api`);
    console.log(`📚  Docs:    http://localhost:${port}/api/docs\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map