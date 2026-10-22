// RESPONSIBILITY: Renders the paginated order history table with status badges and customer info.
'use client';

import { Printer, MessageCircle } from 'lucide-react';
import type { Order } from '@/app/manager/store/store_types/ManagerStoreTypes';
import { useStoreContext } from '@/app/manager/store/store_context/ManagerStoreContext';
import { formatCurrency } from '@/app/manager/store/store_utils/ManagerStoreSharedConstants';
import { GYM_DETAILS } from '@/app/manager/manager_utils/ManagerSharedConstants';

import ManagerPagination from '@/app/manager/manager_components/ManagerShared/ManagerPagination';
import { MANAGER_ITEMS_PER_PAGE } from '@/app/manager/manager_utils/ManagerSharedConstants';

export default function ManagerStoreOrderTable() {
  const { 
    orders, totalOrders, fetchState, currentPage, setCurrentPage, setPrintData
  } = useStoreContext();

  const handlePrint = (o: Order) => {
    setPrintData({ 
      gymName: GYM_DETAILS.name, 
      gymPhone: GYM_DETAILS.phone, 
      receiptNo: `ORD-${o.id}`, 
      date: new Date(o.createdAt).toLocaleDateString('en-IN'), 
      customerName: 'Customer', 
      items: (o.items || []).map((i) => ({ 
        name: i.product?.name ? (i.product?.unit ? `${i.product.name} (${i.product.unit})` : i.product.name) : '', 
        price: i.price, 
        amount: i.price * i.qty 
      })), 
      total: o.total, 
      paymentMethod: o.method 
    });
    setTimeout(() => window.print(), 100);
  };

  const handleWhatsApp = (o: Order) => {
    const itemsText = (o.items || []).map(i => {
      const name = i.product?.name ? (i.product?.unit ? `${i.product.name} (${i.product.unit})` : i.product.name) : '';
      return `- ${name}\n  ${i.qty} x Rs. ${i.price.toLocaleString()} = Rs. ${(i.qty * i.price).toLocaleString()}`;
    }).join('\n');

    const text = `*${GYM_DETAILS.name.toUpperCase()}*\nPh: ${GYM_DETAILS.phone}\n\n*PAYMENT RECEIPT*\nReceipt No: ORD-${o.id}\nDate: ${new Date(o.createdAt).toLocaleDateString('en-IN')}\n\n*ITEMS:*\n${itemsText}\n\n*TOTAL: Rs. ${o.total.toLocaleString()}*\nPaid via: ${o.method}\n\nThank You!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  
  const totalPages = Math.ceil(totalOrders / MANAGER_ITEMS_PER_PAGE);

  if (fetchState === 'loading') {
    return (
      <div className="motion-safe:animate-pulse bg-card rounded-xl border border-border mt-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 border-b border-border flex items-center px-4 gap-4">
            <div className="h-4 bg-muted rounded w-16"></div>
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-4 bg-muted rounded w-20"></div>
            <div className="h-6 bg-muted rounded-full w-20"></div>
            <div className="h-6 bg-muted rounded-full w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (fetchState === 'error') {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-danger/30 mt-4">
        <p className="text-danger font-medium">Failed to load orders.</p>
        <p className="text-sm mt-1 text-secondary">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-96">

      <div className="overflow-x-auto flex-1 bg-card rounded-xl border border-border">
        <table className="w-full">
          <thead className="bg-input">
            <tr>
              {['Order ID', 'Total', 'Method', 'Status', 'Date', 'Receipt'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-secondary uppercase tracking-wider px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map(o => (
              <tr 
                key={o.id} 
                className="hover:bg-primary-subtle transition-colors cursor-pointer"
                onClick={() => handlePrint(o)}
              >
                <td className="px-4 py-3 text-sm font-mono text-foreground">
                  ORD-{String(o.id).padStart(4, '0')}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-success dark:text-success">
                  {formatCurrency(o.total)}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {o.method}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success-bg text-success dark:bg-success-bg dark:text-success">
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-secondary">
                  {new Date(o.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWhatsApp(o);
                    }}
                    className="p-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                    aria-label={`WhatsApp Receipt ORD-${o.id}`}
                    title="Send via WhatsApp"
                  >
                    <MessageCircle size={14} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrint(o);
                    }}
                    className="p-1.5 rounded-lg bg-input text-secondary hover:text-foreground transition-colors"
                    aria-label={`Print Receipt ORD-${o.id}`}
                    title="Print Receipt"
                  >
                    <Printer size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-secondary">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ManagerPagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        totalItems={totalOrders} 
        itemsPerPage={MANAGER_ITEMS_PER_PAGE} 
        onPageChange={setCurrentPage} 
      />
    </div>
  );
}
