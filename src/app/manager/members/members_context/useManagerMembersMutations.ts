import { useCallback } from 'react';
import type { Member } from '@/app/manager/members/members_types/ManagerMembersTypes';
import { useManagerMembersStore } from '@/app/manager/members/members_store/useManagerMembersStore';
import { useConfirm } from '@/app/manager/manager_components/ManagerFeedback/ManagerConfirmProvider';
import { DietPlan } from '@/app/manager/library/library_types/ManagerLibraryTypes';
import { Workout } from '@/app/manager/workout/workout_types/ManagerWorkoutTypes';
import { MemberFormValues } from '@/app/manager/members/members_utils/ManagerMembersSharedConstants';
import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';

export function useManagerMembersMutations(
  showToast: (msg: string, t: ToastType) => void,
  selectedMember: Member | null,
  setSelectedMember: React.Dispatch<React.SetStateAction<Member | null>>,
  editId: string | null,
  setShowAddModal: (s: boolean) => void,
  setShowRenewModal: (s: boolean) => void,
  setShowPaymentModal: (s: boolean) => void
) {
  const { confirm } = useConfirm();
  
  const storeSaveMember = useManagerMembersStore((s) => s.saveMember);
  const storeDeleteMember = useManagerMembersStore((s) => s.deleteMember);
  const storeAssignDiet = useManagerMembersStore((s) => s.assignDiet);
  const storeAssignWorkout = useManagerMembersStore((s) => s.assignWorkout);
  const storeRenewMember = useManagerMembersStore((s) => s.renewMember);
  const storeRecordPayment = useManagerMembersStore((s) => s.recordPayment);
  const storeFreezeMember = useManagerMembersStore((s) => s.freezeMember);
  const storeToggleSuspendMember = useManagerMembersStore((s) => s.toggleSuspendMember);
  const storeAssignTrainer = useManagerMembersStore((s) => s.assignTrainer);

  const saveMember = useCallback(async (data: MemberFormValues) => {
    try {
      const res = await storeSaveMember(data, editId);
      showToast(res.message, 'success');
      setShowAddModal(false);
      if (editId && selectedMember?.id === editId) {
        setSelectedMember(prev => prev ? { ...prev, ...data } as Member : null);
      }
    } catch (err: unknown) { 
      showToast(err instanceof Error ? err.message : 'Save failed', 'error'); 
    }
  }, [editId, selectedMember, setSelectedMember, showToast, storeSaveMember, setShowAddModal]);

  const deleteMember = useCallback(async (id: string) => {
    const isConfirmed = await confirm({ title: 'Delete Member', message: 'Are you sure you want to delete this member? This action cannot be undone.', confirmText: 'Delete', type: 'danger' });
    if (!isConfirmed) return;
    try {
      const res = await storeDeleteMember(id);
      showToast(res.message, 'success');
      if (selectedMember?.id === id) setSelectedMember(null);
    } catch (err: unknown) { 
      showToast(err instanceof Error ? err.message : 'Delete failed', 'error'); 
    }
  }, [showToast, selectedMember, confirm, storeDeleteMember, setSelectedMember]);

  const assignDiet = useCallback(async (memberId: string, diet: DietPlan | null) => {
    try {
      await storeAssignDiet(memberId, diet);
      showToast('Diet plan assigned successfully', 'success');
      if (selectedMember?.id === memberId) {
        setSelectedMember(prev => prev ? { ...prev, assignedDietId: diet?.id || '', assignedDiet: diet || undefined } as Member : null);
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to assign diet', 'error');
    }
  }, [storeAssignDiet, showToast, selectedMember, setSelectedMember]);

  const assignWorkout = useCallback(async (memberId: string, workout: Workout | null) => {
    try {
      await storeAssignWorkout(memberId, workout);
      showToast('Workout plan assigned successfully', 'success');
      if (selectedMember?.id === memberId) {
        setSelectedMember(prev => prev ? { ...prev, assignedWorkoutId: workout?.id || '', assignedWorkout: workout || undefined } as Member : null);
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to assign workout', 'error');
    }
  }, [storeAssignWorkout, showToast, selectedMember, setSelectedMember]);

  const renewMember = useCallback(async (data: { planId: string; newExpiryDate: string; amountPaid: number; paymentMethod: string; billingCycle: string; customDays?: number }) => {
    if (!selectedMember) return;
    try {
      const res = await storeRenewMember(selectedMember.id, data);
      showToast(res.message, 'success');
      setShowRenewModal(false);
      setSelectedMember(prev => prev ? {
        ...prev,
        ...(res as any).data
      } as Member : null);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Renewal failed', 'error');
    }
  }, [selectedMember, setSelectedMember, showToast, storeRenewMember, setShowRenewModal]);

  const recordPayment = useCallback(async (data: { amount: number; method: string }) => {
    if (!selectedMember) return;
    try {
      const res = await storeRecordPayment(selectedMember.id, data);
      showToast(res.message, 'success');
      setShowPaymentModal(false);
      setSelectedMember(prev => prev ? {
        ...prev,
        ...(res as any).data
      } as Member : null);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Payment recording failed', 'error');
    }
  }, [selectedMember, setSelectedMember, showToast, storeRecordPayment, setShowPaymentModal]);

  const freezeMember = useCallback(async (isFrozen: boolean) => {
    if (!selectedMember) return;
    try {
      await storeFreezeMember(selectedMember.id, isFrozen);
      setSelectedMember(prev => prev ? { ...prev, status: isFrozen ? 'FROZEN' : 'ACTIVE' } : null);
      showToast(isFrozen ? 'Membership frozen successfully' : 'Membership unfrozen successfully', 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to update membership status', 'error');
    }
  }, [selectedMember, setSelectedMember, showToast, storeFreezeMember]);

  const toggleSuspend = useCallback(async (isSuspended: boolean) => {
    if (!selectedMember) return;
    try {
      await storeToggleSuspendMember(selectedMember.id, isSuspended);
      setSelectedMember(prev => prev ? { ...prev, status: isSuspended ? 'SUSPENDED' : 'ACTIVE' } : null);
      showToast(isSuspended ? 'Member suspended successfully' : 'Member unsuspended successfully', 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to update membership status', 'error');
    }
  }, [selectedMember, setSelectedMember, showToast, storeToggleSuspendMember]);

  const assignTrainer = useCallback(async (memberId: string, trainerId: string, trainerName: string, isPT: boolean) => {
    try {
      await storeAssignTrainer(memberId, trainerId, trainerName, isPT);
      showToast('Trainer assigned successfully', 'success');
      if (selectedMember?.id === memberId) {
        setSelectedMember(prev => prev ? { ...prev, assignedTrainerId: trainerId, assignedTrainerName: trainerName, isPT } as Member : null);
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to assign trainer', 'error');
    }
  }, [storeAssignTrainer, showToast, selectedMember, setSelectedMember]);

  return {
    saveMember,
    deleteMember,
    assignDiet,
    assignWorkout,
    renewMember,
    recordPayment,
    freezeMember,
    toggleSuspend,
    assignTrainer
  };
}
