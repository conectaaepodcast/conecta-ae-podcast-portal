import Link from "next/link";
import { redirect } from "next/navigation";
import { getStaffSession } from "@/lib/auth/staff";
import { SignOutButton } from "@/components/admin/sign-out-button";

export default async function SemAcessoPage() {
  const session = await getStaffSession();
  if (!session.user) {
    redirect("/admin/login");
  }
  if (session.role) {
    redirect("/admin");
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-amber-200 bg-amber-50 p-8 text-center shadow-sm">
      <h1 className="text-lg font-semibold text-amber-950">Sem permissões</h1>
      <p className="mt-2 text-sm text-amber-900/80">
        Sua conta não está na lista de administradores. Peça a um administrador para liberar
        seu acesso.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <SignOutButton />
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          Voltar ao site
        </Link>
      </div>
    </div>
  );
}
