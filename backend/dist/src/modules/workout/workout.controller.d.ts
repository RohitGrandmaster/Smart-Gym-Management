import { WorkoutService } from './workout.service';
export declare class WorkoutController {
    private readonly workoutService;
    constructor(workoutService: WorkoutService);
    findAllWorkouts(query: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            category: string;
            muscleGroup: string[];
            sets: number | null;
            reps: string | null;
            duration: string | null;
            difficulty: string;
            description: string | null;
            videoUrl: string | null;
            imageUrl: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    createWorkout(dto: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            category: string;
            muscleGroup: string[];
            sets: number | null;
            reps: string | null;
            duration: string | null;
            difficulty: string;
            description: string | null;
            videoUrl: string | null;
            imageUrl: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateWorkout(id: string, dto: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            category: string;
            muscleGroup: string[];
            sets: number | null;
            reps: string | null;
            duration: string | null;
            difficulty: string;
            description: string | null;
            videoUrl: string | null;
            imageUrl: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    removeWorkout(id: string): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            category: string;
            muscleGroup: string[];
            sets: number | null;
            reps: string | null;
            duration: string | null;
            difficulty: string;
            description: string | null;
            videoUrl: string | null;
            imageUrl: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    findAllDietPlans(query: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            goal: string;
            calories: number | null;
            protein: number | null;
            carbs: number | null;
            fats: number | null;
            meals: string[];
        }[];
    }>;
    createDietPlan(dto: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            goal: string;
            calories: number | null;
            protein: number | null;
            carbs: number | null;
            fats: number | null;
            meals: string[];
        };
    }>;
    updateDietPlan(id: string, dto: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            goal: string;
            calories: number | null;
            protein: number | null;
            carbs: number | null;
            fats: number | null;
            meals: string[];
        };
    }>;
    removeDietPlan(id: string): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            goal: string;
            calories: number | null;
            protein: number | null;
            carbs: number | null;
            fats: number | null;
            meals: string[];
        };
    }>;
}
