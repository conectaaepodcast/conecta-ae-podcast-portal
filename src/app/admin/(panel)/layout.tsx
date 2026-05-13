import type { ReactNode } from "react";
import { requireStaffOrRedirect } from "@/lib/auth/staff";
import { AdminPanelChrome } from "@/components/admin/admin-panel-chrome";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const { role } = await requireStaffOrRedirect();

  return <AdminPanelChrome role={role}>{children}</AdminPanelChrome>;
}
