// RESPONSIBILITY: Centralized constants, Zod schema, and shared data for the Plans module. Single source of truth for tiers, pricing, and form defaults.
import { z } from 'zod';

export const TIERS = ['BASIC', 'GOLD', 'PREMIUM'];

export const PlanSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  tier: z.string(),
  price1Month:  z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, 'Valid price required'),
  price3Month:  z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, 'Valid price required'),
  price6Month:  z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, 'Valid price required'),
  price12Month: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, 'Valid price required'),
  priceCustom:  z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, 'Valid price required'),
  features: z.string().min(2, 'Features are required')
});
export type PlanFormValues = z.infer<typeof PlanSchema>;

export const EMPTY_PLAN_FORM: PlanFormValues = { 
 name: '', 
 tier: 'BASIC', 
 price1Month: '', 
 price3Month: '', 
 price6Month: '', 
 price12Month: '', 
 priceCustom: '', 
 features: '' 
};

export const formatCurrency = (n: number) => '₹' + (n || 0).toLocaleString('en-IN');
