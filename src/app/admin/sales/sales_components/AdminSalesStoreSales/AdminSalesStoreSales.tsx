// RESPONSIBILITY: Displays store orders and summary KPIs for Admin's Sales & Reports view. Read-only analytics.
'use client';

import { useAdminSalesLogic } from '@/app/admin/sales/sales_context/useAdminSalesLogic';
import { Package, ShoppingCart, IndianRupee, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminSalesStoreSales() {
  const { storeOrders, storeOrdersTotal, storeSummary, fetchState } = useAdminSalesLogic();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const methodColor: Record<string, string> = {
    Cash: 'bg-success-bg text-success',
    UPI: 'bg-primary/10 text-primary',
    Card: 'bg-warning-bg text-warning',
  };

  if (fetchState === 'loading') {
    return (
      <div className="space-y-4 motion-safe:animate-pulse">
        {[1,2,3,4].map(i => <div key={i} className="h-14 bg-input rounded-lg" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Summary Cards */}
      {storeSummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-input/60 rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 text-secondary text-xs font-medium mb-2">
              <Package size={14} /> Total Products
            </div>
            <div className="text-2xl font-bold text-foreground">{storeSummary.totalProducts}</div>
          </div>
          <div className="bg-input/60 rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 text-secondary text-xs font-medium mb-2">
              <ShoppingCart size={14} /> Total Orders
            </div>
            <div className="text-2xl font-bold text-foreground">{storeSummary.totalOrders}</div>
          </div>
          <div className="bg-input/60 rounded-xl p-4 border border-border md:col-span-2">
            <div className="flex items-center gap-2 text-secondary text-xs font-medium mb-2">
              <IndianRupee size={14} /> Total Store Revenue
            </div>
            <div className="text-2xl font-bold text-primary">{formatCurrency(storeSummary.totalRevenue)}</div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            Recent Store Orders
          </h3>
          <span className="text-xs text-secondary">{storeOrdersTotal} total orders</span>
        </div>

        {storeOrders.length === 0 ? (
          <div className="text-center py-10 text-secondary">
            <ShoppingCart size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No store orders found for this period.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {storeOrders.map(order => (
              <div key={order.id} className="bg-card border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-input/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ShoppingCart size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Order #{order.id.toUpperCase()}</p>
                      <p className="text-xs text-secondary">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${methodColor[order.method] || 'bg-input text-secondary'}`}>
                      {order.method}
                    </span>
                    <span className="font-bold text-foreground">{formatCurrency(order.total)}</span>
                    {expandedOrder === order.id ? <ChevronUp size={16} className="text-secondary" /> : <ChevronDown size={16} className="text-secondary" />}
                  </div>
                </button>

                {expandedOrder === order.id && order.items && (
                  <div className="border-t border-border bg-input/30 px-4 py-3">
                    <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Items</p>
                    <div className="space-y-1.5">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-foreground">{item.product.name} <span className="text-secondary">× {item.qty}</span></span>
                          <span className="text-secondary font-medium">{formatCurrency(item.price * item.qty)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-3 pt-2 border-t border-border">
                      <span className="text-sm font-semibold text-foreground">Total</span>
                      <span className="text-sm font-bold text-primary">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

