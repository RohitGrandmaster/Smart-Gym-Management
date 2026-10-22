// RESPONSIBILITY: Provides the implementation for ManagerSalesOverview.tsx functionality within its module.
'use client';

import { useSalesContext } from '@/app/manager/sales/sales_context/ManagerSalesContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area
} from 'recharts';
import { Loader2 } from 'lucide-react';

export default function ManagerSalesOverview() {
  const { overviewData, fetchState } = useSalesContext();

  if (fetchState === 'loading') {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 motion-safe:animate-spin text-primary" />
      </div>
    );
  }

  if (fetchState === 'error') {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-danger/30">
        <p className="text-danger font-medium">Failed to load sales overview.</p>
        <p className="text-sm mt-1 text-secondary">Please check your connection and try again.</p>
      </div>
    );
  }

 return (
 <div className="space-y-6">
 <div className="bg-card p-5 rounded-xl border border-border shadow-lg dark:shadow-none">
 <h3 className="font-bold text-foreground mb-4">Monthly Revenue (₹)</h3>
 <div className="h-72 w-full">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={overviewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}K`} />
      <Tooltip 
        cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
        formatter={(value: number | string | readonly (string | number)[] | undefined, name: any) => {
          const label = name === 'revenue' ? 'Memberships' : name === 'storeRevenue' ? 'Store POS' : name;
          return [`₹${Number(Array.isArray(value) ? value[0] : (value || 0)).toLocaleString()}`, label];
        }}
      />
      <Legend 
        verticalAlign="top" 
        height={36}
        formatter={(value) => <span className="text-secondary text-sm font-medium">{value === 'revenue' ? 'Memberships' : value === 'storeRevenue' ? 'Store POS' : value}</span>}
      />
      <Bar dataKey="revenue" stackId="a" fill="#4F46E5" barSize={40} />
      <Bar dataKey="storeRevenue" stackId="a" fill="#10B981" radius={[6, 6, 0, 0]} barSize={40} />
    </BarChart>
  </ResponsiveContainer>
 </div>
 </div>
 
 <div className="bg-card rounded-2xl p-5 shadow-lg border border-border col-span-1 md:col-span-2 lg:col-span-3">
 <h3 className="font-bold text-foreground mb-4">New Members Trend</h3>
 <div className="h-64 w-full">
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={overviewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <defs>
        <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4}/>
          <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
      <Tooltip 
        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
      />
      <Area type="monotone" dataKey="newMembers" stroke="#F43F5E" strokeWidth={3} fillOpacity={1} fill="url(#colorMembers)" />
    </AreaChart>
  </ResponsiveContainer>
 </div>
 </div>
 </div>
 );
}
