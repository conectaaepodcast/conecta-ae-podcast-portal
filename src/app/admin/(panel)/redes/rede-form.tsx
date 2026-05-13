"use client";

import { useActionState } from "react";
import type { Tables } from "@/types/database";
import { SubmitButton } from "@/components/admin/submit-button";
import { deleteSocialLink, saveSocialLink, type RedeActionState } from "./actions";

type Row = Tables<"social_links">;

type Props = {
  initial?: Partial<Row>;
  isAdmin: boolean;
};

const labels: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
  other: "Outro",
};

export function RedeForm({ initial, isAdmin }: Props) {
  const [state, formAction] = useActionState(saveSocialLink, {
    error: null,
  } satisfies RedeActionState);

  return (
    <div className="space-y-8">
      <form action={formAction} className="max-w-xl space-y-5">
        {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-[#3f3f46]">
            Plataforma
          </label>
          <select
            id="platform"
            name="platform"
            required
            defaultValue={initial?.platform ?? "instagram"}
            className="mt-1 w-full rounded-lg border border-[#d4d4d8] px-3 py-2 text-sm"
          >
            {Object.entries(labels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="label" className="block text-sm font-medium text-[#3f3f46]">
            Rótulo (opcional)
          </label>
          <input
            id="label"
            name="label"
            placeholder="ex.: Canal principal"
            defaultValue={initial?.label ?? ""}
            className="mt-1 w-full rounded-lg border border-[#d4d4d8] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-[#3f3f46]">
            URL (https)
          </label>
          <input
            id="url"
            name="url"
            type="url"
            required
            placeholder="https://…"
            defaultValue={initial?.url ?? ""}
            className="mt-1 w-full rounded-lg border border-[#d4d4d8] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="ordem" className="block text-sm font-medium text-[#3f3f46]">
            Ordem
          </label>
          <input
            id="ordem"
            name="ordem"
            type="number"
            min={0}
            defaultValue={initial?.ordem ?? 0}
            className="mt-1 w-32 rounded-lg border border-[#d4d4d8] px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-[#27272a]">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={initial?.is_active ?? true}
            className="rounded border-[#a1a1aa]"
          />
          Ativo no site
        </label>
        {state.error ? (
          <p
            className="rounded-md bg-[#fef2f2] px-3 py-2 text-sm text-[#991b1b]"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}
        <SubmitButton className="rounded-lg bg-[#18181b] px-5 py-2.5 text-sm font-medium text-[#ffffff] hover:bg-[#27272a]">
          Salvar
        </SubmitButton>
      </form>

      {isAdmin && initial?.id ? (
        <form action={deleteSocialLink} className="border-t border-[#e4e4e7] pt-6">
          <input type="hidden" name="id" value={initial.id} />
          <p className="text-sm text-[#52525b]">Zona perigosa</p>
          <button
            type="submit"
            className="mt-2 rounded-lg border border-[#fca5a5] bg-[#fef2f2] px-4 py-2 text-sm font-medium text-[#991b1b] hover:bg-[#fee2e2]"
          >
            Excluir link
          </button>
        </form>
      ) : null}
    </div>
  );
}
