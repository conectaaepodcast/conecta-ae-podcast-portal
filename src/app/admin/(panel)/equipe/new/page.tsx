import { requireStaffOrRedirect } from "@/lib/auth/staff";
import { EquipeForm } from "../equipe-form";

export default async function NewEquipePage() {
  const { role } = await requireStaffOrRedirect();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-zinc-900">Novo membro</h1>
      <div className="mt-8">
        <EquipeForm isAdmin={role === "admin"} />
      </div>
    </div>
  );
}
