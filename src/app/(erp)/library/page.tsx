'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Search, Plus, Utensils, Edit2, Trash2, X, Save, Eye } from 'lucide-react';

interface DietPlan {
  id: number; name: string; category: string; calories: number;
  protein: string; carbs: string; fats: string; tags: string[];
}

const initDietLibrary: DietPlan[] = [
  { id: 1, name: 'Muscle Gain Diet',  category: 'Muscle Building', calories: 3200, protein: '180g', carbs: '400g', fats: '80g',  tags: ['High Protein', 'Bulk'] },
  { id: 2, name: 'Fat Loss Plan',     category: 'Weight Loss',     calories: 1800, protein: '140g', carbs: '180g', fats: '60g',  tags: ['Low Carb', 'Cut'] },
  { id: 3, name: 'Ketogenic Diet',    category: 'Keto',            calories: 2000, protein: '120g', carbs: '25g',  fats: '160g', tags: ['Keto', 'Low Carb'] },
  { id: 4, name: 'Vegan Muscle Plan', category: 'Plant-Based',     calories: 2800, protein: '150g', carbs: '380g', fats: '70g',  tags: ['Vegan', 'Bulk'] },
  { id: 5, name: 'Diabetic Friendly', category: 'Medical',         calories: 1900, protein: '100g', carbs: '200g', fats: '55g',  tags: ['Low GI', 'Medical'] },
  { id: 6, name: 'Endurance Diet',    category: 'Athletic',        calories: 3500, protein: '160g', carbs: '480g', fats: '85g',  tags: ['Endurance', 'High Carb'] },
  { id: 7, name: 'Mediterranean Diet',category: 'Balanced',        calories: 2200, protein: '110g', carbs: '280g', fats: '90g',  tags: ['Balanced', 'Heart Healthy'] },
  { id: 8, name: 'Recovery Nutrition',category: 'Medical',         calories: 2100, protein: '130g', carbs: '240g', fats: '70g',  tags: ['Recovery', 'Medical'] },
];

const memberNames = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Mehta', 'Rohit Yadav', 'Anita Gupta', 'Vijay Singh', 'Kavita Sharma'];
const GYM_ORANGE = 'hsl(24 95% 53%)';

export default function Library() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [dietLibrary, setDietLibrary] = useState<DietPlan[]>(initDietLibrary);

  // Add/Edit modal
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', category: 'Muscle Building', calories: '', protein: '', carbs: '', fats: '', tags: '' });

  // View modal
  const [viewPlan, setViewPlan] = useState<DietPlan | null>(null);

  // Assign modal
  const [assignPlan, setAssignPlan] = useState<DietPlan | null>(null);
  const [assignMember, setAssignMember] = useState('');
  const [assigned, setAssigned] = useState<{ plan: string; member: string }[]>([]);

  const categories = ['All', ...Array.from(new Set(dietLibrary.map(d => d.category)))];
  const filtered = dietLibrary.filter(d => {
    const ms = d.name.toLowerCase().includes(search.toLowerCase());
    const mc = category === 'All' || d.category === category;
    return ms && mc;
  });

  // CRUD handlers
  const openAdd = () => { setEditId(null); setForm({ name: '', category: 'Muscle Building', calories: '', protein: '', carbs: '', fats: '', tags: '' }); setShowModal(true); };
  const openEdit = (p: DietPlan) => { setEditId(p.id); setForm({ name: p.name, category: p.category, calories: String(p.calories), protein: p.protein, carbs: p.carbs, fats: p.fats, tags: p.tags.join(', ') }); setShowModal(true); };
  const savePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const data: DietPlan = { id: editId || Date.now(), name: form.name, category: form.category, calories: Number(form.calories), protein: form.protein, carbs: form.carbs, fats: form.fats, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    if (editId) {
      setDietLibrary(dietLibrary.map(p => p.id === editId ? data : p));
    } else {
      setDietLibrary([data, ...dietLibrary]);
    }
    setShowModal(false);
  };
  const deletePlan = (id: number) => { if (confirm('Delete this diet plan?')) setDietLibrary(dietLibrary.filter(p => p.id !== id)); };

  const doAssign = () => {
    if (!assignPlan || !assignMember) return;
    setAssigned([...assigned, { plan: assignPlan.name, member: assignMember }]);
    setAssignPlan(null); setAssignMember('');
    alert(`✅ "${assignPlan.name}" assigned to ${assignMember} successfully!`);
  };

  return (
    <div className="min-h-full">
      <Header title="Diet Library" subtitle="Access and manage diet plans for member nutrition goals" />
      <div className="p-6 space-y-5">

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search diet plans..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className="px-3 py-2 text-sm rounded-lg font-medium transition-colors"
                  style={category === cat ? { background: GYM_ORANGE, color: 'white' } : { border: '1px solid #e5e7eb', color: '#4b5563' }}>
                  {cat}
                </button>
              ))}
            </div>
            <button onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-white rounded-lg font-medium whitespace-nowrap"
              style={{ background: GYM_ORANGE }}>
              <Plus size={15} /> Create Plan
            </button>
          </div>
        </div>

        {/* Stats banner */}
        <div className="rounded-xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Diet Plan Library</h2>
              <p className="text-green-100 mt-1 text-sm">{dietLibrary.length} plans available · {assigned.length} assignments made</p>
            </div>
            <div className="text-5xl font-black text-green-300/40">{dietLibrary.length}</div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(plan => (
            <div key={plan.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-green-200 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"><Utensils size={17} className="text-green-600" /></div>
                <div className="flex gap-1">
                  <button onClick={() => setViewPlan(plan)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="View"><Eye size={13} /></button>
                  <button onClick={() => openEdit(plan)} className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit"><Edit2 size={13} /></button>
                  <button onClick={() => deletePlan(plan.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={13} /></button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{plan.name}</h3>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{plan.category}</span>
              <p className="text-2xl font-bold text-gray-900 my-3">{plan.calories} <span className="text-sm font-normal text-gray-500">kcal/day</span></p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[{ l: 'Protein', v: plan.protein, bg: 'bg-blue-50', c: 'text-blue-600' }, { l: 'Carbs', v: plan.carbs, bg: 'bg-yellow-50', c: 'text-yellow-600' }, { l: 'Fats', v: plan.fats, bg: 'bg-red-50', c: 'text-red-600' }].map(m => (
                  <div key={m.l} className={`${m.bg} rounded-lg p-2 text-center`}>
                    <p className={`text-sm font-bold ${m.c}`}>{m.v}</p>
                    <p className="text-xs text-gray-500">{m.l}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 mb-3">{plan.tags.map(tag => <span key={tag} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{tag}</span>)}</div>
              <button onClick={() => { setAssignPlan(plan); setAssignMember(''); }}
                className="w-full py-2 text-sm text-white rounded-lg font-medium" style={{ background: '#22c55e' }}>
                Assign to Member
              </button>
            </div>
          ))}
          {filtered.length === 0 && <div className="col-span-3 text-center py-10 text-gray-500">No diet plans found.</div>}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="font-bold text-lg">{editId ? 'Edit Diet Plan' : 'Create Diet Plan'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={savePlan} className="p-5 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label><input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {['Muscle Building', 'Weight Loss', 'Keto', 'Plant-Based', 'Medical', 'Athletic', 'Balanced'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Calories/day *</label><input required type="number" value={form.calories} onChange={e => setForm({ ...form, calories: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Protein</label><input required type="text" placeholder="e.g. 150g" value={form.protein} onChange={e => setForm({ ...form, protein: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Carbs</label><input required type="text" placeholder="e.g. 300g" value={form.carbs} onChange={e => setForm({ ...form, carbs: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Fats</label><input required type="text" placeholder="e.g. 70g" value={form.fats} onChange={e => setForm({ ...form, fats: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label><input type="text" placeholder="e.g. High Protein, Bulk" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg font-medium text-white flex items-center gap-2" style={{ background: GYM_ORANGE }}><Save size={15} /> Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg">{viewPlan.name}</h3>
              <button onClick={() => setViewPlan(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{viewPlan.category}</span>
              <p className="text-3xl font-bold text-gray-900">{viewPlan.calories} <span className="text-base font-normal text-gray-500">kcal/day</span></p>
              <div className="grid grid-cols-3 gap-3">
                {[{ l: 'Protein', v: viewPlan.protein, bg: 'bg-blue-50', c: 'text-blue-600' }, { l: 'Carbs', v: viewPlan.carbs, bg: 'bg-yellow-50', c: 'text-yellow-600' }, { l: 'Fats', v: viewPlan.fats, bg: 'bg-red-50', c: 'text-red-600' }].map(m => (
                  <div key={m.l} className={`${m.bg} rounded-xl p-3 text-center`}>
                    <p className={`text-lg font-bold ${m.c}`}>{m.v}</p>
                    <p className="text-xs text-gray-500">{m.l}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">{viewPlan.tags.map(tag => <span key={tag} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">{tag}</span>)}</div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setViewPlan(null); setAssignPlan(viewPlan); }} className="flex-1 py-2.5 text-sm text-white rounded-xl font-semibold" style={{ background: '#22c55e' }}>Assign to Member</button>
                <button onClick={() => setViewPlan(null)} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg">Assign Plan</h3>
              <button onClick={() => setAssignPlan(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <p className="text-sm font-semibold text-green-800">{assignPlan.name}</p>
                <p className="text-xs text-green-600">{assignPlan.calories} kcal · {assignPlan.category}</p>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Select Member</label>
                <select value={assignMember} onChange={e => setAssignMember(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option value="">— Choose Member —</option>
                  {memberNames.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setAssignPlan(null)} className="px-4 py-2 border rounded-lg font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={doAssign} disabled={!assignMember} className="px-4 py-2 rounded-lg font-medium text-white disabled:opacity-50" style={{ background: '#22c55e' }}>Assign</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
