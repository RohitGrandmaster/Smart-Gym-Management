// RESPONSIBILITY: Centralized constants, schema, and shared utilities for the Diet Library module.
import { z } from 'zod';


export const DietSchema = z.object({
  name: z.string().min(2, "Name is required"),
  goal: z.string(),
  calories: z.coerce.number().min(0).optional(),
  protein: z.coerce.number().min(0).optional(),
  carbs: z.coerce.number().min(0).optional(),
  fats: z.coerce.number().min(0).optional(),
  description: z.string().optional(),
  meals: z.string().optional()
});

export type DietFormValues = z.infer<typeof DietSchema>;

export const GOALS = ['Weight Loss', 'Muscle Gain', 'Maintenance', 'Endurance', 'Flexibility'];


export const EMPTY_DIET_FORM = { 
 name: '', 
 goal: 'Weight Loss', 
 calories: '', 
 protein: '', 
 carbs: '', 
 fats: '', 
 description: '', 
 meals: '' 
};


