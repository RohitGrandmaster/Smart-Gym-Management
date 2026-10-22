// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Form modal for creating or editing a diet plan in the Diet Library module.
'use client';

import { useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { useLibraryContext } from '@/app/trainer/library/library_context/LibraryContext';
import { GOALS, DietSchema, type DietFormValues, EMPTY_DIET_FORM } from '@/app/trainer/library/library_utils/LibrarySharedConstants';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';

export default function TrainerLibraryDietModal() {
 const { 
 showDietModal, closeDietModal, 
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
   defaultValues: (editDietData as DietFormValues) || (EMPTY_DIET_FORM as unknown as DietFormValues)
 });

 useEffect(() => {
   if (showDietModal && editDietData) {
     reset(editDietData);
   }
 }, [showDietModal, editDietData, reset]);

 if (!showDietModal) return null;

 return (
 <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
 <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
 <div className="sticky top-0 bg-card px-6 py-4 border-b border-border flex items-center justify-between">
 <h3 className="text-lg font-bold text-foreground">
 {editDietId ? 'Edit Diet Plan' : 'Add Diet Plan'}
 </h3>
 <button 
 onClick={() => closeDietModal()} 
 className="p-2 rounded-lg hover:bg-primary-subtle text-secondary motion-safe:transition-colors"
 >
 <X size={18} />
 </button>
 </div>
 <form onSubmit={handleSubmit(saveDietPlan as any)} className="p-6 space-y-4">
 {[
 { label: 'Plan Name', key: 'name', type: 'text' }, 
 { label: 'Calories', key: 'calories', type: 'number', placeholder: '2500' }, 
 { label: 'Protein (g)', key: 'protein', type: 'number', placeholder: '150' }, 
 { label: 'Carbs (g)', key: 'carbs', type: 'number', placeholder: '300' }, 
 { label: 'Fats (g)', key: 'fats', type: 'number', placeholder: '70' }, 
 { label: 'Description', key: 'description', type: 'text' },
 { label: 'Water Target', key: 'waterTarget', type: 'text', placeholder: 'e.g. 3 Liters' },
 { label: 'Supplements', key: 'supplements', type: 'text', placeholder: 'e.g. Creatine 5g' }
 ].map(f => (
 <div key={f.key}>
 <label className="block text-sm font-medium text-secondary mb-1">
 {f.label}
 </label>
 <input 
 type={f.type} 
 placeholder={f.placeholder} 
 min={f.type === 'number' ? "0" : undefined}
 onKeyDown={f.type === 'number' ? (e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); } : undefined}
 {...register(f.key as keyof DietFormValues)}
 className={`w-full border rounded-xl px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page ${
   errors[f.key as keyof DietFormValues] ? 'border-destructive focus-visible:ring-destructive' : 'border-border focus-visible:ring-warning'
 } bg-input text-foreground`}
 />
 {errors[f.key as keyof DietFormValues] && (
   <p className="text-danger text-xs mt-1">{errors[f.key as keyof DietFormValues]?.message}</p>
 )}
 </div>
 ))}
        <div className="grid grid-cols-1 gap-4">
 <div>
 <label className="block text-sm font-medium text-secondary mb-1">Goal</label>
 <Controller
   name="goal"
   control={control}
   render={({ field }) => (
     <SearchableDropdown
       value={field.value || ''}
       onChange={field.onChange}
       options={GOALS.map(g => ({ label: g, value: g }))}
     />
   )}
 />
 </div>
 </div>
 <div>
 <label className="block text-sm font-medium text-secondary mb-1">Meals (one per line)</label>
 <textarea 
 {...register('meals')}
 className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page focus-visible:ring-warning bg-input text-foreground h-32 resize-none"
 placeholder="Meal 1: Oats and eggs&#10;Meal 2: Chicken and rice"
 />
 </div>
 <div className="flex gap-3 pt-2">
 <button 
 type="button" 
 onClick={() => closeDietModal()} 
 className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-primary-subtle motion-safe:transition-colors"
 >
 Cancel
 </button>
 <button 
 type="submit" 
 disabled={saving} 
 className="flex-1 py-2.5 rounded-xl text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-70 motion-safe:transition-colors" 
 >
 {saving ? <Loader2 className="w-4 h-4 motion-safe:animate-spin" /> : <><Save size={15} />{editDietId ? 'Update' : 'Add'}</>}
 </button>
 </div>
 </form>
 </div>
 </div>
 );
}

