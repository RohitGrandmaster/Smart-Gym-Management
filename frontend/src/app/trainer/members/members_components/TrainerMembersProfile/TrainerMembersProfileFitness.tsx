'use client';

import { Activity, HeartPulse, Scale, Target } from 'lucide-react';

export default function TrainerMembersProfileFitness() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-input rounded-xl p-4 flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Target size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Fitness Goal</h4>
            <p className="text-sm text-secondary mt-1">Weight Loss & Muscle Toning</p>
          </div>
        </div>
        <div className="bg-input rounded-xl p-4 flex items-start gap-4">
          <div className="p-3 bg-info-bg rounded-lg text-info">
            <Activity size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Fitness Level</h4>
            <p className="text-sm text-secondary mt-1">Intermediate</p>
          </div>
        </div>
        <div className="bg-input rounded-xl p-4 flex items-start gap-4">
          <div className="p-3 bg-warning-bg rounded-lg text-warning">
            <Scale size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">BMI & Target</h4>
            <p className="text-sm text-secondary mt-1">Current BMI: 24.5</p>
            <p className="text-sm text-secondary">Target Weight: 65 kg</p>
          </div>
        </div>
        <div className="bg-input rounded-xl p-4 flex items-start gap-4">
          <div className="p-3 bg-danger-bg rounded-lg text-danger">
            <HeartPulse size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Medical Restrictions</h4>
            <p className="text-sm text-secondary mt-1">Mild lower back pain. Avoid heavy deadlifts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
