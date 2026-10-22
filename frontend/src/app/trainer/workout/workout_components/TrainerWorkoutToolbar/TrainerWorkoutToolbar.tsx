// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders the search input and category filter for the Workout Library (view-only, no Add button for trainers).
'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useWorkoutContext } from '@/app/trainer/workout/workout_context/WorkoutContext';
import { WORKOUT_TAB_OPTIONS, WORKOUT_FOCUS_OPTIONS, EXERCISE_MUSCLE_OPTIONS } from '@/app/trainer/workout/workout_utils/WorkoutSharedConstants';

export default function TrainerWorkoutToolbar() {
  const { tab, setTab, search, setSearch, filterCategory, setFilterCategory, setCurrentPage } = useWorkoutContext();
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => { setTimeout(() => setLocalSearch(search), 0); }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, search, setSearch, setCurrentPage]);

  return (
    <div className="border-b border-border flex justify-between items-center bg-card">
      <div className="flex overflow-x-auto">
        {WORKOUT_TAB_OPTIONS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3.5 text-sm font-medium motion-safe:transition-colors border-b-2 whitespace-nowrap ${
              tab === t
                ? 'text-primary bg-primary-subtle'
                : 'border-transparent text-secondary hover:text-foreground'
            }`}
            style={tab === t ? { borderBottomColor: 'var(--workout-highlight)' } : {}}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="px-4 flex gap-3 items-center">
        <div className="relative hidden sm:block">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            placeholder="Search..."
            className="pl-8 pr-3 py-2 text-sm border border-border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page focus-visible:ring-warning w-36 lg:w-48 bg-input text-foreground motion-safe:transition-all"
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-input text-foreground"
        >
          <option value="All">All Categories</option>
          {tab === 'Workout Plans'
            ? WORKOUT_FOCUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)
            : EXERCISE_MUSCLE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)
          }
        </select>
      </div>
    </div>
  );
}
