// RESPONSIBILITY: Core UI component/route for the admin module orchestrating views and displaying sub-components.
import type { Metadata } from "next";
import AdminHeader from "@/app/admin/admin_components/AdminLayout/AdminHeader";

import AdminBranchesToolbar from "@/app/admin/branches/branches_components/AdminBranchesToolbar/AdminBranchesToolbar";
import AdminBranchCard from "@/app/admin/branches/branches_components/AdminBranchCard/AdminBranchCard";
import AdminBranchDetailDrawer from "@/app/admin/branches/branches_components/AdminBranchDetailDrawer/AdminBranchDetailDrawer";

export const metadata: Metadata = { title: "Branches | Admin � GymSmart", description: "Overview of all gym locations." };

export default function AdminBranchesPage() {
  return (
    <div className="min-h-full pb-10">
      <AdminHeader title="Gym Branches" subtitle="Overview of all gym locations and their performance metrics" />
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <AdminBranchesToolbar />
        <AdminBranchCard />
      </div>
      <AdminBranchDetailDrawer />
    </div>
  );
}


