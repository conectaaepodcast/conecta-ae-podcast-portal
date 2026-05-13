import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaffOrRedirect } from "@/lib/auth/staff";
import { RedeForm } from "../rede-form";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ err?: string }>;
};

export default async function EditRedePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { err } = await searchParams;
  const { supabase, role } = await requireStaffOrRedirect();

  const { data: row, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !row) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="mb-6 text-sm">
        <Link href="/admin/redes" className="text-[#1d4ed8] hover:underline">
          ← Redes sociais
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-[#18181b]">Editar link</h1>
      {err ? (
        <p className="mt-2 rounded-md bg-[#fef2f2] px-3 py-2 text-sm text-[#991b1b]">
          {decodeURIComponent(err)}
        </p>
      ) : null}
      <div className="mt-8">
        <RedeForm initial={row} isAdmin={role === "admin"} />
      </div>
    </div>
  );
}
