"use client";

import { useActionState } from "react";
import type { Tables } from "@/types/database";
import { SubmitButton } from "@/components/admin/submit-button";
import {
  deleteEquipeMember,
  saveEquipeMember,
  type EquipeActionState,
} from "./actions";

type Row = Tables<"equipe">;

type Props = {
  initial?: Partial<Row>;
  isAdmin: boolean;
};

export function EquipeForm({ initial, isAdmin }: Props) {
  const [state, formAction] = useActionState(saveEquipeMember, {
    error: null,
  } satisfies EquipeActionState);

  return (
    <div className="space-y-8">
      <form action={formAction} className="max-w-2xl space-y-5">
        {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-[#3f3f46]">
            Nome
          </label>
          <input
            id="nome"
            name="nome"
            required
            defaultValue={initial?.nome ?? ""}
            className="mt-1 w-full rounded-lg border border-[#d4d4d8] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="cargo" className="block text-sm font-medium text-[#3f3f46]">
            Função
          </label>
          <select
            id="cargo"
            name="cargo"
            required
            defaultValue={initial?.cargo ?? "jornalista"}
            className="mt-1 w-full max-w-xs rounded-lg border border-[#d4d4d8] px-3 py-2 text-sm"
          >
            <option value="diretor">Diretor</option>
            <option value="jornalista">Jornalista</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="descricao"
            className="block text-sm font-medium text-[#3f3f46]"
          >
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            rows={4}
            defaultValue={initial?.descricao ?? ""}
            className="mt-1 w-full rounded-lg border border-[#d4d4d8] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="instagram_url"
            className="block text-sm font-medium text-[#3f3f46]"
          >
            Instagram (URL completa)
          </label>
          <input
            id="instagram_url"
            name="instagram_url"
            type="url"
            placeholder="https://instagram.com/…"
            defaultValue={initial?.instagram_url ?? ""}
            className="mt-1 w-full rounded-lg border border-[#d4d4d8] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="ordem" className="block text-sm font-medium text-[#3f3f46]">
            Ordem de exibição
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
        <div>
          <label htmlFor="foto" className="block text-sm font-medium text-[#3f3f46]">
            Fotografia
          </label>
          <input
            id="foto"
            name="foto"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="mt-1 block w-full text-sm text-[#52525b]"
          />
          {initial?.foto_path ? (
            <p className="mt-1 text-xs text-[#71717a]">Atual: {initial.foto_path}</p>
          ) : null}
        </div>
        <label className="flex items-center gap-2 text-sm text-[#27272a]">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={initial?.is_active ?? true}
            className="rounded border-[#a1a1aa]"
          />
          Visível no site
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
        <form action={deleteEquipeMember} className="border-t border-[#e4e4e7] pt-6">
          <input type="hidden" name="id" value={initial.id} />
          <p className="text-sm text-[#52525b]">Zona perigosa</p>
          <button
            type="submit"
            className="mt-2 rounded-lg border border-[#fca5a5] bg-[#fef2f2] px-4 py-2 text-sm font-medium text-[#991b1b] hover:bg-[#fee2e2]"
          >
            Excluir membro
          </button>
        </form>
      ) : null}
    </div>
  );
}
