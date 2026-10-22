// RESPONSIBILITY: Provides UI orchestration state to the attendance module hierarchy. Async data is managed in useManagerAttendanceLogic.
'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { AttendanceContextType } from '@/app/manager/attendance/attendance_types/ManagerAttendanceTypes';
import { useManagerAttendanceLogic } from '@/app/manager/attendance/attendance_context/useManagerAttendanceLogic';

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
 const logic = useManagerAttendanceLogic();

 const value = useMemo(() => logic, [
   logic.records,
   logic.totalRecords,
   logic.todayStats,
   logic.members,
   logic.staff,
   logic.fetchState,
   logic.saving,
   logic.toast,
   logic.tab,
   logic.search,
   logic.currentPage,
   logic.showModal,
   logic.calendarUser,
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
