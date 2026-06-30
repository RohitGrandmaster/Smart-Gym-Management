'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Utensils, Dumbbell, Users, Search, Filter, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
interface AssignedDiet { id: number; member: string; plan: string; goal: string; since: string; progress: number; compliance: string; nextFollowUp: string; }
interface AssignedWorkout { id: number; member: string; plan: string; level: string; since: string; progress: number; sessionsCompleted: number; totalSessions: number; }

// ─── Hardcoded Data ───────────────────────────────────────────────────────────
const initAssignedDiet: AssignedDiet[] = [
  { id: 1, member: 'Rahul Sharma', plan: 'Muscle Gain Diet', goal: 'Muscle Building', since: '01 Jan 2026', progress: 78, compliance: 'High', nextFollowUp: '05 Jul 2026' },
  { id: 2, member: 'Priya Patel',  plan: 'Fat Loss Plan',    goal: 'Weight Loss',     since: '15 Feb 2026', progress: 55, compliance: 'Medium', nextFollowUp: '02 Jul 2026' },
  { id: 3, member: 'Amit Kumar',   plan: 'Keto Diet',        goal: 'Ketogenic',       since: '08 Mar 2026', progress: 40, compliance: 'Low', nextFollowUp: '01 Jul 2026' },
  { id: 4, member: 'Sneha Mehta',  plan: 'Maintenance Diet', goal: 'Maintain Weight', since: '05 Apr 2026', progress: 90, compliance: 'High', nextFollowUp: '10 Jul 2026' },
  { id: 5, member: 'Rohit Yadav',  plan: 'Veg Protein Plan', goal: 'Muscle Building', since: '12 Jan 2026', progress: 65, compliance: 'Medium', nextFollowUp: '08 Jul 2026' },
];

const initAssignedWorkout: AssignedWorkout[] = [
  { id: 1, member: 'Rahul Sharma', plan: 'Push Pull Legs',   level: 'Intermediate', since: '01 Jan 2026', progress: 80, sessionsCompleted: 112, totalSessions: 144 },
  { id: 2, member: 'Priya Patel',  plan: 'HIIT Fat Burn',    level: 'Intermediate', since: '15 Feb 2026', progress: 60, sessionsCompleted: 28,  totalSessions: 48 },
  { id: 3, member: 'Sneha Mehta',  plan: 'Yoga Flow',        level: 'All Levels',   since: '05 Apr 2026', progress: 90, sessionsCompleted: 60,  totalSessions: 72 },
  { id: 4, member: 'Rohit Yadav',  plan: 'Arnold Split',     level: 'Advanced',     since: '12 Jan 2026', progress: 70, sessionsCompleted: 98,  totalSessions: 144 },
];

const GYM_ORANGE = 'hsl(24 95% 53%)';

export default function PlansTracker() {
  const [tab, setTab] = useState('Diet Assignments');
  const [search, setSearch] = useState('');
  
  const [assignedDiet, setAssignedDiet] = useState<AssignedDiet[]>(initAssignedDiet);
  const [assignedWorkout, setAssignedWorkout] = useState<AssignedWorkout[]>(initAssignedWorkout);

  const removeDiet = (id: number) => { if (confirm('Remove this assignment?')) setAssignedDiet(assignedDiet.filter(a => a.id !== id)); };
  const removeWorkout = (id: number) => { if (confirm('Remove this assignment?')) setAssignedWorkout(assignedWorkout.filter(a => a.id !== id)); };

  const filteredDiet = assignedDiet.filter(d => d.member.toLowerCase().includes(search.toLowerCase()) || d.plan.toLowerCase().includes(search.toLowerCase()));
  const filteredWorkout = assignedWorkout.filter(w => w.member.toLowerCase().includes(search.toLowerCase()) || w.plan.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-full pb-10">
      <Header title="Member Plan Tracking" subtitle="Track progress and compliance for member diet and workout plans" />
      <div className="p-6 space-y-5">
        
        {/* Banner */}
        <div className="rounded-xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ background: 'linear-gradient(135deg, hsl(24 95% 53%), hsl(20 95% 45%))' }}>
          <div>
            <h2 className="text-xl font-bold mb-1">Looking to create new plans?</h2>
            <p className="text-orange-100 text-sm max-w-xl">
              Plan creation has been moved to their respective master libraries to avoid duplication. Go to the Library to create plans and assign them to members.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/library" className="px-4 py-2 bg-white text-orange-600 rounded-lg text-sm font-bold hover:bg-orange-50 transition-colors">Diet Library</Link>
            <Link href="/workout" className="px-4 py-2 border-2 border-white text-white rounded-lg text-sm font-bold hover:bg-white/10 transition-colors">Workout Library</Link>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Active Diet Plans', value: assignedDiet.length, icon: Utensils, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Active Workout Plans', value: assignedWorkout.length, icon: Dumbbell, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Members on Track', value: '72%', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}><s.icon size={19} className={s.color} /></div>
              <div><p className="text-xs text-gray-500 font-medium">{s.label}</p><p className="text-xl font-bold text-gray-900">{s.value}</p></div>
            </div>
          ))}
        </div>

        {/* Main Interface */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 flex justify-between items-center">
            <div className="flex">
              {['Diet Assignments', 'Workout Assignments'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 ${tab === t ? 'text-orange-600 bg-orange-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  style={tab === t ? { borderBottomColor: GYM_ORANGE } : {}}>
                  {t}
                </button>
              ))}
            </div>
            <div className="px-4 flex gap-2">
              <div className="relative hidden sm:block">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search member or plan..." className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 w-48" />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"><Filter size={14} /> Filter</button>
            </div>
          </div>

          <div className="p-5">
            {tab === 'Diet Assignments' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50"><tr>{['Member', 'Assigned Diet', 'Goal', 'Compliance', 'Progress', 'Next Follow-up', 'Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredDiet.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-sm">{a.member.charAt(0)}</div><span className="text-sm font-medium text-gray-900">{a.member}</span></div></td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.plan}</td>
                        <td className="px-4 py-3"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{a.goal}</span></td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.compliance === 'High' ? 'bg-green-100 text-green-700' : a.compliance === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{a.compliance}</span></td>
                        <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[80px]"><div className="h-full bg-green-500 rounded-full" style={{ width: `${a.progress}%` }}></div></div><span className="text-xs text-gray-600 w-8">{a.progress}%</span></div></td>
                        <td className="px-4 py-3 text-sm text-gray-600">{a.nextFollowUp}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-500 hover:text-blue-700 p-1 bg-blue-50 rounded" title="View Progress"><Eye size={14} /></button>
                            <button onClick={() => removeDiet(a.id)} className="text-red-400 hover:text-red-600 p-1 bg-red-50 rounded" title="Remove Assignment"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredDiet.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-gray-500">No diet assignments found.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'Workout Assignments' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50"><tr>{['Member', 'Workout Plan', 'Level', 'Sessions', 'Progress', 'Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredWorkout.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">{a.member.charAt(0)}</div><span className="text-sm font-medium text-gray-900">{a.member}</span></div></td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.plan}</td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.level === 'Beginner' ? 'bg-green-100 text-green-700' : a.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : a.level === 'Advanced' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{a.level}</span></td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">{a.sessionsCompleted} <span className="text-gray-400 font-normal">/ {a.totalSessions}</span></p>
                        </td>
                        <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[80px]"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${a.progress}%` }}></div></div><span className="text-xs text-gray-600 w-8">{a.progress}%</span></div></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-500 hover:text-blue-700 p-1 bg-blue-50 rounded" title="View Progress"><Eye size={14} /></button>
                            <button onClick={() => removeWorkout(a.id)} className="text-red-400 hover:text-red-600 p-1 bg-red-50 rounded" title="Remove Assignment"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredWorkout.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-gray-500">No workout assignments found.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
