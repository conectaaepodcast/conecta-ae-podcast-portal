"use client";

import { useActionState, useRef } from "react";
import type { Tables } from "@/types/database";
import { slugify } from "@/lib/slugify";
import { SubmitButton } from "@/components/admin/submit-button";
import { deleteNoticia, saveNoticia, type NoticiaActionState } from "./actions";

type Row = Tables<"noticias">;

type Props = {
  initial?: Partial<Row>;
  isAdmin: boolean;
};

function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) {
    return "";
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return "";
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function NoticiaForm({ initial, isAdmin }: Props) {
  const [state, formAction] = useActionState(saveNoticia, {
    error: null,
  } satisfies NoticiaActionState);
  const titleRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);

  function fillSlugFromTitle() {
    const t = titleRef.current?.value ?? "";
    if (slugRef.current) {
      slugRef.current.value = slugify(t);
    }
  }

  return (
    <div className="space-y-8">
      <form action={formAction} className="max-w-3xl space-y-5">
        {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[#3f3f46]">
            Título
          </label>
          <input
            ref={titleRef}
            id="title"
            name="title"
            required
            defaultValue={initial?.title ?? ""}
            className="mt-1 w-full rounded-lg border border-[#d4d4d8] px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-0 flex-1">
            <label htmlFor="slug" className="block text-sm font-medium text-[#3f3f46]">
              Slug (URL)
            </label>
            <input
              ref={slugRef}
              id="slug"
              name="slug"
              required
              defaultValue={initial?.slug ?? ""}
              className="mt-1 w-full rounded-lg border border-[#d4d4d8] px-3 py-2 font-mono text-sm"
            />
          </div>
          <button
            type="button"
            onClick={fillSlugFromTitle}
            className="rounded-lg border border-[#d4d4d8] bg-[#ffffff] px-3 py-2 text-sm text-[#27272a] hover:bg-[#fafafa]"
          >
            Gerar slug
          </button>
        </div>
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-[#3f3f46]">
            Resumo
          </label>
          <textarea
            id="summary"
            name="summary"
            rows={3}
            defaultValue={initial?.summary ?? ""}
            className="mt-1 w-full rounded-lg border border-[#d4d4d8] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-[#3f3f46]">
            Conteúdo
          </label>
          <textarea
            id="content"
            name="content"
            rows={12}
            defaultValue={initial?.content ?? ""}
            className="mt-1 w-full rounded-lg border border-[#d4d4d8] px-3 py-2 text-sm font-mono"
          />
        </div>
        <div>
          <label
            htmlFor="published_at"
            className="block text-sm font-medium text-[#3f3f46]"
          >
            Data de publicação
          </label>
          <input
            id="published_at"
            name="published_at"
            type="datetime-local"
            defaultValue={toDatetimeLocal(initial?.published_at)}
            className="mt-1 w-full max-w-xs rounded-lg border border-[#d4d4d8] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="cover" className="block text-sm font-medium text-[#3f3f46]">
            Imagem de capa
          </label>
          <input
            id="cover"
            name="cover"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="mt-1 block w-full text-sm text-[#52525b]"
          />
          {initial?.cover_image_path ? (
            <p className="mt-1 text-xs text-[#71717a]">
              Atual: {initial.cover_image_path}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-[#27272a]">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={initial?.is_published ?? false}
              className="rounded border-[#a1a1aa]"
            />
            Publicado
          </label>
          <label className="flex items-center gap-2 text-sm text-[#27272a]">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={initial?.is_featured ?? false}
              className="rounded border-[#a1a1aa]"
            />
            Destaque (home)
          </label>
        </div>
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
        <form action={deleteNoticia} className="border-t border-[#e4e4e7] pt-6">
          <input type="hidden" name="id" value={initial.id} />
          <p className="text-sm text-[#52525b]">Zona perigosa</p>
          <button
            type="submit"
            className="mt-2 rounded-lg border border-[#fca5a5] bg-[#fef2f2] px-4 py-2 text-sm font-medium text-[#991b1b] hover:bg-[#fee2e2]"
          >
            Excluir notícia
          </button>
        </form>
      ) : null}
    </div>
  );
}
