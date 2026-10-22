// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders the modal for marking new attendance records for members or staff.
'use client';

import { useEffect } from 'react';
import { useAttendanceContext } from '@/app/trainer/attendance/attendance_context/AttendanceContext';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AttendanceSchema, type AttendanceFormValues, EMPTY_ATTENDANCE_FORM } from '@/app/trainer/attendance/attendance_utils/AttendanceSharedConstants';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';

export default function TrainerAttendanceModal() {
  const { 
    showModal, setShowModal,
    members, saving, markAttendance
  } = useAttendanceContext();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors }
  } = useForm<AttendanceFormValues>({
    resolver: zodResolver(AttendanceSchema),
    defaultValues: EMPTY_ATTENDANCE_FORM
  });

  const watchType = watch('type');

  useEffect(() => {
    if (showModal) {
      reset(EMPTY_ATTENDANCE_FORM);
    }
  }, [showModal, reset]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-border">
        <div className="flex justify-between items-center p-5 border-b border-border">
          <h3 className="font-bold text-lg text-foreground">Record Attendance</h3>
          <button 
            type="button"
            onClick={() => setShowModal(false)} 
            className="text-secondary hover:text-foreground hover:bg-primary/10 p-1 rounded-md motion-safe:transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(markAttendance)} className="p-5 space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input 
                type="radio" 
                value="MEMBER" 
                {...register('type')}
                className="text-primary focus-visible:ring-primary" 
              />
              Member
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Select Member
            </label>
            <Controller
              name="memberId"
              control={control}
              render={({ field }) => (
                <SearchableDropdown
                  options={members.map(m => ({ label: `${m.name} (${m.phone})`, value: String(m.id) }))}
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="Search Member..."
                  containerStyle={{ zIndex: 60 }}
                />
              )}
            />
            {errors.memberId && watchType === 'MEMBER' && <p className="text-danger text-xs mt-1">{errors.memberId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Date</label>
              <input 
                type="date" 
                {...register('date')}
                className={`w-full px-3 py-2 border rounded-lg focus-visible:outline-none focus-visible:ring-2 ${
                  errors.date ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'
                } bg-input text-foreground`} 
              />
              {errors.date && <p className="text-danger text-xs mt-1">{errors.date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Check In Time</label>
              <input 
                type="time" 
                {...register('checkIn')}
                className={`w-full px-3 py-2 border rounded-lg focus-visible:outline-none focus-visible:ring-2 ${
                  errors.checkIn ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'
                } bg-input text-foreground`} 
              />
              {errors.checkIn && <p className="text-danger text-xs mt-1">{errors.checkIn.message}</p>}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setShowModal(false)} 
              className="px-4 py-2 border border-border rounded-lg font-medium text-secondary hover:text-foreground hover:bg-primary/10 motion-safe:transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="px-4 py-2 rounded-lg font-medium text-white bg-primary flex items-center gap-2 hover:opacity-90 motion-safe:transition-opacity disabled:opacity-70" 
            >
              {saving ? <Loader2 className="w-4 h-4 motion-safe:animate-spin" /> : <><CheckCircle size={15} /> Check In</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

