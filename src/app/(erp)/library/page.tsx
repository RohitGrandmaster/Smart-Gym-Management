'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Search, Plus, Utensils } from 'lucide-react';

const dietLibrary = [
  { name: 'Muscle Gain Diet', category: 'Muscle Building', calories: 3200, protein: '180g', carbs: '400g', fats: '80g', tags: ['High Protein', 'Bulk'] },
  { name: 'Fat Loss Plan', category: 'Weight Loss', calories: 1800, protein: '140g', carbs: '180g', fats: '60g', tags: ['Low Carb', 'Cut'] },
  { name: 'Ketogenic Diet', category: 'Keto', calories: 2000, protein: '120g', carbs: '25g', fats: '160g', tags: ['Keto', 'Low Carb'] },
  { name: 'Vegan Muscle Plan', category: 'Plant-Based', calories: 2800, protein: '150g', carbs: '380g', fats: '70g', tags: ['Vegan', 'Bulk'] },
  { name: 'Diabetic Friendly', category: 'Medical', calories: 1900, protein: '100g', carbs: '200g', fats: '55g', tags: ['Low GI', 'Medical'] },
  { name: 'Endurance Diet', category: 'Athletic', calories: 3500, protein: '160g', carbs: '480g', fats: '85g', tags: ['Endurance', 'High Carb'] },
  { name: 'Mediterranean Diet', category: 'Balanced', calories: 2200, protein: '110g', carbs: '280g', fats: '90g', tags: ['Balanced', 'Heart Healthy'] },
  { name: 'Recovery Nutrition', category: 'Medical', calories: 2100, protein: '130g', carbs: '240g', fats: '70g', tags: ['Recovery', 'Medical'] },
];

export default function Library() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(dietLibrary.map(d => d.category)))];
  const filtered = dietLibrary.filter(d => {
    const ms = d.name.toLowerCase().includes(search.toLowerCase());
    const mc = category === 'All' || d.category === category;
    return ms && mc;
  });

  return (
    <div className="min-h-full">
      <Header title="Diet Library" subtitle="Access a database of 5M+ food and diet plans for member satisfaction" />
      <div className="p-6 space-y-5">
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
                  style={category === cat ? { background: 'hsl(24 95% 53%)', color: 'white' } : { border: '1px solid #e5e7eb', color: '#4b5563' }}>
                  {cat}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-white rounded-lg font-medium whitespace-nowrap" style={{ background: 'hsl(24 95% 53%)' }}>
              <Plus size={15} /> Create Plan
            </button>
          </div>
        </div>

        <div className="rounded-xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">5 Million+ Food Database</h2>
              <p className="text-green-100 mt-1 text-sm">Access macro-tracked meal plans and individual food items from our comprehensive nutrition library</p>
            </div>
            <div className="text-5xl font-black text-green-300/40">5M+</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((plan, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-green-200 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"><Utensils size={17} className="text-green-600" /></div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{plan.category}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-3">{plan.calories} <span className="text-sm font-normal text-gray-500">kcal/day</span></p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[{ l: 'Protein', v: plan.protein, bg: 'bg-blue-50', c: 'text-blue-600' }, { l: 'Carbs', v: plan.carbs, bg: 'bg-yellow-50', c: 'text-yellow-600' }, { l: 'Fats', v: plan.fats, bg: 'bg-red-50', c: 'text-red-600' }].map(m => (
                  <div key={m.l} className={`${m.bg} rounded-lg p-2 text-center`}>
                    <p className={`text-sm font-bold ${m.c}`}>{m.v}</p>
                    <p className="text-xs text-gray-500">{m.l}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 mb-3">{plan.tags.map(tag => <span key={tag} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{tag}</span>)}</div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium">View</button>
                <button className="flex-1 py-2 text-sm text-white rounded-lg font-medium" style={{ background: '#22c55e' }}>Assign</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
