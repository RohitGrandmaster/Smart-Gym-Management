// RESPONSIBILITY: Provides the search, filter tabs, and action buttons for the Attendance module.
'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Plus, Search, Download } from 'lucide-react';
import { useAttendanceContext } from '@/app/manager/attendance/attendance_context/ManagerAttendanceContext';
import { ATTENDANCE_TABS } from '@/app/manager/attendance/attendance_utils/ManagerAttendanceSharedConstants';

export default function AttendanceToolbar() {
  const { tab, setTab, loadAll, setShowModal, search, setSearch, setCurrentPage, exportAttendance } = useAttendanceContext();
  const [prevSearch, setPrevSearch] = useState(search);
  const [localSearch, setLocalSearch] = useState(search);

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
 <div className="border-b border-border flex flex-col lg:flex-row justify-between items-start lg:items-center">
 <div className="flex w-full lg:w-auto overflow-x-auto no-scrollbar">
 {ATTENDANCE_TABS.map(t => (
 <button 
 key={t} 
 onClick={() => setTab(t)}
 className={`whitespace-nowrap px-5 py-3.5 text-sm font-medium transition-colors border-b-2 ${
 tab === t 
 ? 'text-primary bg-primary-subtle border-primary' 
 : 'border-transparent text-secondary hover:text-foreground'
 }`}
 >
 {t}
 </button>
 ))}
 </div>
  <div className="p-4 flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto border-t lg:border-t-0 border-border">
    <div className="relative w-full sm:w-auto">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
      <input 
        value={localSearch} 
        onChange={e => setLocalSearch(e.target.value)} 
        placeholder={`Search ${tab.toLowerCase()}...`} 
        className="pl-9 pr-3 py-2 border border-border bg-input text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full sm: w-full sm:w-64 "
      />
    </div>
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
 <button 
 onClick={loadAll} 
 className="flex justify-center items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-primary-subtle text-secondary transition-colors w-full sm:w-auto"
 >
 <RefreshCw size={14} />
 </button>
 <button 
 onClick={() => exportAttendance && exportAttendance()} 
 className="flex justify-center items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-info/10 text-info transition-colors w-full sm:w-auto"
 >
 <Download size={14} /> Export
 </button>
 <button 
 onClick={() => setShowModal(true)} 
 className="flex justify-center items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg transition-opacity hover:opacity-90 w-full sm:w-auto" 
 >
 <Plus size={14} /> Mark Attendance
 </button>
 </div>
 </div>
 </div>
 );
}

