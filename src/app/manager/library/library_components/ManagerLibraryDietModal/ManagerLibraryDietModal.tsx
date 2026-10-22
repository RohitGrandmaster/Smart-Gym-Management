// RESPONSIBILITY: Form modal for creating or editing a diet plan in the Diet Library module.
'use client';

import { useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { useLibraryContext } from '@/app/manager/library/library_context/ManagerLibraryContext';
import { GOALS, DietSchema, type DietFormValues, EMPTY_DIET_FORM } from '@/app/manager/library/library_utils/ManagerLibrarySharedConstants';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';

export default function ManagerLibraryDietModal() {
 const { 
 showDietModal, setShowDietModal, 
 editDietId, editDietData, 
 saving, saveDietPlan 
 } = useLibraryContext();

 const { 
   register, 
   handleSubmit, 
   reset,
   control,
   formState: { errors } 
 } = useForm({
   resolver: zodResolver(DietSchema),
    defaultValues: (editDietData as unknown as DietFormValues) || (EMPTY_DIET_FORM as unknown as DietFormValues)
 });

 const onSubmit = async (data: Record<string, unknown>) => {
   await saveDietPlan(data);
 };

 useEffect(() => {
   if (editDietId && editDietData) {
     reset(editDietData as unknown as Partial<DietFormValues>);
   } else {
     reset(EMPTY_DIET_FORM as unknown as DietFormValues);
   }
 }, [showDietModal, editDietId, editDietData, reset]);

 if (!showDietModal) return null;

 return (
 <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
 <div className="bg-card rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border-2 border-primary max-h-[90vh] flex flex-col">
 <div className="sticky top-0 bg-card px-6 py-4 border-b border-border flex items-center justify-between">
 <h3 className="text-lg font-bold text-foreground">
 {editDietId ? 'Edit Diet Plan' : 'Add Diet Plan'}
 </h3>
 <button 
 onClick={() => setShowDietModal(false)} 
 className="p-2 rounded-lg hover:bg-primary-subtle text-secondary transition-colors"
 >
 <X size={18} />
 </button>
 </div>
 <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-secondary mb-1">Plan Name</label>
 <input type="text" {...register('name')} className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${errors.name ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-warning'} bg-input text-foreground`} />
 {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message as string}</p>}
 </div>
 <div>
 <label className="block text-sm font-medium text-secondary mb-1">Goal</label>
 <Controller name="goal" control={control} render={({ field }) => ( <SearchableDropdown value={field.value || ''} onChange={field.onChange} options={GOALS.map(g => ({ label: g, value: g }))} /> )} />
 </div>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {[
 { label: 'Calories', key: 'calories', placeholder: '2500' }, 
 { label: 'Protein (g)', key: 'protein', placeholder: '150' }, 
 { label: 'Carbs (g)', key: 'carbs', placeholder: '300' }, 
 { label: 'Fats (g)', key: 'fats', placeholder: '70' }
 ].map(f => (
 <div key={f.key}>
 <label className="block text-sm font-medium text-secondary mb-1">{f.label}</label>
 <input type="number" placeholder={f.placeholder} min="0" onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); }} {...register(f.key as "calories" | "protein" | "carbs" | "fats")} className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${errors[f.key as keyof DietFormValues] ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-warning'} bg-input text-foreground`} />
 {errors[f.key as keyof DietFormValues] && <p className="text-danger text-xs mt-1">{(errors[f.key as keyof DietFormValues] as {message?: string})?.message}</p>}
 </div>
 ))}
 </div>

 <div>
 <label className="block text-sm font-medium text-secondary mb-1">Description</label>
 <input type="text" {...register('description')} className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${errors.description ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-warning'} bg-input text-foreground`} />
 {errors.description && <p className="text-danger text-xs mt-1">{errors.description.message as string}</p>}
 </div>

 <div>
 <label className="block text-sm font-medium text-secondary mb-1">Meals (one per line)</label>
 <textarea {...register('meals')} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-warning bg-input text-foreground h-32 resize-none" placeholder="Meal 1: Oats and eggs&#10;Meal 2: Chicken and rice" />
 </div>
 <div className="flex gap-3 pt-2">
 <button 
 type="button" 
 onClick={() => setShowDietModal(false)} 
 className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-primary-subtle transition-colors"
 >
 Cancel
 </button>
 <button 
 type="submit" 
 disabled={saving} 
 className="flex-1 py-2.5 rounded-xl text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-70 transition-colors" 
 >
 {saving ? <Loader2 className="w-4 h-4 motion-safe:animate-spin" /> : <><Save size={15} />{editDietId ? 'Update' : 'Add'}</>}
 </button>
 </div>
 </form>
 </div>
 </div>
 );
}
