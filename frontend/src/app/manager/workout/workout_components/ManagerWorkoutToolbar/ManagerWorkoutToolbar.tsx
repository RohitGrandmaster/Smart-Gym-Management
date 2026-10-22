// RESPONSIBILITY: Renders the search input, muscle group filter, and Add Plan CTA for the Workout Library.
'use client';

import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { useWorkoutContext } from '@/app/manager/workout/workout_context/ManagerWorkoutContext';
import { WORKOUT_TAB_OPTIONS } from '@/app/manager/workout/workout_utils/ManagerWorkoutSharedConstants';

export default function ManagerWorkoutToolbar() {
  const { tab, setTab, search, setSearch, levelFilter, setLevelFilter, setCurrentPage, openAddWk, openAddEx } = useWorkoutContext();
  const [localSearch, setLocalSearch] = useState(search);

  const [prevSearch, setPrevSearch] = useState(search);

  if (search !== prevSearch) {
    setPrevSearch(search);
    setLocalSearch(search);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
        
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, search, setSearch, setCurrentPage]);

  return (
    <div className="border-b border-border flex justify-between items-center bg-card">
      <div className="flex overflow-x-auto">
        {WORKOUT_TAB_OPTIONS.map(t => (
          <button 
            key={t} 
            onClick={() => { setTab(t);  setSearch(''); }}
            className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
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
            className="pl-8 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-warning w-36 lg:w-48 bg-input text-foreground transition-all" 
          />
        </div>
        {tab === 'Workout Plans' && (
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="hidden sm:block px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warning bg-input text-foreground"
          >
            <option value="ALL">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        )}
        <button 
          onClick={tab === 'Workout Plans' ? openAddWk : openAddEx}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          style={{ background: 'var(--workout-highlight)' }}
        >
          <Plus size={15} /> <span className="hidden sm:inline">Add</span>
        </button>
      </div>
    </div>
  );
}
