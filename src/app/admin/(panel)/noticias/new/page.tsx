import { requireStaffOrRedirect } from "@/lib/auth/staff";
import { NoticiaForm } from "../noticia-form";

export default async function NewNoticiaPage() {
  const { role } = await requireStaffOrRedirect();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-zinc-900">Nova notícia</h1>
      <p className="mt-1 text-sm text-zinc-600">Preencha os campos e guarde.</p>
      <div className="mt-8">
        <NoticiaForm isAdmin={role === "admin"} />
      </div>
    </div>
  );
}
