-- Ícone opcional por rede (bucket site-images, pasta social/{id}/…)
ALTER TABLE public.social_links
ADD COLUMN IF NOT EXISTS icon_path TEXT NULL;

COMMENT ON COLUMN public.social_links.icon_path IS 'Chave no bucket site-images (ex.: social/{uuid}/…).';
