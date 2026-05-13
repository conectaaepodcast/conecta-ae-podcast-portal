import { requireStaffOrRedirect } from "@/lib/auth/staff";
import { PodcastForm } from "../podcast-form";

export default async function NewPodcastPage() {
  const { role } = await requireStaffOrRedirect();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-[#18181b]">Novo podcast</h1>
      <p className="mt-1 text-sm text-[#52525b]">Preencha os campos e guarde.</p>
      <div className="mt-8">
        <PodcastForm isAdmin={role === "admin"} />
      </div>
    </div>
  );
}
