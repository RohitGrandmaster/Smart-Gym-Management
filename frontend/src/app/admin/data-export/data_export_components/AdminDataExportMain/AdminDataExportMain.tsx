// RESPONSIBILITY: Main entry point for the Data Export module.
'use client';

import AdminHeader from '@/app/admin/admin_components/AdminLayout/AdminHeader';
import AdminDataExportKPIs from '@/app/admin/data-export/data_export_components/AdminDataExportKPIs/AdminDataExportKPIs';
import AdminDataExportForm from '@/app/admin/data-export/data_export_components/AdminDataExportForm/AdminDataExportForm';
import AdminDataExportHistory from '@/app/admin/data-export/data_export_components/AdminDataExportHistory/AdminDataExportHistory';

export default function AdminDataExportMain() {
  return (
    <div className="min-h-full pb-10">
      <AdminHeader title="Data Export" subtitle="Export members, payments, and attendance data across all gyms in CSV, Excel, or PDF" />
      <div className="p-6 space-y-5">
        <AdminDataExportKPIs />
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
          <div className="xl:col-span-2">
            <AdminDataExportForm />
          </div>
          <div className="xl:col-span-3">
            <AdminDataExportHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
