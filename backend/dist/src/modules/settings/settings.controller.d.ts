import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<{
        success: boolean;
        data: {
            id: number;
            gymName: string;
            ownerName: string | null;
            phone: string | null;
            email: string | null;
            city: string | null;
            gstNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateSettings(dto: any): Promise<{
        success: boolean;
        data: {
            id: number;
            gymName: string;
            ownerName: string | null;
            phone: string | null;
            email: string | null;
            city: string | null;
            gstNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
