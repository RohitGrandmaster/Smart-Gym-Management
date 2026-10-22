// RESPONSIBILITY: Provides local UI state (filtering, pagination, modal visibility) for the Expenses module.
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useManagerExpensesStore } from '@/app/manager/expenses/expenses_store/useManagerExpensesStore';
import type { Expense } from '@/app/manager/expenses/expenses_types/ManagerExpensesTypes';
import toast from 'react-hot-toast';
import { MANAGER_ITEMS_PER_PAGE } from '@/app/manager/manager_utils/ManagerSharedConstants';

interface ExpensesContextValue {
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  currentPage: number;
  setCurrentPage: (v: number) => void;
  
  showModal: boolean;
  setShowModal: (v: boolean) => void;
  editId: string | null;
  editData: Partial<Expense> | null;
  
  openAdd: () => void;
  openEdit: (e: Expense) => void;
  saveExpense: (data: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  
  saving: boolean;
}

const ManagerExpensesContext = createContext<ExpensesContextValue | undefined>(undefined);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Expense> | null>(null);

  const { loadAll, saveExpense: storeSave, deleteExpense: storeDelete, saving } = useManagerExpensesStore();

  const fetchWithParams = useCallback(() => {
    loadAll({
      search,
      status: statusFilter !== 'All' ? statusFilter : '',
      page: currentPage.toString(),
      limit: MANAGER_ITEMS_PER_PAGE.toString()
    });
  }, [search, statusFilter, currentPage, loadAll]);

  useEffect(() => {
    fetchWithParams();
  }, [fetchWithParams]);

  const openAdd = () => {
    setEditId(null);
    setEditData({ status: 'PAID', date: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };

  const openEdit = (e: Expense) => {
    setEditId(e.id);
    setEditData({ ...e, date: e.date.split('T')[0] }); // Format for date input
    setShowModal(true);
  };

  const saveExpense = async (data: Partial<Expense>) => {
    try {
      await storeSave({ ...data, id: editId || undefined });
      toast.success(`Expense ${editId ? 'updated' : 'added'} successfully.`);
      setShowModal(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to save expense');
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await storeDelete(id);
      toast.success('Expense deleted successfully.');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete expense');
    }
  };

  const value = {
    search, setSearch,
    statusFilter, setStatusFilter,
    currentPage, setCurrentPage,
    showModal, setShowModal,
    editId, editData,
    openAdd, openEdit,
    saveExpense, deleteExpense,
    saving
  };

  return <ManagerExpensesContext.Provider value={value}>{children}</ManagerExpensesContext.Provider>;
}

export const useExpensesContext = () => {
  const context = useContext(ManagerExpensesContext);
  if (!context) throw new Error('useExpensesContext must be used within ExpensesProvider');
  return context;
};
