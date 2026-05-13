-- Portal: schema inicial (podcasts, notícias, equipe, redes, admins) + RLS + Storage
-- Bootstrap do primeiro admin: SQL Editor no Dashboard (role service) — ver final do arquivo.

-- Extensão para busca por similaridade (título / resumo) — Fase 4 (pesquisa)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ---------------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------------
CREATE TYPE public.staff_role AS ENUM ('admin', 'editor');

CREATE TYPE public.equipe_cargo AS ENUM ('diretor', 'jornalista');

CREATE TYPE public.social_platform AS ENUM (
  'instagram',
  'facebook',
  'youtube',
  'tiktok',
  'other'
);

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------
CREATE TABLE public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role public.staff_role NOT NULL DEFAULT 'editor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.podcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  cover_image_path TEXT,
  youtube_video_id TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT podcasts_slug_format CHECK (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  CONSTRAINT podcasts_slug_len CHECK (
    char_length(slug) >= 2
    AND char_length(slug) <= 120
  )
);

CREATE UNIQUE INDEX podcasts_slug_key ON public.podcasts (slug);

CREATE TABLE public.noticias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  cover_image_path TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT noticias_slug_format CHECK (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  CONSTRAINT noticias_slug_len CHECK (
    char_length(slug) >= 2
    AND char_length(slug) <= 120
  )
);

CREATE UNIQUE INDEX noticias_slug_key ON public.noticias (slug);

CREATE TABLE public.equipe (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  cargo public.equipe_cargo NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  instagram_url TEXT,
  foto_path TEXT,
  ordem INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  platform public.social_platform NOT NULL,
  label TEXT,
  url TEXT NOT NULL,
  ordem INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Índices (listagens, ordenação, busca)
-- ---------------------------------------------------------------------------
CREATE INDEX podcasts_published_at_desc ON public.podcasts (published_at DESC NULLS LAST)
WHERE
  is_published = true;

CREATE INDEX noticias_published_at_desc ON public.noticias (published_at DESC NULLS LAST)
WHERE
  is_published = true;

CREATE INDEX podcasts_featured ON public.podcasts (published_at DESC)
WHERE
  is_published = true
  AND is_featured = true;

CREATE INDEX equipe_ordem ON public.equipe (ordem, nome);

CREATE INDEX social_links_ordem ON public.social_links (ordem)
WHERE
  is_active = true;

CREATE INDEX podcasts_title_trgm ON public.podcasts USING gin (title gin_trgm_ops);

CREATE INDEX podcasts_summary_trgm ON public.podcasts USING gin (summary gin_trgm_ops);

CREATE INDEX noticias_title_trgm ON public.noticias USING gin (title gin_trgm_ops);

CREATE INDEX noticias_summary_trgm ON public.noticias USING gin (summary gin_trgm_ops);

-- Conteúdo longo: índice opcional (comentar se migrations ficarem pesadas)
CREATE INDEX podcasts_content_trgm ON public.podcasts USING gin (content gin_trgm_ops);

CREATE INDEX noticias_content_trgm ON public.noticias USING gin (content gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER podcasts_touch_updated_at
BEFORE UPDATE ON public.podcasts
FOR EACH ROW
EXECUTE PROCEDURE public.touch_updated_at ();

CREATE TRIGGER noticias_touch_updated_at
BEFORE UPDATE ON public.noticias
FOR EACH ROW
EXECUTE PROCEDURE public.touch_updated_at ();

CREATE TRIGGER equipe_touch_updated_at
BEFORE UPDATE ON public.equipe
FOR EACH ROW
EXECUTE PROCEDURE public.touch_updated_at ();

CREATE TRIGGER social_links_touch_updated_at
BEFORE UPDATE ON public.social_links
FOR EACH ROW
EXECUTE PROCEDURE public.touch_updated_at ();

-- ---------------------------------------------------------------------------
-- Funções auxiliares RLS (SECURITY DEFINER — evita recursão em policies)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins a
    WHERE
      a.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins a
    WHERE
      a.user_id = auth.uid()
      AND a.role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_staff() FROM PUBLIC;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.equipe ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Admins: leitura para staff; mutações só admin
CREATE POLICY "admins_select_staff" ON public.admins FOR SELECT TO authenticated USING (public.is_staff());

CREATE POLICY "admins_insert_admin" ON public.admins FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "admins_update_admin" ON public.admins
FOR UPDATE
TO authenticated USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "admins_delete_admin" ON public.admins FOR DELETE TO authenticated USING (public.is_admin());

-- Podcasts: leitura pública só publicados
CREATE POLICY "podcasts_public_read" ON public.podcasts FOR
SELECT
  TO anon,
  authenticated USING (
    is_published = true
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

CREATE POLICY "podcasts_staff_select" ON public.podcasts FOR SELECT TO authenticated USING (public.is_staff());

CREATE POLICY "podcasts_staff_insert" ON public.podcasts FOR INSERT TO authenticated WITH CHECK (public.is_staff());

CREATE POLICY "podcasts_staff_update" ON public.podcasts
FOR UPDATE
TO authenticated USING (public.is_staff())
WITH CHECK (public.is_staff());

CREATE POLICY "podcasts_admin_delete" ON public.podcasts FOR DELETE TO authenticated USING (public.is_admin());

-- Notícias
CREATE POLICY "noticias_public_read" ON public.noticias FOR
SELECT
  TO anon,
  authenticated USING (
    is_published = true
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

CREATE POLICY "noticias_staff_select" ON public.noticias FOR SELECT TO authenticated USING (public.is_staff());

CREATE POLICY "noticias_staff_insert" ON public.noticias FOR INSERT TO authenticated WITH CHECK (public.is_staff());

CREATE POLICY "noticias_staff_update" ON public.noticias
FOR UPDATE
TO authenticated USING (public.is_staff())
WITH CHECK (public.is_staff());

CREATE POLICY "noticias_admin_delete" ON public.noticias FOR DELETE TO authenticated USING (public.is_admin());

-- Equipe
CREATE POLICY "equipe_public_read" ON public.equipe FOR
SELECT
  TO anon,
  authenticated USING (is_active = true);

CREATE POLICY "equipe_staff_all" ON public.equipe FOR ALL TO authenticated USING (public.is_staff())
WITH CHECK (public.is_staff());

-- Redes sociais
CREATE POLICY "social_public_read" ON public.social_links FOR
SELECT
  TO anon,
  authenticated USING (is_active = true);

CREATE POLICY "social_staff_all" ON public.social_links FOR ALL TO authenticated USING (public.is_staff())
WITH CHECK (public.is_staff());

-- ---------------------------------------------------------------------------
-- Storage (imagens públicas)
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "site_images_public_read" ON storage.objects FOR
SELECT
  USING (bucket_id = 'site-images');

CREATE POLICY "site_images_staff_insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'site-images'
  AND public.is_staff ()
);

CREATE POLICY "site_images_staff_update" ON storage.objects
FOR UPDATE
TO authenticated USING (bucket_id = 'site-images' AND public.is_staff ())
WITH CHECK (bucket_id = 'site-images' AND public.is_staff ());

CREATE POLICY "site_images_staff_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-images' AND public.is_staff ());

-- ---------------------------------------------------------------------------
-- Primeiro admin (executar UMA VEZ no SQL Editor com bypass RLS / role postgres):
--
-- INSERT INTO public.admins (user_id, role)
-- VALUES ('<uuid do auth.users>', 'admin');
--
-- O UUID vem de Authentication > Users após criar o usuário convidado.
-- ---------------------------------------------------------------------------
