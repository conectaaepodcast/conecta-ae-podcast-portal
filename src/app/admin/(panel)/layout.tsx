import type { ReactNode } from "react";
import { requireStaffOrRedirect } from "@/lib/auth/staff";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const { role } = await requireStaffOrRedirect();

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar role={role} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
