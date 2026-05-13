import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaffOrRedirect } from "@/lib/auth/staff";
import { EquipeForm } from "../equipe-form";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ err?: string }>;
};

export default async function EditEquipePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { err } = await searchParams;
  const { supabase, role } = await requireStaffOrRedirect();

  const { data: row, error } = await supabase
    .from("equipe")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !row) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="mb-6 text-sm">
        <Link href="/admin/equipe" className="text-blue-700 hover:underline">
          ← Equipe
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-zinc-900">Editar membro</h1>
      {err ? (
        <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          {decodeURIComponent(err)}
        </p>
      ) : null}
      <div className="mt-8">
        <EquipeForm initial={row} isAdmin={role === "admin"} />
      </div>
    </div>
  );
}
