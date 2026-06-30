'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Settings, Bell, Shield, CreditCard, Building, Smartphone, Save, RefreshCw } from 'lucide-react';

const GYM_ORANGE = 'hsl(24 95% 53%)';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Gym Profile');

  // Matrix Pricing State
  const [pricing, setPricing] = useState({
    Basic: { '1 Month': 1200, '3 Months': 3000, '6 Months': 5500, '12 Months': 10000 },
    Gold: { '1 Month': 1800, '3 Months': 4500, '6 Months': 8000, '12 Months': 15000 },
    Premium: { '1 Month': 2500, '3 Months': 6500, '6 Months': 12000, '12 Months': 22000 }
  });

  const handlePriceChange = (plan: 'Basic'|'Gold'|'Premium', duration: string, val: string) => {
    setPricing(prev => ({
      ...prev,
      [plan]: { ...prev[plan], [duration]: Number(val) }
    }));
  };

  const tabs = [
    { icon: Building, title: 'Gym Profile', desc: 'Update gym name, logo, address, and contact details', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: CreditCard, title: 'Membership Plans', desc: 'Manage tiers and duration pricing matrix', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Bell, title: 'Notifications', desc: 'Configure SMS, email and WhatsApp alerts', color: 'text-orange-600', bg: 'bg-orange-50' },
    { icon: Shield, title: 'Roles & Permissions', desc: 'Manage admin roles and access control', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Smartphone, title: 'App Integration', desc: 'Member app settings and configurations', color: 'text-teal-600', bg: 'bg-teal-50' },
    { icon: Settings, title: 'General Settings', desc: 'System preferences, timezone, language', color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  return (
    <div className="min-h-full pb-10">
      <Header title="Settings" subtitle="Configure your gym management system" />
      <div className="p-6 space-y-6">
        
        {/* Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {tabs.map((s, i) => (
            <button key={i} onClick={() => setActiveTab(s.title)}
              className={`bg-white border rounded-xl p-5 text-left transition-all group ${activeTab === s.title ? 'border-orange-400 shadow-md ring-1 ring-orange-400' : 'border-gray-100 hover:border-orange-200 hover:shadow-sm'}`}>
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <s.icon size={19} className={s.color} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-lg">{activeTab}</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 flex items-center gap-2"><RefreshCw size={14} /> Reset</button>
              <button className="px-4 py-2 text-sm text-white rounded-lg font-medium flex items-center gap-2" style={{ background: GYM_ORANGE }}><Save size={14} /> Save Changes</button>
            </div>
          </div>
          
          <div className="p-6">
            {activeTab === 'Gym Profile' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'Gym Name', value: 'GymSmart Fitness' },
                  { label: 'Owner Name', value: 'Admin User' },
                  { label: 'Phone Number', value: '+91 83479 77566' },
                  { label: 'Email', value: 'info@gymsmart.com' },
                  { label: 'City', value: 'Mumbai' },
                  { label: 'GST Number', value: '27XXXXX1234X1ZX' },
                ].map((f, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input type="text" defaultValue={f.value}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Membership Plans' && (
              <div className="space-y-6">
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                  <h3 className="font-semibold text-orange-800 mb-1">Pricing Matrix (₹)</h3>
                  <p className="text-sm text-orange-600">Configure base pricing for different plan tiers across multiple billing cycles. These prices will automatically apply when enrolling or renewing members.</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Plan Tier</th>
                        {['1 Month', '3 Months', '6 Months', '12 Months'].map(h => <th key={h} className="text-left font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(['Basic', 'Gold', 'Premium'] as const).map(plan => (
                        <tr key={plan} className="hover:bg-gray-50">
                          <td className="px-4 py-4 font-bold text-gray-900">{plan}</td>
                          {['1 Month', '3 Months', '6 Months', '12 Months'].map(dur => (
                            <td key={dur} className="px-4 py-3">
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                <input 
                                  type="number" 
                                  value={(pricing[plan] as any)[dur]} 
                                  onChange={(e) => handlePriceChange(plan, dur, e.target.value)}
                                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 font-semibold"
                                />
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab !== 'Gym Profile' && activeTab !== 'Membership Plans' && (
              <div className="text-center py-10 text-gray-500">
                <Settings size={48} className="mx-auto mb-3 text-gray-300" />
                <p>Settings for <strong>{activeTab}</strong> are currently under development.</p>
              </div>
            )}
          </div>
        </div>

        {/* Banner */}
        <div className="rounded-xl p-6 text-white mt-6" style={{ background: 'linear-gradient(135deg, hsl(24 95% 53%), hsl(20 95% 45%))' }}>
          <h2 className="text-xl font-bold mb-2">Ready to take your Gym to the next level?</h2>
          <p className="text-orange-100 mb-4">Get a FREE demo and see how GymSmart can transform your business</p>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-orange-200 text-xs font-medium uppercase tracking-wider mb-1">Call or WhatsApp for FREE Demo</p>
              <p className="text-2xl font-bold">+91 83479 77566</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-white text-orange-600 font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-orange-50">WhatsApp Demo</button>
              <button className="border-2 border-white text-white font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-orange-400">Call Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
