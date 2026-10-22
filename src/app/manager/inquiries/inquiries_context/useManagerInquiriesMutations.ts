import { useCallback } from 'react';
import { inquiriesApi } from '@/app/manager/inquiries/inquiries_api/ManagerInquiriesApi';
import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import type { Inquiry, InquiryStats } from '@/app/manager/inquiries/inquiries_types/ManagerInquiriesTypes';
import { useConfirm } from '@/app/manager/manager_components/ManagerFeedback/ManagerConfirmProvider';
import type { InquiryFormValues } from '@/app/manager/inquiries/inquiries_utils/ManagerInquiriesSharedConstants';

export function useManagerInquiriesMutations(
  inquiries: Inquiry[],
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>,
  setStats: React.Dispatch<React.SetStateAction<InquiryStats | null>>,
  editId: string | null,
  setShowModal: (s: boolean) => void,
  setSaving: (s: boolean) => void,
  showToast: (msg: string, t: ToastType) => void,
  statusFilter: string,
  convertLead: Inquiry | null,
  setConvertLead: (i: Inquiry | null) => void
) {
  const { confirm } = useConfirm();

  const saveInquiry = useCallback(async (data: Partial<InquiryFormValues>) => {
    setSaving(true);
    try {
      if (editId) {
        const res = await inquiriesApi.update(editId, data);
        const updatedInq = res.data || data;
        setInquiries(prev => prev.map(i => String(i.id) === String(editId) ? { ...i, ...updatedInq } as unknown as Inquiry : i));
        showToast(res.message || 'Inquiry updated successfully', 'success');
      } else {
        const res = await inquiriesApi.create(data);
        const newInq = res.data ? res.data : { ...data, id: `inq-${Date.now()}`, createdAt: new Date().toISOString() } as unknown as Inquiry;
        setInquiries(prev => [newInq, ...prev]);
        setStats(prev => prev ? { ...prev, total: prev.total + 1, new: prev.new + 1 } : null);
        showToast(res.message || 'Inquiry added successfully', 'success');
      }
      setShowModal(false);
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [editId, showToast, setInquiries, setStats, setShowModal, setSaving]);

  const deleteInquiry = useCallback(async (id: string) => {
    const isConfirmed = await confirm({ title: 'Delete Inquiry', message: 'Delete this inquiry?', confirmText: 'Delete', type: 'danger' });
    if (!isConfirmed) return;
    try {
      const res = await inquiriesApi.remove(id);
      setInquiries(prev => prev.filter(i => String(i.id) !== String(id)));
      setStats(prev => prev ? { ...prev, total: Math.max(0, prev.total - 1) } : null);
      showToast(res.message || 'Inquiry deleted', 'success');
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  }, [showToast, confirm, setInquiries, setStats]);

  const updateStatus = useCallback(async (id: string, status: string) => {
    if (status === 'CONVERTED' && !convertLead) {
      const inq = inquiries.find(i => String(i.id) === String(id));
      if (inq) {
        setConvertLead(inq);
        return;
      }
    }

    try {
      await inquiriesApi.update(id, { status } as any);
      if (status === 'CONVERTED') {
        setInquiries(prev => prev.filter(i => String(i.id) !== String(id)));
      } else {
        setInquiries(prev => prev.map(i => String(i.id) === String(id) ? { ...i, status } as unknown as Inquiry : i));
      }
      showToast('Status updated', 'success');
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  }, [showToast, inquiries, statusFilter, convertLead, setConvertLead, setInquiries]);

  return { saveInquiry, deleteInquiry, updateStatus };
}
