// RESPONSIBILITY: Defines all TypeScript types, interfaces, and the FetchState enum for the Store module.

import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import type { ManagerReceiptData } from '@/app/manager/manager_components/ManagerShared/ManagerThermalReceipt';
import { type ProductFormValues } from '@/app/manager/store/store_utils/ManagerStoreSharedConstants';


export interface StoreInitialData {
  products: Product[];
  orders: Order[];
  totalOrders: number;
  summary: StoreSummary | null;
}

export type FetchState = 'idle' | 'loading' | 'success' | 'error';

export interface OrderItem {
 productId: string;
 qty: number;
 name: string;
 price: number;
 unit?: string;
}

export interface StoreContextType {
 tab: string;
 setTab: (tab: string) => void;
 
 products: Product[];
 orders: Order[];
 totalOrders: number;
 summary: StoreSummary | null;
 fetchState: FetchState;
 saving: boolean;
 
  toast: { message: string; type: ToastType } | null;
  printData: ManagerReceiptData | null;
  
  search: string;
  debouncedSearch: string;
  setSearch: (s: string) => void;
  categoryFilter: string;
  setCategoryFilter: (s: string) => void;
  stockFilter: string;
  setStockFilter: (s: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  
  startDate: string;
  setStartDate: (d: string) => void;
  endDate: string;
  setEndDate: (d: string) => void;
  sortOrder: 'ASC' | 'DESC';
  setSortOrder: (o: 'ASC' | 'DESC') => void;
 
 showProductModal: boolean;
 setShowProductModal: (show: boolean) => void;
 editProductId: string | null;
 editProductData: ProductFormValues | null;
 
 showOrderModal: boolean;
 setShowOrderModal: (show: boolean) => void;
 orderItems: OrderItem[];
 orderMethod: string;
 setOrderMethod: (method: string) => void;
 customerPhone: string;
 setCustomerPhone: (p: string) => void;
 sendViaWhatsapp: boolean;
 setSendViaWhatsapp: (s: boolean) => void;
 
 hideToast: () => void;
 setPrintData: (data: ManagerReceiptData | null) => void;
 
 loadAll: () => Promise<void>;
 openAddProduct: () => void;
 openEditProduct: (p: Product) => void;
 saveProduct: (data: ProductFormValues) => Promise<void>;
 deleteProduct: (id: string) => Promise<void>;
 
 addToOrder: (p: Product) => void;
 removeFromOrder: (productId: string) => void;
 updateOrderQty: (productId: string, qty: number) => void;
 orderTotal: number;
 placeOrder: () => Promise<void>;
}

export interface Product {
  id: string; name: string; category: string; price: number;
  stock: number; description?: string; imageUrl?: string; isActive: boolean;
  unit?: string;
}
export interface Order {
  id: string; total: number; method: string; status: string;
  notes?: string; createdAt: string;
  items?: { id: string; qty: number; price: number; product: { name: string; unit?: string } }[];
}
export interface StoreSummary {
  totalProducts: number; totalOrders: number;
  totalRevenue: number; lowStockProducts: Product[];
}
