import { AttendanceService } from './attendance.service';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    markAttendance(dto: any): Promise<{
        success: boolean;
        data: {
            date: Date;
            checkIn: Date | null;
            checkOut: Date | null;
            type: import("@prisma/client").$Enums.AttendanceType;
            createdAt: Date;
            id: number;
            memberId: number | null;
            staffId: number | null;
        };
    }>;
    findAll(query: any): Promise<{
        success: boolean;
        data: ({
            member: {
                name: string;
            } | null;
            staff: {
                name: string;
            } | null;
        } & {
            date: Date;
            checkIn: Date | null;
            checkOut: Date | null;
            type: import("@prisma/client").$Enums.AttendanceType;
            createdAt: Date;
            id: number;
            memberId: number | null;
            staffId: number | null;
        })[];
    }>;
    getTodayStats(): Promise<{
        success: boolean;
        data: {
            totalCheckIns: number;
            memberCheckIns: number;
            staffCheckIns: number;
        };
    }>;
}
