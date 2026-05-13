import { requireStaffOrRedirect } from "@/lib/auth/staff";
import { RedeForm } from "../rede-form";

export default async function NewRedePage() {
  const { role } = await requireStaffOrRedirect();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-zinc-900">Novo link</h1>
      <div className="mt-8">
        <RedeForm isAdmin={role === "admin"} />
      </div>
    </div>
  );
}
