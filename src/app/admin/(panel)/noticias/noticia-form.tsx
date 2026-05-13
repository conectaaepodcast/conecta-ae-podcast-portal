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
          <label htmlFor="title" className="block text-sm font-medium text-zinc-700">
            Título
          </label>
          <input
            ref={titleRef}
            id="title"
            name="title"
            required
            defaultValue={initial?.title ?? ""}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-0 flex-1">
            <label htmlFor="slug" className="block text-sm font-medium text-zinc-700">
              Slug (URL)
            </label>
            <input
              ref={slugRef}
              id="slug"
              name="slug"
              required
              defaultValue={initial?.slug ?? ""}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm"
            />
          </div>
          <button
            type="button"
            onClick={fillSlugFromTitle}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50"
          >
            Gerar slug
          </button>
        </div>
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-zinc-700">
            Resumo
          </label>
          <textarea
            id="summary"
            name="summary"
            rows={3}
            defaultValue={initial?.summary ?? ""}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-zinc-700">
            Conteúdo
          </label>
          <textarea
            id="content"
            name="content"
            rows={12}
            defaultValue={initial?.content ?? ""}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono"
          />
        </div>
        <div>
          <label
            htmlFor="published_at"
            className="block text-sm font-medium text-zinc-700"
          >
            Data de publicação
          </label>
          <input
            id="published_at"
            name="published_at"
            type="datetime-local"
            defaultValue={toDatetimeLocal(initial?.published_at)}
            className="mt-1 w-full max-w-xs rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="cover" className="block text-sm font-medium text-zinc-700">
            Imagem de capa
          </label>
          <input
            id="cover"
            name="cover"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="mt-1 block w-full text-sm text-zinc-600"
          />
          {initial?.cover_image_path ? (
            <p className="mt-1 text-xs text-zinc-500">
              Atual: {initial.cover_image_path}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-zinc-800">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={initial?.is_published ?? false}
              className="rounded border-zinc-400"
            />
            Publicado
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-800">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={initial?.is_featured ?? false}
              className="rounded border-zinc-400"
            />
            Destaque (home)
          </label>
        </div>
        {state.error ? (
          <p
            className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}
        <SubmitButton className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800">
          Salvar
        </SubmitButton>
      </form>

      {isAdmin && initial?.id ? (
        <form action={deleteNoticia} className="border-t border-zinc-200 pt-6">
          <input type="hidden" name="id" value={initial.id} />
          <p className="text-sm text-zinc-600">Zona perigosa</p>
          <button
            type="submit"
            className="mt-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
          >
            Excluir notícia
          </button>
        </form>
      ) : null}
    </div>
  );
}
