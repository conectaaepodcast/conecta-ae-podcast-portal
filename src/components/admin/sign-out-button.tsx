"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      disabled={loading}
      className="inline-flex items-center justify-center rounded-lg bg-[#18181b] px-4 py-2 text-sm font-medium text-[#ffffff] hover:bg-[#27272a] disabled:opacity-50"
    >
      {loading ? "Saindo…" : "Sair"}
    </button>
  );
}
