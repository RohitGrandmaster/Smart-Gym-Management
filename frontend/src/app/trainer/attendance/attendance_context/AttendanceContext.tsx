// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Provides UI orchestration state to the attendance module hierarchy. Async data is managed in useAttendanceLogic.
'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { AttendanceContextType } from '@/app/trainer/attendance/attendance_types/attendance_types';
import { useAttendanceLogic } from '@/app/trainer/attendance/attendance_context/useAttendanceLogic';

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
 const logic = useAttendanceLogic();

 const value = useMemo(() => logic, [
   logic.records,
   logic.totalRecords,
   logic.todayStats,
   logic.members,
   logic.fetchState,
   logic.saving,
   logic.toast,
   logic.tab,
   logic.search,
   logic.currentPage,
   logic.showModal,
   logic.form
 ]);

 return (
 <AttendanceContext.Provider value={value}>
 {children}
 </AttendanceContext.Provider>
 );
}

export function useAttendanceContext() {
 const context = useContext(AttendanceContext);
 if (context === undefined) {
 throw new Error('useAttendanceContext must be used within an AttendanceProvider');
 }
 return context;
}

