'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Plus, Utensils, Dumbbell, Users, ClipboardList, Edit2, Trash2, X, Save } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DietPlan {
  id: number; name: string; goal: string; calories: string;
  meals: number; assigned: number; duration: string;
}
interface WorkoutPlan {
  id: number; name: string; level: string; days: string;
  focus: string; exercises: number; assigned: number;
}
interface AssignedDiet { member: string; plan: string; goal: string; since: string; progress: number; }
interface AssignedWorkout { member: string; plan: string; level: string; since: string; progress: number; }

// ─── Hardcoded Data ───────────────────────────────────────────────────────────

const memberNames = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Mehta', 'Rohit Yadav', 'Anita Gupta', 'Vijay Singh', 'Kavita Sharma'];

const initAssignedDiet: AssignedDiet[] = [
  { member: 'Rahul Sharma', plan: 'Muscle Gain Diet', goal: 'Muscle Building', since: '01 Jan 2026', progress: 78 },
  { member: 'Priya Patel',  plan: 'Fat Loss Plan',    goal: 'Weight Loss',     since: '15 Feb 2026', progress: 55 },
  { member: 'Amit Kumar',   plan: 'Keto Diet',         goal: 'Ketogenic',       since: '08 Mar 2026', progress: 40 },
  { member: 'Sneha Mehta',  plan: 'Maintenance Diet',  goal: 'Maintain Weight', since: '05 Apr 2026', progress: 90 },
  { member: 'Rohit Yadav',  plan: 'Veg Protein Plan',  goal: 'Muscle Building', since: '12 Jan 2026', progress: 65 },
];

const initDietPlans: DietPlan[] = [
  { id: 1, name: 'Muscle Gain Diet',  goal: 'Muscle Building', calories: '3200 kcal', meals: 6, assigned: 48, duration: '12 weeks' },
  { id: 2, name: 'Fat Loss Plan',     goal: 'Weight Loss',     calories: '1800 kcal', meals: 5, assigned: 72, duration: '8 weeks' },
  { id: 3, name: 'Keto Diet',         goal: 'Ketogenic',       calories: '2000 kcal', meals: 4, assigned: 31, duration: '6 weeks' },
  { id: 4, name: 'Maintenance Diet',  goal: 'Maintain Weight', calories: '2400 kcal', meals: 5, assigned: 55, duration: 'Ongoing' },
  { id: 5, name: 'Veg Protein Plan',  goal: 'Muscle Building', calories: '2800 kcal', meals: 6, assigned: 23, duration: '10 weeks' },
];

const initAssignedWorkout: AssignedWorkout[] = [
  { member: 'Rahul Sharma', plan: 'Push Pull Legs',   level: 'Intermediate', since: '01 Jan 2026', progress: 80 },
  { member: 'Priya Patel',  plan: 'HIIT Fat Burn',    level: 'Intermediate', since: '15 Feb 2026', progress: 60 },
  { member: 'Sneha Mehta',  plan: 'Yoga Flow',        level: 'All Levels',   since: '05 Apr 2026', progress: 90 },
  { member: 'Rohit Yadav',  plan: 'Arnold Split',     level: 'Advanced',     since: '12 Jan 2026', progress: 70 },
];

const initWorkoutPlans: WorkoutPlan[] = [
  { id: 1, name: 'Beginner Strength',     level: 'Beginner',     days: '3 days/week', focus: 'Full Body',   exercises: 12, assigned: 64 },
  { id: 2, name: 'Advanced Bodybuilding', level: 'Advanced',     days: '6 days/week', focus: 'Split',       exercises: 28, assigned: 32 },
  { id: 3, name: 'HIIT Cardio',           level: 'Intermediate', days: '4 days/week', focus: 'Cardio',      exercises: 18, assigned: 41 },
  { id: 4, name: 'Powerlifting Program',  level: 'Advanced',     days: '4 days/week', focus: 'Strength',    exercises: 15, assigned: 19 },
  { id: 5, name: 'Yoga & Flexibility',   level: 'All Levels',   days: '5 days/week', focus: 'Flexibility', exercises: 22, assigned: 38 },
];

const GYM_ORANGE = 'hsl(24 95% 53%)';

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Plans() {
  const [mainTab, setMainTab] = useState('Diet Plans');
  const [dietTab, setDietTab] = useState('Assigned');
  const [workoutTab, setWorkoutTab] = useState('Assigned');

  // Diet plans state
  const [dietPlans, setDietPlans] = useState<DietPlan[]>(initDietPlans);
  const [assignedDiet, setAssignedDiet] = useState<AssignedDiet[]>(initAssignedDiet);

  // Workout plans state
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(initWorkoutPlans);
  const [assignedWorkout, setAssignedWorkout] = useState<AssignedWorkout[]>(initAssignedWorkout);

  // Diet plan modal
  const [showDietModal, setShowDietModal] = useState(false);
  const [editDietId, setEditDietId] = useState<number | null>(null);
  const [dietForm, setDietForm] = useState({ name: '', goal: 'Muscle Building', calories: '', meals: '', duration: '' });

  // Workout plan modal
  const [showWkModal, setShowWkModal] = useState(false);
  const [editWkId, setEditWkId] = useState<number | null>(null);
  const [wkForm, setWkForm] = useState({ name: '', level: 'Beginner', days: '', focus: '', exercises: '' });

  // Assign modals
  const [assignDietPlan, setAssignDietPlan] = useState<DietPlan | null>(null);
  const [assignWkPlan, setAssignWkPlan] = useState<WorkoutPlan | null>(null);
  const [assignMember, setAssignMember] = useState('');

  // ── Diet CRUD ────────────────────────────────────────────────────────────────

  const openAddDiet = () => { setEditDietId(null); setDietForm({ name: '', goal: 'Muscle Building', calories: '', meals: '', duration: '' }); setShowDietModal(true); };
  const openEditDiet = (p: DietPlan) => { setEditDietId(p.id); setDietForm({ name: p.name, goal: p.goal, calories: p.calories, meals: String(p.meals), duration: p.duration }); setShowDietModal(true); };
  const saveDiet = (e: React.FormEvent) => {
    e.preventDefault();
    if (editDietId) {
      setDietPlans(dietPlans.map(p => p.id === editDietId ? { ...p, ...dietForm, meals: Number(dietForm.meals) } : p));
    } else {
      setDietPlans([...dietPlans, { id: Date.now(), ...dietForm, meals: Number(dietForm.meals), assigned: 0 }]);
    }
    setShowDietModal(false);
  };
  const deleteDiet = (id: number) => { if (confirm('Delete this diet plan?')) setDietPlans(dietPlans.filter(p => p.id !== id)); };

  // ── Workout CRUD ─────────────────────────────────────────────────────────────

  const openAddWk = () => { setEditWkId(null); setWkForm({ name: '', level: 'Beginner', days: '', focus: '', exercises: '' }); setShowWkModal(true); };
  const openEditWk = (p: WorkoutPlan) => { setEditWkId(p.id); setWkForm({ name: p.name, level: p.level, days: p.days, focus: p.focus, exercises: String(p.exercises) }); setShowWkModal(true); };
  const saveWk = (e: React.FormEvent) => {
    e.preventDefault();
    if (editWkId) {
      setWorkoutPlans(workoutPlans.map(p => p.id === editWkId ? { ...p, ...wkForm, exercises: Number(wkForm.exercises) } : p));
    } else {
      setWorkoutPlans([...workoutPlans, { id: Date.now(), ...wkForm, exercises: Number(wkForm.exercises), assigned: 0 }]);
    }
    setShowWkModal(false);
  };
  const deleteWk = (id: number) => { if (confirm('Delete this workout plan?')) setWorkoutPlans(workoutPlans.filter(p => p.id !== id)); };

  // ── Assign handlers ──────────────────────────────────────────────────────────

  const doAssignDiet = () => {
    if (!assignDietPlan || !assignMember) return;
    setAssignedDiet([...assignedDiet, { member: assignMember, plan: assignDietPlan.name, goal: assignDietPlan.goal, since: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), progress: 0 }]);
    setDietPlans(dietPlans.map(p => p.id === assignDietPlan.id ? { ...p, assigned: p.assigned + 1 } : p));
    setAssignDietPlan(null); setAssignMember('');
  };

  const doAssignWk = () => {
    if (!assignWkPlan || !assignMember) return;
    setAssignedWorkout([...assignedWorkout, { member: assignMember, plan: assignWkPlan.name, level: assignWkPlan.level, since: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), progress: 0 }]);
    setWorkoutPlans(workoutPlans.map(p => p.id === assignWkPlan.id ? { ...p, assigned: p.assigned + 1 } : p));
    setAssignWkPlan(null); setAssignMember('');
  };

  const removeAssignedDiet = (idx: number) => { if (confirm('Remove this assignment?')) setAssignedDiet(assignedDiet.filter((_, i) => i !== idx)); };
  const removeAssignedWk = (idx: number) => { if (confirm('Remove this assignment?')) setAssignedWorkout(assignedWorkout.filter((_, i) => i !== idx)); };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-full pb-10">
      <Header title="Diet & Workout Plans" subtitle="Assign and manage diet and workout plans for members" />
      <div className="p-6 space-y-5">

        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Diet Plans', value: dietPlans.length, icon: Utensils, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Workout Plans', value: workoutPlans.length, icon: Dumbbell, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Members with Plans', value: Math.max(assignedDiet.length, assignedWorkout.length), icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}><s.icon size={19} className={s.color} /></div>
              <div><p className="text-xs text-gray-500 font-medium">{s.label}</p><p className="text-xl font-bold text-gray-900">{s.value}</p></div>
            </div>
          ))}
        </div>

        {/* Main Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 flex justify-between items-center">
            <div className="flex">
              {['Diet Plans', 'Workout Plans'].map(t => (
                <button key={t} onClick={() => setMainTab(t)}
                  className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 ${mainTab === t ? 'text-orange-600 bg-orange-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  style={mainTab === t ? { borderBottomColor: GYM_ORANGE } : {}}>
                  {t}
                </button>
              ))}
            </div>
            <div className="px-4">
              <button onClick={mainTab === 'Diet Plans' ? openAddDiet : openAddWk}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium"
                style={{ background: GYM_ORANGE }}>
                <Plus size={15} /> Create Plan
              </button>
            </div>
          </div>

          <div className="p-5">
            {/* ── DIET PLANS ── */}
            {mainTab === 'Diet Plans' && (
              <div>
                <div className="flex gap-3 mb-5 border-b border-gray-100">
                  {['Assigned', 'Plans'].map(t => (
                    <button key={t} onClick={() => setDietTab(t)}
                      className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${dietTab === t ? 'text-green-600' : 'border-transparent text-gray-500'}`}
                      style={dietTab === t ? { borderBottomColor: '#22c55e' } : {}}>
                      {t === 'Assigned' && <ClipboardList size={14} />}{t}
                    </button>
                  ))}
                </div>

                {dietTab === 'Assigned' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50"><tr>{['Member', 'Diet Plan', 'Goal', 'Since', 'Progress', 'Action'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-gray-100">
                        {assignedDiet.map((a, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-sm">{a.member.charAt(0)}</div><span className="text-sm font-medium text-gray-900">{a.member}</span></div></td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.plan}</td>
                            <td className="px-4 py-3"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{a.goal}</span></td>
                            <td className="px-4 py-3 text-sm text-gray-600">{a.since}</td>
                            <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[80px]"><div className="h-full bg-green-500 rounded-full" style={{ width: `${a.progress}%` }}></div></div><span className="text-xs text-gray-600 w-8">{a.progress}%</span></div></td>
                            <td className="px-4 py-3"><button onClick={() => removeAssignedDiet(i)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button></td>
                          </tr>
                        ))}
                        {assignedDiet.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-gray-500">No assignments yet.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                )}

                {dietTab === 'Plans' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {dietPlans.map(plan => (
                      <div key={plan.id} className="border border-gray-100 rounded-xl p-4 hover:border-green-200 hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"><Utensils size={17} className="text-green-600" /></div>
                          <div className="flex gap-1">
                            <button onClick={() => openEditDiet(plan)} className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={13} /></button>
                            <button onClick={() => deleteDiet(plan.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button>
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{plan.name}</h3>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{plan.goal}</span>
                        <div className="space-y-1.5 text-sm text-gray-500 my-3">
                          <div className="flex justify-between"><span>Calories</span><span className="font-medium text-gray-700">{plan.calories}</span></div>
                          <div className="flex justify-between"><span>Meals/day</span><span className="font-medium text-gray-700">{plan.meals}</span></div>
                          <div className="flex justify-between"><span>Duration</span><span className="font-medium text-gray-700">{plan.duration}</span></div>
                          <div className="flex justify-between"><span>Assigned</span><span className="font-medium" style={{ color: GYM_ORANGE }}>{plan.assigned} members</span></div>
                        </div>
                        <button onClick={() => { setAssignDietPlan(plan); setAssignMember(''); }}
                          className="w-full py-2 text-sm text-white rounded-lg font-medium" style={{ background: GYM_ORANGE }}>
                          Assign to Member
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── WORKOUT PLANS ── */}
            {mainTab === 'Workout Plans' && (
              <div>
                <div className="flex gap-3 mb-5 border-b border-gray-100">
                  {['Assigned', 'Plans'].map(t => (
                    <button key={t} onClick={() => setWorkoutTab(t)}
                      className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${workoutTab === t ? 'text-blue-600' : 'border-transparent text-gray-500'}`}
                      style={workoutTab === t ? { borderBottomColor: '#3b82f6' } : {}}>
                      {t}
                    </button>
                  ))}
                </div>

                {workoutTab === 'Assigned' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50"><tr>{['Member', 'Workout Plan', 'Level', 'Since', 'Progress', 'Action'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-gray-100">
                        {assignedWorkout.map((a, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">{a.member.charAt(0)}</div><span className="text-sm font-medium text-gray-900">{a.member}</span></div></td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.plan}</td>
                            <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.level === 'Beginner' ? 'bg-green-100 text-green-700' : a.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : a.level === 'Advanced' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{a.level}</span></td>
                            <td className="px-4 py-3 text-sm text-gray-600">{a.since}</td>
                            <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[80px]"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${a.progress}%` }}></div></div><span className="text-xs text-gray-600 w-8">{a.progress}%</span></div></td>
                            <td className="px-4 py-3"><button onClick={() => removeAssignedWk(i)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button></td>
                          </tr>
                        ))}
                        {assignedWorkout.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-gray-500">No assignments yet.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                )}

                {workoutTab === 'Plans' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {workoutPlans.map(plan => (
                      <div key={plan.id} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><Dumbbell size={17} className="text-blue-600" /></div>
                          <div className="flex gap-1">
                            <button onClick={() => openEditWk(plan)} className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={13} /></button>
                            <button onClick={() => deleteWk(plan.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button>
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{plan.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${plan.level === 'Beginner' ? 'bg-green-100 text-green-700' : plan.level === 'Advanced' ? 'bg-red-100 text-red-700' : plan.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{plan.level}</span>
                        <div className="space-y-1.5 text-sm text-gray-500 my-3">
                          <div className="flex justify-between"><span>Schedule</span><span className="font-medium text-gray-700">{plan.days}</span></div>
                          <div className="flex justify-between"><span>Focus</span><span className="font-medium text-gray-700">{plan.focus}</span></div>
                          <div className="flex justify-between"><span>Exercises</span><span className="font-medium text-gray-700">{plan.exercises}</span></div>
                          <div className="flex justify-between"><span>Assigned</span><span className="font-medium text-blue-600">{plan.assigned} members</span></div>
                        </div>
                        <button onClick={() => { setAssignWkPlan(plan); setAssignMember(''); }}
                          className="w-full py-2 text-sm text-white rounded-lg font-medium" style={{ background: '#3b82f6' }}>
                          Assign to Member
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Diet Plan Modal ── */}
      {showDietModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg">{editDietId ? 'Edit Diet Plan' : 'Create Diet Plan'}</h3>
              <button onClick={() => setShowDietModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={saveDiet} className="p-5 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label><input required type="text" value={dietForm.name} onChange={e => setDietForm({ ...dietForm, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
                  <select value={dietForm.goal} onChange={e => setDietForm({ ...dietForm, goal: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {['Muscle Building', 'Weight Loss', 'Ketogenic', 'Maintain Weight', 'Athletic'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Calories</label><input required type="text" placeholder="e.g. 2500 kcal" value={dietForm.calories} onChange={e => setDietForm({ ...dietForm, calories: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Meals/day</label><input required type="number" min="1" max="8" value={dietForm.meals} onChange={e => setDietForm({ ...dietForm, meals: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration</label><input required type="text" placeholder="e.g. 8 weeks" value={dietForm.duration} onChange={e => setDietForm({ ...dietForm, duration: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowDietModal(false)} className="px-4 py-2 border rounded-lg font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg font-medium text-white flex items-center gap-2" style={{ background: GYM_ORANGE }}><Save size={15} /> Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Workout Plan Modal ── */}
      {showWkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg">{editWkId ? 'Edit Workout Plan' : 'Create Workout Plan'}</h3>
              <button onClick={() => setShowWkModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={saveWk} className="p-5 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label><input required type="text" value={wkForm.name} onChange={e => setWkForm({ ...wkForm, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select value={wkForm.level} onChange={e => setWkForm({ ...wkForm, level: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {['Beginner', 'Intermediate', 'Advanced', 'All Levels'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label><input required type="text" placeholder="e.g. 5 days/week" value={wkForm.days} onChange={e => setWkForm({ ...wkForm, days: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Focus Area</label><input required type="text" placeholder="e.g. Hypertrophy" value={wkForm.focus} onChange={e => setWkForm({ ...wkForm, focus: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">No. of Exercises</label><input required type="number" min="1" value={wkForm.exercises} onChange={e => setWkForm({ ...wkForm, exercises: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowWkModal(false)} className="px-4 py-2 border rounded-lg font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg font-medium text-white flex items-center gap-2" style={{ background: GYM_ORANGE }}><Save size={15} /> Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Assign Diet Modal ── */}
      {assignDietPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg">Assign: {assignDietPlan.name}</h3>
              <button onClick={() => setAssignDietPlan(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Select Member</label>
                <select value={assignMember} onChange={e => setAssignMember(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option value="">— Choose Member —</option>
                  {memberNames.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setAssignDietPlan(null)} className="px-4 py-2 border rounded-lg font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={doAssignDiet} disabled={!assignMember} className="px-4 py-2 rounded-lg font-medium text-white disabled:opacity-50" style={{ background: GYM_ORANGE }}>Assign</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Assign Workout Modal ── */}
      {assignWkPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg">Assign: {assignWkPlan.name}</h3>
              <button onClick={() => setAssignWkPlan(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Select Member</label>
                <select value={assignMember} onChange={e => setAssignMember(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option value="">— Choose Member —</option>
                  {memberNames.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setAssignWkPlan(null)} className="px-4 py-2 border rounded-lg font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={doAssignWk} disabled={!assignMember} className="px-4 py-2 rounded-lg font-medium text-white disabled:opacity-50" style={{ background: '#3b82f6' }}>Assign</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
