// RESPONSIBILITY: Form modal for creating or editing a gym store product in the Store module.
'use client';

import { useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useStoreContext } from '@/app/manager/store/store_context/ManagerStoreContext';
import { CATEGORIES, ProductSchema, type ProductFormValues, EMPTY_PRODUCT_FORM } from '@/app/manager/store/store_utils/ManagerStoreSharedConstants';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';

export default function ManagerStoreProductModal() {
 const { 
 showProductModal, setShowProductModal, 
 editProductId, editProductData, 
 saving, saveProduct 
 } = useStoreContext();

 const { 
   register, 
   handleSubmit, 
   reset,
   control,
   formState: { errors } 
 } = useForm({
   resolver: zodResolver(ProductSchema),
   defaultValues: editProductData || EMPTY_PRODUCT_FORM
 });

 useEffect(() => {
   if (showProductModal) {
     reset({ ...EMPTY_PRODUCT_FORM, ...(editProductData || {}) });
   }
 }, [showProductModal, editProductData, reset]);

 if (!showProductModal) return null;

 return (
 <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
 <div className="bg-card rounded-2xl shadow-xl w-full max-w-md max-h-full overflow-y-auto border-2 border-warning">
 <div className="sticky top-0 bg-card px-6 py-4 border-b border-border flex items-center justify-between">
 <h3 className="text-lg font-bold text-foreground">
 {editProductId ? 'Edit Product' : 'Add Product'}
 </h3>
 <button 
 onClick={() => setShowProductModal(false)} 
 className="p-2 rounded-lg hover:bg-primary-subtle text-secondary transition-colors"
 >
 <X size={18} />
 </button>
 </div>
 <form onSubmit={handleSubmit((data) => saveProduct(data))} className="p-6 space-y-4">
 {[
 { label: 'Product Name', key: 'name', type: 'text' }, 
 { label: 'Unit/Variant (e.g. 1 KG, 500 ML)', key: 'unit', type: 'text' },
 { label: 'Price (₹)', key: 'price', type: 'number' }, 
 { label: 'Stock Quantity', key: 'stock', type: 'number' }, 
 { label: 'Description', key: 'description', type: 'text' }
 ].map(f => (
 <div key={f.key}>
 <label className="block text-sm font-medium text-secondary mb-1">
 {f.label}
 </label>
 <input 
 type={f.type} 
 min={f.type === 'number' ? '0' : undefined}
 onKeyDown={f.type === 'number' ? (e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); } : undefined}
 {...register(f.key as keyof ProductFormValues, f.type === 'number' ? { valueAsNumber: true } : {})}
 className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
   errors[f.key as keyof ProductFormValues] ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-warning'
 } bg-input text-foreground`}
 />
 {errors[f.key as keyof ProductFormValues] && (
   <p className="text-danger text-xs mt-1">{errors[f.key as keyof ProductFormValues]?.message}</p>
 )}
 </div>
 ))}
 <div>
 <label className="block text-sm font-medium text-secondary mb-1">Category</label>
 <Controller
   name="category"
   control={control}
   render={({ field }) => (
     <SearchableDropdown
       value={field.value || ''}
       onChange={field.onChange}
       options={CATEGORIES.map(c => ({ label: c, value: c }))}
     />
   )}
 />
 </div>
 <div className="flex gap-3 pt-2">
 <button 
 type="button" 
 onClick={() => setShowProductModal(false)} 
 className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-primary-subtle transition-colors"
 >
 Cancel
 </button>
 <button 
 type="submit" 
 disabled={saving} 
 className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-70 transition-colors" 
 style={{ background: 'var(--store-highlight)' }}
 >
 {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full motion-safe:animate-spin" /> : <><Save size={15} />{editProductId ? 'Update' : 'Add Product'}</>}
 </button>
 </div>
 </form>
 </div>
 </div>
 );
}
