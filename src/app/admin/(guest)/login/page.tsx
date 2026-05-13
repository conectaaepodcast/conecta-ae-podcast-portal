import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getStaffSession } from "@/lib/auth/staff";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Entrar",
};

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const session = await getStaffSession();
  const sp = await searchParams;

  if (session.user && session.role) {
    const next = sp.next;
    if (next && next.startsWith("/") && !next.startsWith("//")) {
      redirect(next);
    }
    redirect("/admin");
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-[#e4e4e7] bg-[#ffffff] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <h1 className="text-center text-xl font-semibold text-[#18181b]">
        Área administrativa
      </h1>
      <p className="mt-1 text-center text-sm text-[#71717a]">
        Faça login para continuar
      </p>
      <LoginForm next={sp.next} />
      <p className="mt-6 text-center text-xs text-[#a1a1aa]">
        <Link href="/" className="underline hover:text-[#52525b]">
          Voltar ao site
        </Link>
      </p>
    </div>
  );
}
