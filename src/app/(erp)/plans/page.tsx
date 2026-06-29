'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Plus, Utensils, Dumbbell, Users, ClipboardList } from 'lucide-react';

const assignedDietPlans = [
  { member: 'Rahul Sharma', plan: 'Muscle Gain Diet', goal: 'Muscle Building', since: '01 Jan 2026', progress: 78 },
  { member: 'Priya Patel', plan: 'Fat Loss Plan', goal: 'Weight Loss', since: '15 Feb 2026', progress: 55 },
  { member: 'Amit Kumar', plan: 'Keto Diet', goal: 'Ketogenic', since: '08 Mar 2026', progress: 40 },
  { member: 'Sneha Mehta', plan: 'Maintenance Diet', goal: 'Maintain Weight', since: '05 Apr 2026', progress: 90 },
  { member: 'Rohit Yadav', plan: 'Veg Protein Plan', goal: 'Muscle Building', since: '12 Jan 2026', progress: 65 },
];

const dietPlans = [
  { id: 1, name: 'Muscle Gain Diet', goal: 'Muscle Building', calories: '3200 kcal', meals: 6, assigned: 48, duration: '12 weeks' },
  { id: 2, name: 'Fat Loss Plan', goal: 'Weight Loss', calories: '1800 kcal', meals: 5, assigned: 72, duration: '8 weeks' },
  { id: 3, name: 'Keto Diet', goal: 'Ketogenic', calories: '2000 kcal', meals: 4, assigned: 31, duration: '6 weeks' },
  { id: 4, name: 'Maintenance Diet', goal: 'Maintain Weight', calories: '2400 kcal', meals: 5, assigned: 55, duration: 'Ongoing' },
  { id: 5, name: 'Veg Protein Plan', goal: 'Muscle Building', calories: '2800 kcal', meals: 6, assigned: 23, duration: '10 weeks' },
];

const assignedWorkoutPlans = [
  { member: 'Rahul Sharma', plan: 'Push Pull Legs', level: 'Intermediate', since: '01 Jan 2026', progress: 80 },
  { member: 'Priya Patel', plan: 'HIIT Fat Burn', level: 'Intermediate', since: '15 Feb 2026', progress: 60 },
  { member: 'Sneha Mehta', plan: 'Yoga Flow', level: 'All Levels', since: '05 Apr 2026', progress: 90 },
  { member: 'Rohit Yadav', plan: 'Arnold Split', level: 'Advanced', since: '12 Jan 2026', progress: 70 },
];

const workoutPlans = [
  { id: 1, name: 'Beginner Strength', level: 'Beginner', days: '3 days/week', focus: 'Full Body', exercises: 12, assigned: 64 },
  { id: 2, name: 'Advanced Bodybuilding', level: 'Advanced', days: '6 days/week', focus: 'Split', exercises: 28, assigned: 32 },
  { id: 3, name: 'HIIT Cardio', level: 'Intermediate', days: '4 days/week', focus: 'Cardio', exercises: 18, assigned: 41 },
  { id: 4, name: 'Powerlifting Program', level: 'Advanced', days: '4 days/week', focus: 'Strength', exercises: 15, assigned: 19 },
  { id: 5, name: 'Yoga & Flexibility', level: 'All Levels', days: '5 days/week', focus: 'Flexibility', exercises: 22, assigned: 38 },
];

export default function Plans() {
  const [mainTab, setMainTab] = useState('Diet Plans');
  const [dietTab, setDietTab] = useState('Assigned');
  const [workoutTab, setWorkoutTab] = useState('Assigned');

  return (
    <div className="min-h-full">
      <Header title="Diet & Workout Plans" subtitle="Assign and manage diet and workout plans for members" />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Diet Plans', value: dietPlans.length, icon: Utensils, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Workout Plans', value: workoutPlans.length, icon: Dumbbell, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Members with Plans', value: '268', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}><s.icon size={19} className={s.color} /></div>
              <div><p className="text-xs text-gray-500 font-medium">{s.label}</p><p className="text-xl font-bold text-gray-900">{s.value}</p></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 flex justify-between items-center">
            <div className="flex">
              {['Diet Plans', 'Workout Plans'].map(t => (
                <button key={t} onClick={() => setMainTab(t)}
                  className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 ${mainTab === t ? 'text-orange-600 bg-orange-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  style={mainTab === t ? { borderBottomColor: 'hsl(24 95% 53%)' } : {}}>
                  {t}
                </button>
              ))}
            </div>
            <div className="px-4">
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium" style={{ background: 'hsl(24 95% 53%)' }}><Plus size={15} /> Create Plan</button>
            </div>
          </div>

          <div className="p-5">
            {mainTab === 'Diet Plans' && (
              <div>
                <div className="flex gap-3 mb-5 border-b border-gray-100 overflow-x-auto">
                  {['Assigned', 'Plans', 'Library'].map(t => (
                    <button key={t} onClick={() => setDietTab(t)}
                      className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${dietTab === t ? 'text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      style={dietTab === t ? { borderBottomColor: '#22c55e' } : {}}>
                      {t === 'Assigned' && <ClipboardList size={14} />}
                      {t === 'Plans' && <Utensils size={14} />}
                      {t}
                    </button>
                  ))}
                </div>
                {dietTab === 'Assigned' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50"><tr>{['Member', 'Diet Plan', 'Goal', 'Since', 'Progress'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-gray-100">
                        {assignedDietPlans.map((a, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-sm">{a.member.charAt(0)}</div><span className="text-sm font-medium text-gray-900">{a.member}</span></div></td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.plan}</td>
                            <td className="px-4 py-3"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{a.goal}</span></td>
                            <td className="px-4 py-3 text-sm text-gray-600">{a.since}</td>
                            <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[80px]"><div className="h-full bg-green-500 rounded-full" style={{ width: `${a.progress}%` }}></div></div><span className="text-xs text-gray-600 w-8">{a.progress}%</span></div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {dietTab === 'Plans' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {dietPlans.map(plan => (
                      <div key={plan.id} className="border border-gray-100 rounded-xl p-4 hover:border-green-200 hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between mb-3"><div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"><Utensils size={17} className="text-green-600" /></div><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{plan.goal}</span></div>
                        <h3 className="font-semibold text-gray-900 mb-3">{plan.name}</h3>
                        <div className="space-y-1.5 text-sm text-gray-500 mb-4">
                          <div className="flex justify-between"><span>Calories</span><span className="font-medium text-gray-700">{plan.calories}</span></div>
                          <div className="flex justify-between"><span>Meals/day</span><span className="font-medium text-gray-700">{plan.meals}</span></div>
                          <div className="flex justify-between"><span>Duration</span><span className="font-medium text-gray-700">{plan.duration}</span></div>
                          <div className="flex justify-between"><span>Assigned to</span><span className="font-medium" style={{ color: 'hsl(24 95% 53%)' }}>{plan.assigned} members</span></div>
                        </div>
                        <div className="flex gap-2"><button className="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium">Edit</button><button className="flex-1 py-2 text-sm text-white rounded-lg font-medium" style={{ background: 'hsl(24 95% 53%)' }}>Assign</button></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {mainTab === 'Workout Plans' && (
              <div>
                <div className="flex gap-3 mb-5 border-b border-gray-100 overflow-x-auto">
                  {['Assigned', 'Plans', 'Library'].map(t => (
                    <button key={t} onClick={() => setWorkoutTab(t)}
                      className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${workoutTab === t ? 'text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      style={workoutTab === t ? { borderBottomColor: '#3b82f6' } : {}}>
                      {t}
                    </button>
                  ))}
                </div>
                {workoutTab === 'Assigned' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50"><tr>{['Member', 'Workout Plan', 'Level', 'Since', 'Progress'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-gray-100">
                        {assignedWorkoutPlans.map((a, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">{a.member.charAt(0)}</div><span className="text-sm font-medium text-gray-900">{a.member}</span></div></td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.plan}</td>
                            <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.level === 'Beginner' ? 'bg-green-100 text-green-700' : a.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : a.level === 'Advanced' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{a.level}</span></td>
                            <td className="px-4 py-3 text-sm text-gray-600">{a.since}</td>
                            <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[80px]"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${a.progress}%` }}></div></div><span className="text-xs text-gray-600 w-8">{a.progress}%</span></div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {workoutTab === 'Plans' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {workoutPlans.map(plan => (
                      <div key={plan.id} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between mb-3"><div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><Dumbbell size={17} className="text-blue-600" /></div><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${plan.level === 'Beginner' ? 'bg-green-100 text-green-700' : plan.level === 'Advanced' ? 'bg-red-100 text-red-700' : plan.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{plan.level}</span></div>
                        <h3 className="font-semibold text-gray-900 mb-3">{plan.name}</h3>
                        <div className="space-y-1.5 text-sm text-gray-500 mb-4">
                          <div className="flex justify-between"><span>Schedule</span><span className="font-medium text-gray-700">{plan.days}</span></div>
                          <div className="flex justify-between"><span>Focus</span><span className="font-medium text-gray-700">{plan.focus}</span></div>
                          <div className="flex justify-between"><span>Exercises</span><span className="font-medium text-gray-700">{plan.exercises}</span></div>
                          <div className="flex justify-between"><span>Assigned to</span><span className="font-medium text-blue-600">{plan.assigned} members</span></div>
                        </div>
                        <div className="flex gap-2"><button className="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium">Edit</button><button className="flex-1 py-2 text-sm text-white rounded-lg font-medium" style={{ background: '#3b82f6' }}>Assign</button></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
