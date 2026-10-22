// RESPONSIBILITY: Handles the state and logic for managing gym store products (CRUD).
import { useState, useCallback } from 'react';
import type { Product } from '@/app/manager/store/store_types/ManagerStoreTypes';
import { storeApi } from '@/app/manager/store/store_api/ManagerStoreApi';
import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import { EMPTY_PRODUCT_FORM, ProductFormValues } from '@/app/manager/store/store_utils/ManagerStoreSharedConstants';
import { StoreSummary } from '@/app/manager/store/store_types/ManagerStoreTypes';

export function useManagerStoreProducts(
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  setSummary: React.Dispatch<React.SetStateAction<StoreSummary | null>>,
  showToast: (msg: string, type: ToastType) => void,
  setSaving: (saving: boolean) => void,
  confirm: (args: { title: string; message: string; confirmText: string; type: 'danger' | 'warning' }) => Promise<boolean>
) {
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editProductData, setEditProductData] = useState<ProductFormValues | null>(null);

  const openAddProduct = useCallback(() => { 
    setEditProductId(null); 
    setEditProductData(EMPTY_PRODUCT_FORM as unknown as ProductFormValues); 
    setShowProductModal(true); 
  }, []);
 
  const openEditProduct = useCallback((p: Product) => {
    setEditProductId(p.id);
    setEditProductData({ 
      name: p.name, 
      category: p.category, 
      price: p.price, 
      stock: p.stock, 
      description: p.description || '' 
    });
    setShowProductModal(true);
  }, []);

  const saveProduct = useCallback(async (data: Partial<ProductFormValues>) => {
    setSaving(true);
    try {
      if (editProductId) {
        const res = await storeApi.updateProduct(editProductId, data);
        const updatedProduct = res.data || data;
        setProducts(prev => prev.map(p => String(p.id) === String(editProductId) ? { ...p, ...updatedProduct } as unknown as Product : p));
        showToast(res.message || 'Product updated successfully', 'success');
      } else {
        const payload = { ...data, status: data.stock && data.stock > 0 ? 'In Stock' : 'Out of Stock' } as Partial<Product>;
        const res = await storeApi.createProduct(payload);
        const newProduct = res.data ? res.data : { ...payload, id: `prod-${Date.now()}`, sales: 0 } as unknown as Product;
        setProducts(prev => [newProduct, ...prev]);
        setSummary(prev => prev ? { ...prev, totalProducts: prev.totalProducts + 1 } : null);
        showToast(res.message || 'Product added successfully', 'success');
      }
      setShowProductModal(false);
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [editProductId, showToast, setProducts, setSummary, setSaving]);

  const deleteProduct = useCallback(async (id: string) => {
    const isConfirmed = await confirm({ title: 'Remove Product', message: 'Delete this product?', confirmText: 'Delete', type: 'danger' });
    if (!isConfirmed) return;
    try {
      const res = await storeApi.removeProduct(id);
      setProducts(prev => prev.filter(p => String(p.id) !== String(id)));
      setSummary(prev => prev ? { ...prev, totalProducts: Math.max(0, prev.totalProducts - 1) } : null);
      showToast(res.message || 'Product deleted', 'success');
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  }, [showToast, confirm, setProducts, setSummary]);

  return {
    showProductModal, setShowProductModal,
    editProductId, setEditProductId,
    editProductData, setEditProductData,
    openAddProduct, openEditProduct,
    saveProduct, deleteProduct
  };
}
