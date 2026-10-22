'use client';

import { useState } from 'react';
import TrainerHeader from '@/app/trainer/trainer_components/TrainerLayout/TrainerHeader';
import { Download, Users, CalendarCheck, TrendingUp, Dumbbell } from 'lucide-react';

const REPORT_TABS = [
  { id: 'members', label: 'My Members Report', icon: Users },
  { id: 'attendance', label: 'Attendance Report', icon: CalendarCheck },
  { id: 'progress', label: 'Progress Report', icon: TrendingUp },
  { id: 'workout', label: 'Workout Report', icon: Dumbbell },
];

export default function TrainerReportsMain() {
  const [activeTab, setActiveTab] = useState('members');

  return (
    <div className="min-h-full pb-10 bg-background text-foreground">
      <TrainerHeader title="Reports" subtitle="Export and analyze data for your assigned members only" />
      
      <div className="p-6 space-y-6">
        <div className="flex overflow-x-auto gap-2 pb-2">
          {REPORT_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap motion-safe:transition-colors ${
                  isActive ? 'bg-primary text-white shadow-md' : 'bg-card border border-border text-secondary hover:text-foreground'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-foreground">
                {REPORT_TABS.find(t => t.id === activeTab)?.label}
              </h3>
              <p className="text-sm text-secondary mt-1">
                Data restricted to your assigned members. Cannot view other trainers' members.
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-input border border-border rounded-xl text-sm font-medium hover:bg-border motion-safe:transition-colors text-foreground">
              <Download size={16} />
              Export CSV
            </button>
          </div>
          
          <div className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <TrendingUp size={32} />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Report Data Visualization</h4>
            <p className="text-sm text-secondary max-w-sm">
              This report will display a tabular and graphical view of {activeTab} data for your assigned members.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
