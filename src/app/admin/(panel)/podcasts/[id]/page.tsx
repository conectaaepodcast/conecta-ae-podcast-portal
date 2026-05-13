import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaffOrRedirect } from "@/lib/auth/staff";
import { PodcastForm } from "../podcast-form";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ err?: string }>;
};

export default async function EditPodcastPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { err } = await searchParams;
  const { supabase, role } = await requireStaffOrRedirect();

  const { data: row, error } = await supabase
    .from("podcasts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !row) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="mb-6 text-sm">
        <Link href="/admin/podcasts" className="text-blue-700 hover:underline">
          ← Podcasts
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-zinc-900">Editar podcast</h1>
      {err ? (
        <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          {decodeURIComponent(err)}
        </p>
      ) : null}
      <div className="mt-8">
        <PodcastForm initial={row} isAdmin={role === "admin"} />
      </div>
    </div>
  );
}
