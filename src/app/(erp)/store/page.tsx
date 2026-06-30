'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import ThermalReceipt, { ReceiptData } from '@/components/ThermalReceipt';
import {
  Plus, ShoppingCart, Package, TrendingUp, AlertTriangle,
  X, Edit2, Trash2, Printer,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  priceNum: number;
  stock: number;
  sold: number;
  revenue: string;
}

interface Sale {
  id: number;
  date: string;
  product: string;
  qty: number;
  customer: string;
  amount: string;
  method: string;
}

interface PurchaseOrder {
  id: number;
  supplier: string;
  product: string;
  qty: number;
  total: string;
  date: string;
  status: 'Pending' | 'Received' | 'Cancelled';
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const INIT_PRODUCTS: Product[] = [
  { id: 1, name: 'Whey Protein (1kg)',  category: 'Supplements', price: '₹2,800', priceNum: 2800, stock: 24, sold: 18, revenue: '₹50,400' },
  { id: 2, name: 'Creatine Monohydrate',category: 'Supplements', price: '₹800',   priceNum: 800,  stock: 5,  sold: 32, revenue: '₹25,600' },
  { id: 3, name: 'Gym Gloves',          category: 'Accessories', price: '₹450',   priceNum: 450,  stock: 42, sold: 15, revenue: '₹6,750'  },
  { id: 4, name: 'Shaker Bottle',       category: 'Accessories', price: '₹350',   priceNum: 350,  stock: 28, sold: 22, revenue: '₹7,700'  },
  { id: 5, name: 'Pre-Workout',         category: 'Supplements', price: '₹1,200', priceNum: 1200, stock: 3,  sold: 27, revenue: '₹32,400' },
  { id: 6, name: 'Resistance Bands',   category: 'Equipment',   price: '₹600',   priceNum: 600,  stock: 16, sold: 9,  revenue: '₹5,400'  },
  { id: 7, name: 'BCAA Powder',         category: 'Supplements', price: '₹1,500', priceNum: 1500, stock: 19, sold: 14, revenue: '₹21,000' },
];

const INIT_SALES: Sale[] = [
  { id: 1, date: '28 Jun 2026', product: 'Whey Protein', qty: 2, customer: 'Rahul Sharma', amount: '₹5,600', method: 'UPI'  },
  { id: 2, date: '27 Jun 2026', product: 'Gym Gloves',   qty: 1, customer: 'Priya Patel',  amount: '₹450',   method: 'Cash' },
  { id: 3, date: '26 Jun 2026', product: 'Creatine',     qty: 1, customer: 'Amit Kumar',   amount: '₹800',   method: 'Card' },
  { id: 4, date: '25 Jun 2026', product: 'Pre-Workout',  qty: 2, customer: 'Sneha Mehta',  amount: '₹2,400', method: 'UPI'  },
];

const INIT_PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 1, supplier: 'NutriSource Pvt Ltd', product: 'Whey Protein (1kg)',   qty: 50, total: '₹1,10,000', date: '20 Jun 2026', status: 'Received'  },
  { id: 2, supplier: 'FitGear Wholesale',   product: 'Gym Gloves',           qty: 100,total: '₹30,000',   date: '25 Jun 2026', status: 'Pending'   },
  { id: 3, supplier: 'SuppleFit India',     product: 'Creatine Monohydrate', qty: 30, total: '₹18,000',   date: '28 Jun 2026', status: 'Pending'   },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

const uid = () => Math.floor(Math.random() * 900000) + 100000;

const today = () => {
  const d = new Date();
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const STATUS_COLORS: Record<PurchaseOrder['status'], string> = {
  Pending:   'bg-yellow-100 text-yellow-700',
  Received:  'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const METHOD_COLORS: Record<string, string> = {
  UPI:  'bg-purple-100 text-purple-700',
  Cash: 'bg-green-100 text-green-700',
  Card: 'bg-blue-100 text-blue-700',
};

// ─── Shared UI ────────────────────────────────────────────────────────────────

function ModalShell({ title, onClose, children, footer }: {
  title: string; onClose: () => void;
  children: React.ReactNode; footer: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <X size={17} />
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">{children}</div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">{footer}</div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400';
const btnOrange = 'px-4 py-2.5 text-sm text-white rounded-lg font-medium transition-opacity hover:opacity-90';
const btnCancel = 'px-4 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700';

// ─── Product Modal ─────────────────────────────────────────────────────────────

interface ProductForm { name: string; category: string; priceNum: string; stock: string; }

function ProductModal({ initial, onClose, onSave }: {
  initial?: Product | null;
  onClose: () => void;
  onSave: (f: ProductForm) => void;
}) {
  const [form, setForm] = useState<ProductForm>({
    name:     initial?.name               ?? '',
    category: initial?.category           ?? 'Supplements',
    priceNum: initial?.priceNum.toString() ?? '',
    stock:    initial?.stock.toString()    ?? '',
  });
  const set = (k: keyof ProductForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <ModalShell
      title={initial ? 'Edit Product' : 'Add Product'}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnCancel}>Cancel</button>
          <button
            onClick={() => { if (form.name && form.priceNum && form.stock) onSave(form); }}
            className={btnOrange}
            style={{ background: 'hsl(24 95% 53%)' }}
          >
            {initial ? 'Save Changes' : 'Add Product'}
          </button>
        </>
      }
    >
      <Field label="Product Name" required>
        <input className={inputCls} value={form.name} onChange={set('name')} placeholder="e.g. Whey Protein (1kg)" />
      </Field>
      <Field label="Category" required>
        <select className={inputCls} value={form.category} onChange={set('category')}>
          <option>Supplements</option>
          <option>Accessories</option>
          <option>Equipment</option>
          <option>Apparel</option>
          <option>Food &amp; Drinks</option>
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (₹)" required>
          <input className={inputCls} type="number" min="0" value={form.priceNum} onChange={set('priceNum')} placeholder="e.g. 2800" />
        </Field>
        <Field label="Stock Qty" required>
          <input className={inputCls} type="number" min="0" value={form.stock} onChange={set('stock')} placeholder="e.g. 24" />
        </Field>
      </div>
    </ModalShell>
  );
}

// ─── Sale Modal ───────────────────────────────────────────────────────────────

interface SaleForm { product: string; qty: string; customer: string; amount: string; method: string; }

function SaleModal({ productNames, onClose, onSave }: {
  productNames: string[];
  onClose: () => void;
  onSave: (f: SaleForm) => void;
}) {
  const [form, setForm] = useState<SaleForm>({
    product:  productNames[0] ?? '',
    qty:      '1',
    customer: '',
    amount:   '',
    method:   'UPI',
  });
  const set = (k: keyof SaleForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <ModalShell
      title="Add Sale"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnCancel}>Cancel</button>
          <button
            onClick={() => { if (form.product && form.qty && form.customer && form.amount) onSave(form); }}
            className={btnOrange}
            style={{ background: 'hsl(24 95% 53%)' }}
          >
            Record Sale
          </button>
        </>
      }
    >
      <Field label="Product" required>
        <select className={inputCls} value={form.product} onChange={set('product')}>
          {productNames.map(n => <option key={n}>{n}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Quantity" required>
          <input className={inputCls} type="number" min="1" value={form.qty} onChange={set('qty')} />
        </Field>
        <Field label="Amount (₹)" required>
          <input className={inputCls} type="number" min="0" value={form.amount} onChange={set('amount')} placeholder="e.g. 5600" />
        </Field>
      </div>
      <Field label="Customer Name" required>
        <input className={inputCls} value={form.customer} onChange={set('customer')} placeholder="e.g. Rahul Sharma" />
      </Field>
      <Field label="Payment Method" required>
        <select className={inputCls} value={form.method} onChange={set('method')}>
          <option>UPI</option>
          <option>Cash</option>
          <option>Card</option>
          <option>Net Banking</option>
        </select>
      </Field>
    </ModalShell>
  );
}

// ─── Purchase Order Modal ──────────────────────────────────────────────────────

interface POForm { supplier: string; product: string; qty: string; total: string; date: string; status: PurchaseOrder['status']; }

function POModal({ initial, productNames, onClose, onSave }: {
  initial?: PurchaseOrder | null;
  productNames: string[];
  onClose: () => void;
  onSave: (f: POForm) => void;
}) {
  const [form, setForm] = useState<POForm>({
    supplier: initial?.supplier ?? '',
    product:  initial?.product  ?? productNames[0] ?? '',
    qty:      initial?.qty.toString() ?? '1',
    total:    initial?.total.replace(/[₹,]/g, '') ?? '',
    date:     initial?.date ?? today(),
    status:   initial?.status ?? 'Pending',
  });
  const set = (k: keyof POForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <ModalShell
      title={initial ? 'Edit Purchase Order' : 'Add Purchase Order'}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnCancel}>Cancel</button>
          <button
            onClick={() => { if (form.supplier && form.product && form.qty && form.total) onSave(form); }}
            className={btnOrange}
            style={{ background: 'hsl(24 95% 53%)' }}
          >
            {initial ? 'Save Changes' : 'Create Order'}
          </button>
        </>
      }
    >
      <Field label="Supplier Name" required>
        <input className={inputCls} value={form.supplier} onChange={set('supplier')} placeholder="e.g. NutriSource Pvt Ltd" />
      </Field>
      <Field label="Product" required>
        <select className={inputCls} value={form.product} onChange={set('product')}>
          {productNames.map(n => <option key={n}>{n}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Quantity" required>
          <input className={inputCls} type="number" min="1" value={form.qty} onChange={set('qty')} />
        </Field>
        <Field label="Total Amount (₹)" required>
          <input className={inputCls} type="number" min="0" value={form.total} onChange={set('total')} placeholder="e.g. 110000" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Order Date" required>
          <input className={inputCls} value={form.date} onChange={set('date')} placeholder="e.g. 30 Jun 2026" />
        </Field>
        <Field label="Status">
          <select className={inputCls} value={form.status} onChange={set('status') as React.ChangeEventHandler<HTMLSelectElement>}>
            <option>Pending</option>
            <option>Received</option>
            <option>Cancelled</option>
          </select>
        </Field>
      </div>
    </ModalShell>
  );
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────

function DeleteModal({ label, onClose, onConfirm }: { label: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <Trash2 size={18} className="text-red-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Confirm Delete?</p>
            <p className="text-sm text-gray-500 mt-0.5">This will permanently remove <span className="font-medium text-gray-800">{label}</span>.</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className={btnCancel}>Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2.5 text-sm text-white rounded-lg font-medium bg-red-600 hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab Button ───────────────────────────────────────────────────────────────

function TabBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
        active ? 'text-orange-600 bg-orange-50' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
      style={active ? { borderBottomColor: 'hsl(24 95% 53%)' } : {}}
    >
      {label}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Store() {
  const [tab, setTab] = useState<'Products' | 'Sales History' | 'Purchase Orders'>('Products');
  const [printData, setPrintData] = useState<ReceiptData | null>(null);

  const handlePrint = (sale: Sale) => {
    const amt = parseFloat(sale.amount.replace(/[^0-9.]/g, '')) || 0;
    setPrintData({
      gymName: 'GymSmart Fitness',
      gymPhone: '+91 83479 77566',
      receiptNo: `SALE-${sale.id}`,
      date: sale.date,
      customerName: sale.customer || 'Walk-in',
      items: [{ name: sale.product, qty: sale.qty, price: amt / sale.qty, amount: amt }],
      total: amt,
      paymentMethod: sale.method
    });
    setTimeout(() => window.print(), 100);
  };

  // Products state
  const [products, setProducts] = useState<Product[]>(INIT_PRODUCTS);
  const [productModal, setProductModal] = useState<'add' | 'edit' | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  // Sales state
  const [sales, setSales] = useState<Sale[]>(INIT_SALES);
  const [saleModal, setSaleModal] = useState(false);
  const [deleteSale, setDeleteSale] = useState<Sale | null>(null);

  // Purchase Orders state
  const [orders, setOrders] = useState<PurchaseOrder[]>(INIT_PURCHASE_ORDERS);
  const [poModal, setPOModal] = useState<'add' | 'edit' | null>(null);
  const [editOrder, setEditOrder] = useState<PurchaseOrder | null>(null);
  const [deleteOrder, setDeleteOrder] = useState<PurchaseOrder | null>(null);

  // Derived
  const lowStock = products.filter(p => p.stock <= 5);
  const productNames = products.map(p => p.name);
  const totalRevenue = sales.reduce((s, x) => {
    const n = parseInt(x.amount.replace(/[₹,]/g, ''), 10);
    return s + (isNaN(n) ? 0 : n);
  }, 0);

  // ── Product handlers ──────────────────────────────────────────────────────

  function handleSaveProduct(f: ProductForm) {
    const price = parseInt(f.priceNum, 10);
    const stock = parseInt(f.stock, 10);
    if (productModal === 'edit' && editProduct) {
      setProducts(ps => ps.map(p => p.id === editProduct.id ? {
        ...p,
        name: f.name,
        category: f.category,
        price: fmt(price),
        priceNum: price,
        stock,
        revenue: fmt(price * p.sold),
      } : p));
    } else {
      const np: Product = {
        id: uid(),
        name: f.name,
        category: f.category,
        price: fmt(price),
        priceNum: price,
        stock,
        sold: 0,
        revenue: '₹0',
      };
      setProducts(ps => [np, ...ps]);
    }
    setProductModal(null);
    setEditProduct(null);
  }

  function handleDeleteProduct() {
    if (!deleteProduct) return;
    setProducts(ps => ps.filter(p => p.id !== deleteProduct.id));
    setDeleteProduct(null);
  }

  // ── Sale handlers ─────────────────────────────────────────────────────────

  function handleSaveSale(f: SaleForm) {
    const ns: Sale = {
      id: uid(),
      date: today(),
      product: f.product,
      qty: parseInt(f.qty, 10),
      customer: f.customer,
      amount: fmt(parseInt(f.amount, 10)),
      method: f.method,
    };
    setSales(ss => [ns, ...ss]);
    setSaleModal(false);
  }

  function handleDeleteSale() {
    if (!deleteSale) return;
    setSales(ss => ss.filter(s => s.id !== deleteSale.id));
    setDeleteSale(null);
  }

  // ── Purchase Order handlers ───────────────────────────────────────────────

  function handleSavePO(f: POForm) {
    const total = fmt(parseInt(f.total, 10));
    if (poModal === 'edit' && editOrder) {
      setOrders(os => os.map(o => o.id === editOrder.id ? {
        ...o,
        supplier: f.supplier,
        product: f.product,
        qty: parseInt(f.qty, 10),
        total,
        date: f.date,
        status: f.status,
      } : o));
    } else {
      const np: PurchaseOrder = {
        id: uid(),
        supplier: f.supplier,
        product: f.product,
        qty: parseInt(f.qty, 10),
        total,
        date: f.date,
        status: f.status,
      };
      setOrders(os => [np, ...os]);
    }
    setPOModal(null);
    setEditOrder(null);
  }

  function handleDeleteOrder() {
    if (!deleteOrder) return;
    setOrders(os => os.filter(o => o.id !== deleteOrder.id));
    setDeleteOrder(null);
  }

  // ── Add button per tab ────────────────────────────────────────────────────

  function handleAddBtn() {
    if (tab === 'Products')        { setEditProduct(null); setProductModal('add'); }
    else if (tab === 'Sales History') setSaleModal(true);
    else                           { setEditOrder(null);   setPOModal('add'); }
  }

  const addLabel = tab === 'Products' ? 'Add Product'
    : tab === 'Sales History' ? 'Add Sale'
    : 'Purchase Order';

  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-full">
      <Header title="Store Management" subtitle="Manage inventory, product sales and purchase records" />

      <div className="p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Products', value: products.length,         icon: Package,       color: 'text-blue-600',   bg: 'bg-blue-50'   },
            { label: 'Monthly Sales',  value: fmt(totalRevenue),        icon: TrendingUp,    color: 'text-green-600',  bg: 'bg-green-50'  },
            { label: 'Pending Orders', value: orders.filter(o => o.status === 'Pending').length, icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Low Stock',      value: lowStock.length,          icon: AlertTriangle, color: 'text-red-600',    bg: 'bg-red-50'    },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon size={19} className={s.color} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Low stock alert */}
        {lowStock.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle size={17} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">Low Stock Alert</p>
              <p className="text-sm text-red-600">{lowStock.map(p => p.name).join(', ')} — need restocking</p>
            </div>
          </div>
        )}

        {/* Tab Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Tab bar */}
          <div className="border-b border-gray-100 flex justify-between items-center">
            <div className="flex">
              {(['Products', 'Sales History', 'Purchase Orders'] as const).map(t => (
                <TabBtn key={t} label={t} active={tab === t} onClick={() => setTab(t)} />
              ))}
            </div>
            <div className="px-4">
              <button
                onClick={handleAddBtn}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium transition-opacity hover:opacity-90"
                style={{ background: 'hsl(24 95% 53%)' }}
              >
                <Plus size={15} /> {addLabel}
              </button>
            </div>
          </div>

          <div className="p-5">

            {/* ── Products ── */}
            {tab === 'Products' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Product', 'Category', 'Price', 'Stock', 'Sold', 'Revenue', 'Actions'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package size={15} className="text-orange-500" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{p.category}</span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.price}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm font-medium ${p.stock <= 5 ? 'text-red-600' : 'text-gray-900'}`}>{p.stock}</span>
                            {p.stock <= 5 && (
                              <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Low</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{p.sold}</td>
                        <td className="px-4 py-3 text-sm font-bold text-green-600">{p.revenue}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              title="Edit"
                              onClick={() => { setEditProduct(p); setProductModal('edit'); }}
                              className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              title="Delete"
                              onClick={() => setDeleteProduct(p)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                          No products yet. Click &ldquo;Add Product&rdquo; to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Sales History ── */}
            {tab === 'Sales History' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Date', 'Product', 'Qty', 'Customer', 'Amount', 'Payment', 'Actions'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sales.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{s.date}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.product}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{s.qty}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{s.customer}</td>
                        <td className="px-4 py-3 text-sm font-bold text-green-600">{s.amount}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${METHOD_COLORS[s.method] ?? 'bg-gray-100 text-gray-700'}`}>
                            {s.method}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              title="Print Receipt"
                              onClick={() => handlePrint(s)}
                              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Printer size={14} />
                            </button>
                            <button
                              title="Delete"
                              onClick={() => setDeleteSale(s)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {sales.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                          No sales recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Purchase Orders ── */}
            {tab === 'Purchase Orders' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Supplier', 'Product', 'Qty', 'Total', 'Date', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map(o => (
                      <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{o.supplier}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package size={13} className="text-orange-500" />
                            </div>
                            <span className="text-sm text-gray-700">{o.product}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{o.qty}</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900">{o.total}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{o.date}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[o.status]}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              title="Edit"
                              onClick={() => { setEditOrder(o); setPOModal('edit'); }}
                              className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              title="Delete"
                              onClick={() => setDeleteOrder(o)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={7}>
                          <div className="text-center py-14 text-gray-400">
                            <Package size={38} className="mx-auto mb-3 text-gray-300" />
                            <p className="font-medium text-gray-500">No purchase orders yet</p>
                            <p className="text-sm mt-1">Create a purchase order to restock your inventory</p>
                            <button
                              onClick={() => { setEditOrder(null); setPOModal('add'); }}
                              className="mt-4 px-4 py-2 text-white rounded-lg text-sm font-medium"
                              style={{ background: 'hsl(24 95% 53%)' }}
                            >
                              Create Purchase Order
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Modals ── */}

      {productModal && (
        <ProductModal
          initial={productModal === 'edit' ? editProduct : null}
          onClose={() => { setProductModal(null); setEditProduct(null); }}
          onSave={handleSaveProduct}
        />
      )}

      {deleteProduct && (
        <DeleteModal
          label={deleteProduct.name}
          onClose={() => setDeleteProduct(null)}
          onConfirm={handleDeleteProduct}
        />
      )}

      {saleModal && (
        <SaleModal
          productNames={productNames}
          onClose={() => setSaleModal(false)}
          onSave={handleSaveSale}
        />
      )}

      {deleteSale && (
        <DeleteModal
          label={`${deleteSale.product} — ${deleteSale.customer}`}
          onClose={() => setDeleteSale(null)}
          onConfirm={handleDeleteSale}
        />
      )}

      {poModal && (
        <POModal
          initial={poModal === 'edit' ? editOrder : null}
          productNames={productNames}
          onClose={() => { setPOModal(null); setEditOrder(null); }}
          onSave={handleSavePO}
        />
      )}

      {deleteOrder && (
        <DeleteModal
          label={`PO — ${deleteOrder.product} (${deleteOrder.supplier})`}
          onClose={() => setDeleteOrder(null)}
          onConfirm={handleDeleteOrder}
        />
      )}
      
      <ThermalReceipt data={printData} />
    </div>
  );
}
