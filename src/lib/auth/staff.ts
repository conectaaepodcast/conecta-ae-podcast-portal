import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { StaffRole } from "@/types/database";

export type StaffSession =
  | { user: null; role: null }
  | { user: { id: string; email?: string }; role: null }
  | { user: { id: string; email?: string }; role: StaffRole };

export async function getStaffSession(): Promise<StaffSession> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, role: null };
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin?.role) {
    return {
      user: { id: user.id, email: user.email },
      role: null,
    };
  }

  return {
    user: { id: user.id, email: user.email },
    role: admin.role,
  };
}

export async function requireStaff() {
  const session = await getStaffSession();
  if (!session.user) {
    return null;
  }
  if (!session.role) {
    return null;
  }
  return session;
}

export async function requireStaffOrRedirect(): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>;
  role: StaffRole;
  userId: string;
}> {
  const session = await getStaffSession();
  if (!session.user) {
    redirect("/admin/login");
  }
  if (!session.role) {
    redirect("/admin/sem-acesso");
  }
  const supabase = await createClient();
  return { supabase, role: session.role, userId: session.user.id };
}
