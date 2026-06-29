'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Plus, ShoppingCart, Package, TrendingUp, AlertTriangle } from 'lucide-react';

const products = [
  { id: 1, name: 'Whey Protein (1kg)', category: 'Supplements', price: '₹2,800', stock: 24, sold: 18, revenue: '₹50,400' },
  { id: 2, name: 'Creatine Monohydrate', category: 'Supplements', price: '₹800', stock: 5, sold: 32, revenue: '₹25,600' },
  { id: 3, name: 'Gym Gloves', category: 'Accessories', price: '₹450', stock: 42, sold: 15, revenue: '₹6,750' },
  { id: 4, name: 'Shaker Bottle', category: 'Accessories', price: '₹350', stock: 28, sold: 22, revenue: '₹7,700' },
  { id: 5, name: 'Pre-Workout', category: 'Supplements', price: '₹1,200', stock: 3, sold: 27, revenue: '₹32,400' },
  { id: 6, name: 'Resistance Bands', category: 'Equipment', price: '₹600', stock: 16, sold: 9, revenue: '₹5,400' },
  { id: 7, name: 'BCAA Powder', category: 'Supplements', price: '₹1,500', stock: 19, sold: 14, revenue: '₹21,000' },
];

const salesHistory = [
  { date: '28 Jun 2026', product: 'Whey Protein', qty: 2, customer: 'Rahul Sharma', amount: '₹5,600', method: 'UPI' },
  { date: '27 Jun 2026', product: 'Gym Gloves', qty: 1, customer: 'Priya Patel', amount: '₹450', method: 'Cash' },
  { date: '26 Jun 2026', product: 'Creatine', qty: 1, customer: 'Amit Kumar', amount: '₹800', method: 'Card' },
  { date: '25 Jun 2026', product: 'Pre-Workout', qty: 2, customer: 'Sneha Mehta', amount: '₹2,400', method: 'UPI' },
];

export default function Store() {
  const [tab, setTab] = useState('Products');
  const lowStock = products.filter(p => p.stock <= 5);

  return (
    <div className="min-h-full">
      <Header title="Store Management" subtitle="Manage inventory, product sales and purchase records" />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Monthly Sales', value: '₹1,53,450', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Orders Today', value: '12', icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Low Stock', value: lowStock.length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}><s.icon size={19} className={s.color} /></div>
              <div><p className="text-xs text-gray-500 font-medium">{s.label}</p><p className="text-xl font-bold text-gray-900">{s.value}</p></div>
            </div>
          ))}
        </div>

        {lowStock.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle size={17} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div><p className="text-sm font-semibold text-red-700">Low Stock Alert</p><p className="text-sm text-red-600">{lowStock.map(p => p.name).join(', ')} — need restocking</p></div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 flex justify-between items-center">
            <div className="flex">
              {['Products', 'Sales History', 'Purchase Orders'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${tab === t ? 'text-orange-600 bg-orange-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  style={tab === t ? { borderBottomColor: 'hsl(24 95% 53%)' } : {}}>
                  {t}
                </button>
              ))}
            </div>
            <div className="px-4">
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium" style={{ background: 'hsl(24 95% 53%)' }}><Plus size={15} /> Add Product</button>
            </div>
          </div>

          <div className="p-5">
            {tab === 'Products' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50"><tr>{['Product', 'Category', 'Price', 'Stock', 'Sold', 'Revenue', 'Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center"><Package size={15} className="text-orange-500" /></div><span className="text-sm font-medium text-gray-900">{p.name}</span></div></td>
                        <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{p.category}</span></td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.price}</td>
                        <td className="px-4 py-3"><span className={`text-sm font-medium ${p.stock <= 5 ? 'text-red-600' : 'text-gray-900'}`}>{p.stock}</span></td>
                        <td className="px-4 py-3 text-sm text-gray-600">{p.sold}</td>
                        <td className="px-4 py-3 text-sm font-bold text-green-600">{p.revenue}</td>
                        <td className="px-4 py-3 flex gap-2"><button className="text-xs font-medium" style={{ color: 'hsl(24 95% 53%)' }}>Edit</button><button className="text-xs text-blue-500 font-medium">Restock</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {tab === 'Sales History' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50"><tr>{['Date', 'Product', 'Qty', 'Customer', 'Amount', 'Payment'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {salesHistory.map((s, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">{s.date}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.product}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{s.qty}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{s.customer}</td>
                        <td className="px-4 py-3 text-sm font-bold text-green-600">{s.amount}</td>
                        <td className="px-4 py-3"><span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{s.method}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {tab === 'Purchase Orders' && (
              <div className="text-center py-10 text-gray-500">
                <Package size={38} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No purchase orders yet</p>
                <p className="text-sm">Create a purchase order to restock your inventory</p>
                <button className="mt-4 px-4 py-2 text-white rounded-lg text-sm font-medium" style={{ background: 'hsl(24 95% 53%)' }}>Create Purchase Order</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
