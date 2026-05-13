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
    <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
      <h1 className="text-center text-xl font-semibold text-zinc-900">
        Área administrativa
      </h1>
      <p className="mt-1 text-center text-sm text-zinc-500">
        Faça login para continuar
      </p>
      <LoginForm next={sp.next} />
      <p className="mt-6 text-center text-xs text-zinc-400">
        <Link href="/" className="underline hover:text-zinc-600">
          Voltar ao site
        </Link>
      </p>
    </div>
  );
}
