import Header from '@/components/Header';
import { Settings, Bell, Shield, CreditCard, Building, Smartphone } from 'lucide-react';

export const metadata = {
  title: 'Settings – GymSmart ERP',
};

export default function SettingsPage() {
  return (
    <div className="min-h-full">
      <Header title="Settings" subtitle="Configure your gym management system" />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            { icon: Building, title: 'Gym Profile', desc: 'Update gym name, logo, address, and contact details', color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: CreditCard, title: 'Membership Plans', desc: 'Create and manage pricing plans and durations', color: 'text-green-600', bg: 'bg-green-50' },
            { icon: Bell, title: 'Notifications', desc: 'Configure SMS, email and WhatsApp alerts', color: 'text-orange-600', bg: 'bg-orange-50' },
            { icon: Shield, title: 'Roles & Permissions', desc: 'Manage admin roles and access control', color: 'text-purple-600', bg: 'bg-purple-50' },
            { icon: Smartphone, title: 'App Integration', desc: 'Member app settings and configurations', color: 'text-teal-600', bg: 'bg-teal-50' },
            { icon: Settings, title: 'General Settings', desc: 'System preferences, timezone, language', color: 'text-gray-600', bg: 'bg-gray-100' },
          ].map((s, i) => (
            <button key={i} className="bg-white border border-gray-100 rounded-xl p-5 text-left hover:border-orange-200 hover:shadow-sm transition-all group">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <s.icon size={19} className={s.color} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Gym Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2.5 text-sm text-white rounded-lg font-medium" style={{ background: 'hsl(24 95% 53%)' }}>Save Changes</button>
            <button className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">Reset</button>
          </div>
        </div>

        <div className="rounded-xl p-6 text-white" style={{ background: 'linear-gradient(135deg, hsl(24 95% 53%), hsl(20 95% 45%))' }}>
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
