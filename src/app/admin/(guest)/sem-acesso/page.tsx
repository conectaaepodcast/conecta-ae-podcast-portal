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
    <div className="w-full max-w-md rounded-xl border border-[#fde68a] bg-[#fffbeb] p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <h1 className="text-lg font-semibold text-[#451a03]">Sem permissões</h1>
      <p className="mt-2 text-sm text-[rgba(120,53,15,0.8)]">
        Sua conta não está na lista de administradores. Peça a um administrador para liberar
        seu acesso.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <SignOutButton />
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-[#d4d4d8] bg-[#ffffff] px-4 py-2 text-sm font-medium text-[#27272a] hover:bg-[#fafafa]"
        >
          Voltar ao site
        </Link>
      </div>
    </div>
  );
}
