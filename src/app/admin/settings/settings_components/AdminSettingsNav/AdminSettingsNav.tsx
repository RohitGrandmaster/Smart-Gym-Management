// RESPONSIBILITY: Renders the left-side vertical navigation tabs for different settings sections.
'use client';

import { useAdminSettingsLogic } from '@/app/admin/settings/settings_context/useAdminSettingsLogic';
import { SETTINGS_TABS } from '@/app/admin/settings/settings_utils/SettingsSharedConstants';

export default function AdminSettingsNav() {
 const { activeTab, setActiveTab } = useAdminSettingsLogic();

 return (
 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
 {SETTINGS_TABS.map((s, i) => {
 const isActive = activeTab === s.title;
 return (
 <button 
 key={i} 
 onClick={() => setActiveTab(s.title)}
 className={`bg-card border rounded-xl p-5 text-left transition-all group ${
 isActive 
 ? 'border-warning shadow-md ring-1 ring-warning' 
 : 'border-border hover:border-warning dark:hover:border-warning hover:shadow-sm'
 }`}
 >
 <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
 <s.icon size={19} className={s.color} />
 </div>
 <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
 <p className="text-sm text-secondary">{s.desc}</p>
 </button>
 );
 })}
 </div>
 );
}

