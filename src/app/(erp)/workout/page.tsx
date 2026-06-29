'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Search, Plus, Dumbbell } from 'lucide-react';

const workouts = [
  { name: 'Push Pull Legs', level: 'Intermediate', days: 6, exercises: 24, focus: 'Hypertrophy', duration: '75 min', tags: ['PPL', 'Classic'] },
  { name: 'Full Body Strength', level: 'Beginner', days: 3, exercises: 12, focus: 'Strength', duration: '45 min', tags: ['Compound', 'Beginner'] },
  { name: 'Arnold Split', level: 'Advanced', days: 6, exercises: 30, focus: 'Bodybuilding', duration: '90 min', tags: ['Classic', 'Volume'] },
  { name: 'HIIT Fat Burn', level: 'Intermediate', days: 4, exercises: 18, focus: 'Cardio', duration: '40 min', tags: ['HIIT', 'Cardio'] },
  { name: 'Calisthenics', level: 'Beginner', days: 4, exercises: 15, focus: 'Bodyweight', duration: '50 min', tags: ['Bodyweight', 'Flexible'] },
  { name: 'Powerlifting Program', level: 'Advanced', days: 4, exercises: 10, focus: 'Strength', duration: '80 min', tags: ['Powerlifting', 'Heavy'] },
];

const exercises = [
  { name: 'Barbell Squat', muscle: 'Quadriceps', equipment: 'Barbell', difficulty: 'Intermediate' },
  { name: 'Bench Press', muscle: 'Chest', equipment: 'Barbell', difficulty: 'Beginner' },
  { name: 'Deadlift', muscle: 'Posterior Chain', equipment: 'Barbell', difficulty: 'Advanced' },
  { name: 'Pull-Up', muscle: 'Back', equipment: 'Bodyweight', difficulty: 'Intermediate' },
  { name: 'Shoulder Press', muscle: 'Shoulders', equipment: 'Dumbbell', difficulty: 'Beginner' },
  { name: 'Romanian Deadlift', muscle: 'Hamstrings', equipment: 'Barbell', difficulty: 'Intermediate' },
];

export default function Workout() {
  const [tab, setTab] = useState('Workout Plans');
  const [search, setSearch] = useState('');
  const filtered = workouts.filter(w => w.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-full">
      <Header title="Workout Library" subtitle="Comprehensive exercise and workout plan database" />
      <div className="p-6 space-y-5">
        <div className="rounded-xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Complete Workout Database</h2>
              <p className="text-blue-100 mt-1 text-sm">Hundreds of professionally designed programs and thousands of individual exercises</p>
            </div>
            <Dumbbell size={56} className="text-blue-300/40" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 flex justify-between items-center">
            <div className="flex">
              {['Workout Plans', 'Exercise Library'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 ${tab === t ? 'text-orange-600 bg-orange-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  style={tab === t ? { borderBottomColor: 'hsl(24 95% 53%)' } : {}}>
                  {t}
                </button>
              ))}
            </div>
            <div className="px-4 flex gap-3 items-center">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 w-36" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium" style={{ background: 'hsl(24 95% 53%)' }}><Plus size={15} /> Add</button>
            </div>
          </div>

          <div className="p-5">
            {tab === 'Workout Plans' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((w, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><Dumbbell size={17} className="text-blue-600" /></div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${w.level === 'Beginner' ? 'bg-green-100 text-green-700' : w.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{w.level}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3">{w.name}</h3>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[{ l: 'Days', v: w.days }, { l: 'Exercises', v: w.exercises }, { l: 'Duration', v: w.duration }].map(s => (
                        <div key={s.l} className="bg-gray-50 rounded-lg p-2 text-center">
                          <p className="text-sm font-bold text-gray-900">{s.v}</p>
                          <p className="text-xs text-gray-500">{s.l}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">{w.tags.map(tag => <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{tag}</span>)}</div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium">View</button>
                      <button className="flex-1 py-2 text-sm text-white rounded-lg font-medium" style={{ background: '#3b82f6' }}>Assign</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'Exercise Library' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50"><tr>{['Exercise', 'Primary Muscle', 'Equipment', 'Difficulty', 'Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {exercises.map((ex, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{ex.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{ex.muscle}</td>
                        <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{ex.equipment}</span></td>
                        <td className="px-4 py-3"><span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${ex.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : ex.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{ex.difficulty}</span></td>
                        <td className="px-4 py-3"><button className="text-sm text-blue-500 hover:text-blue-600 font-medium">Add to Plan</button></td>
                      </tr>
                    ))}
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
