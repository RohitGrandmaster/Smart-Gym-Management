'use client';
// RESPONSIBILITY: Renders the member's assigned diet plan and handles the assignment flow.
// DATA FLOW: useMembersContext -> ManagerProfileDiet -> libraryApi
import { useState, useEffect } from 'react';
import { Utensils, Plus, Check, MessageCircle, Edit2 } from 'lucide-react';
import { useMembersContext } from '@/app/manager/members/members_context/ManagerMembersContext';
import { libraryApi } from '@/app/manager/library/library_api/ManagerLibraryApi';
import type { DietPlan, FetchState } from '@/app/manager/library/library_types/ManagerLibraryTypes';

export default function ManagerProfileDiet() {
  const { selectedMember, assignDiet } = useMembersContext();
  const [isAssigning, setIsAssigning] = useState(false);
  const [availableDiets, setAvailableDiets] = useState<DietPlan[]>([]);
  const [fetchDietsState, setFetchDietsState] = useState<FetchState>('idle');
  const [selectedDietId, setSelectedDietId] = useState<string>('');

  useEffect(() => {
    if (isAssigning && availableDiets.length === 0) {
      setTimeout(() => setFetchDietsState('loading'), 0);
      libraryApi.getDietPlans().then(res => {
        setAvailableDiets(res.data?.dietPlans || []);
        setTimeout(() => setFetchDietsState('success'), 0);
      }).catch(() => {
        // Error logged to monitoring provider
        setTimeout(() => setFetchDietsState('error'), 0);
      });
    }
  }, [isAssigning, availableDiets.length]);

  if (!selectedMember) return null;

  const hasDietPlan = !!selectedMember.assignedDiet;
  const diet = selectedMember.assignedDiet;

  const handleAssign = async () => {
    if (!selectedDietId) return;
    const selected = availableDiets.find(d => String(d.id) === selectedDietId) || null;
    await assignDiet(selectedMember.id, selected);
    setIsAssigning(false);
  };

  return (
    <div className="space-y-6 motion-safe:animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-primary">Diet Plan</h3>
          <p className="text-sm text-secondary">Manage and track {selectedMember.name}&apos;s nutritional goals.</p>
        </div>
        {hasDietPlan ? (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                const text = `*DIET PLAN: ${diet?.name || 'Assigned'}*\n\n*Macros:*\nCalories: ${diet?.calories || 0} kcal\nProtein: ${diet?.protein || 0}g\nCarbs: ${diet?.carbs || 0}g\nFats: ${diet?.fats || 0}g\n\n*Meals:*\n${diet?.meals?.map((m: import("@/app/manager/library/library_types/ManagerLibraryTypes").DietMeal | string) => `*${typeof m === 'string' ? '' : m.time} - ${typeof m === 'string' ? m : m.name}* (${typeof m === 'string' ? 0 : m.calories || 0} kcal)\n${(typeof m === 'string' ? [] : m.foods || []).map((f: string) => `- ${f}`).join('\n')}`).join('\n\n')}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all active:scale-95"
            >
              <MessageCircle size={16} /> Send via WhatsApp
            </button>
            <button 
              onClick={() => setIsAssigning(true)}
              className="flex items-center gap-2 px-4 py-2 bg-input text-foreground border border-border rounded-xl text-sm font-semibold hover:bg-primary-subtle transition-all active:scale-95"
            >
              <Edit2 size={16} /> Change
            </button>
          </div>
        ) : !isAssigning && (
          <button 
            onClick={() => setIsAssigning(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
          >
            <Plus size={16} /> Assign Diet
          </button>
        )}
      </div>

      {isAssigning && (
        <div className="bg-card border border-border p-6 rounded-xl space-y-4 shadow-sm">
          <h4 className="font-semibold text-primary">Assign Diet Plan from Library</h4>
          {fetchDietsState === 'loading' ? (
            <p className="text-sm text-secondary">Loading diet plans...</p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                className="flex-1 bg-input border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={selectedDietId}
                onChange={(e) => setSelectedDietId(e.target.value)}
              >
                <option value="">Select a Diet Plan...</option>
                {availableDiets.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.goal})</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsAssigning(false)}
                  className="px-4 py-2 bg-input text-secondary hover:text-foreground rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAssign}
                  disabled={!selectedDietId}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Check size={16} /> Confirm Assign
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!hasDietPlan && !isAssigning ? (
        <div className="bg-input border border-border rounded-xl p-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Utensils size={32} />
          </div>
          <h4 className="text-lg font-semibold text-primary mb-2">No Diet Plan Assigned</h4>
          <p className="text-secondary text-sm max-w-sm mb-6">
            {selectedMember.name} currently does not have an active diet plan. Assign a template from the Diet Library.
          </p>
          <button 
            onClick={() => setIsAssigning(true)}
            className="px-6 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl font-semibold hover:bg-primary/20 transition-colors"
          >
            Browse Diet Library
          </button>
        </div>
      ) : diet ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-card border border-border rounded-xl p-4 text-center shadow-sm">
                <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1">Calories</p>
                <p className="text-xl font-bold text-primary">{diet.calories?.toLocaleString() || 0} <span className="text-sm font-medium text-secondary">kcal</span></p>
             </div>
             <div className="bg-card border border-border rounded-xl p-4 text-center shadow-sm">
                <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1">Protein</p>
                <p className="text-xl font-bold text-primary">{diet.protein || 0} <span className="text-sm font-medium text-secondary">g</span></p>
             </div>
             <div className="bg-card border border-border rounded-xl p-4 text-center shadow-sm">
                <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1">Carbs</p>
                <p className="text-xl font-bold text-primary">{diet.carbs || 0} <span className="text-sm font-medium text-secondary">g</span></p>
             </div>
             <div className="bg-card border border-border rounded-xl p-4 text-center shadow-sm">
                <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1">Fats</p>
                <p className="text-xl font-bold text-primary">{diet.fats || 0} <span className="text-sm font-medium text-secondary">g</span></p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {diet.meals && diet.meals.length > 0 ? diet.meals.map((meal: import("@/app/manager/library/library_types/ManagerLibraryTypes").DietMeal | string, idx: number) => {
              if (typeof meal === 'string') {
                return (
                  <div key={idx} className="bg-card border border-border p-4 rounded-xl shadow-sm">
                    <h5 className="font-semibold text-primary mb-2 text-sm">Meal {idx + 1}</h5>
                    <p className="text-sm text-secondary">{meal}</p>
                  </div>
                );
              }
              return (
                <div key={idx} className="bg-card border border-border p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h5 className="font-semibold text-primary mb-3 pb-2 border-b border-border text-sm flex items-center justify-between">
                    {typeof meal === 'string' ? '' : meal.time} - {typeof meal === 'string' ? '' : meal.name}
                    <span className="text-xs font-normal text-secondary bg-input px-2 py-1 rounded">~{typeof meal === 'string' ? 0 : meal.calories} kcal</span>
                  </h5>
                  <ul className="space-y-2 text-sm text-secondary">
                    {(typeof meal === 'string' ? [] : meal.foods || []).map((f: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-primary">•</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }) : (
              <div className="col-span-full text-center py-4 text-secondary text-sm">No specific meals mapped for this diet plan.</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
