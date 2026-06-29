import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import { Users, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, UserCheck, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const recentMembers = [
  { name: 'Rahul Sharma', plan: 'Premium', status: 'Active', joined: '15 Jun 2026', amount: '₹2,500' },
  { name: 'Priya Patel', plan: 'Basic', status: 'Active', joined: '10 Jun 2026', amount: '₹1,200' },
  { name: 'Amit Kumar', plan: 'Gold', status: 'Pending', joined: '08 Jun 2026', amount: '₹1,800' },
  { name: 'Sneha Mehta', plan: 'Premium', status: 'Active', joined: '05 Jun 2026', amount: '₹2,500' },
  { name: 'Vijay Singh', plan: 'Basic', status: 'Expired', joined: '01 Jun 2026', amount: '₹1,200' },
];

const pendingPayments = [
  { name: 'Ravi Verma', amount: '₹1,800', dueDate: '25 Jun 2026', days: 3 },
  { name: 'Neha Joshi', amount: '₹2,500', dueDate: '28 Jun 2026', days: 6 },
  { name: 'Suresh Reddy', amount: '₹1,200', dueDate: '30 Jun 2026', days: 8 },
];

const plans = [
  { plan: 'Basic', count: 423, color: 'bg-blue-500', pct: 34 },
  { plan: 'Gold', count: 312, color: 'bg-yellow-500', pct: 25 },
  { plan: 'Premium', count: 389, color: 'bg-orange-500', pct: 31 },
  { plan: 'Annual', count: 124, color: 'bg-purple-500', pct: 10 },
];

export const metadata = {
  title: 'Dashboard – GymSmart ERP',
  description: 'GymSmart dashboard overview with member stats, revenue, and pending payments.',
};

export default function Dashboard() {
  return (
    <div className="min-h-full">
      <Header title="Dashboard" subtitle="Welcome back, Admin! Here's your gym overview." />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Members" value="1,248" change="12% from last month" changeType="up" icon={Users} iconBg="bg-blue-50" iconColor="text-blue-600" />
          <StatCard title="Monthly Revenue" value="₹3,42,500" change="8% from last month" changeType="up" icon={DollarSign} iconBg="bg-green-50" iconColor="text-green-600" />
          <StatCard title="Active Members" value="1,074" change="86% of total" changeType="neutral" icon={UserCheck} iconBg="bg-orange-50" iconColor="text-orange-600" />
          <StatCard title="Pending Payments" value="₹28,400" change="14 members" changeType="down" icon={AlertCircle} iconBg="bg-red-50" iconColor="text-red-600" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="New Members (Month)" value="64" change="vs 52 last month" changeType="up" icon={TrendingUp} iconBg="bg-purple-50" iconColor="text-purple-600" />
          <StatCard title="Expiring This Week" value="23" change="Need renewal" changeType="neutral" icon={Clock} iconBg="bg-yellow-50" iconColor="text-yellow-600" />
          <StatCard title="Store Sales" value="₹18,200" change="This month" changeType="up" icon={ShoppingCart} iconBg="bg-teal-50" iconColor="text-teal-600" />
          <StatCard title="Renewals Today" value="8" change="Completed" changeType="up" icon={CheckCircle} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Members</h2>
              <Link href="/members" className="text-sm font-medium hover:underline" style={{ color: 'hsl(24 95% 53%)' }}>View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Member', 'Plan', 'Status', 'Joined', 'Amount'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentMembers.map((m, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm">{m.name.charAt(0)}</div>
                          <span className="text-sm font-medium text-gray-900">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{m.plan}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${m.status === 'Active' ? 'bg-green-100 text-green-700' : m.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{m.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{m.joined}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{m.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Pending Payments</h2>
              <div className="space-y-3">
                {pendingPayments.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">Due: {p.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">{p.amount}</p>
                      <p className="text-xs text-gray-400">in {p.days} days</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full text-center text-sm font-medium" style={{ color: 'hsl(24 95% 53%)' }}>View all pending</button>
            </div>

            <div className="rounded-xl p-5 text-white" style={{ background: 'linear-gradient(135deg, hsl(24 95% 53%), hsl(20 95% 45%))' }}>
              <h3 className="font-semibold mb-1">Free Demo Available</h3>
              <p className="text-orange-100 text-sm mb-3">Get a free walkthrough of all GymSmart features</p>
              <div className="text-sm font-bold">+91 83479 77566</div>
              <button className="mt-3 bg-white text-orange-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors">WhatsApp Us</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Membership Distribution</h2>
          <div className="flex flex-wrap gap-3">
            {plans.map((p) => (
              <div key={p.plan} className="flex-1 min-w-[150px] bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${p.color}`}></div>
                  <span className="text-sm font-medium text-gray-700">{p.plan}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{p.count}</div>
                <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.pct}%` }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{p.pct}% of total</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
