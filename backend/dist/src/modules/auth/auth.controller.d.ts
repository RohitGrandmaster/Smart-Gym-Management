import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        message: string;
        data: {
            accessToken: string;
            user: {
                id: number;
                email: string;
                name: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.Role;
                branch: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        };
    }>;
    getMe(user: {
        id: number;
    }): Promise<{
        message: string;
        data: {
            id: number;
            email: string;
            name: string;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
            branch: string | null;
            isActive: boolean;
            createdAt: Date;
        };
    }>;
}
