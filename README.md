# Conecta Aê — Portal de podcasts e notícias

Stack: **Next.js** (App Router), **TypeScript**, **Tailwind**, **Supabase** (Auth, DB, Storage), deploy na **Vercel**.

## Desenvolvimento

```bash
npm install
cp .env.example .env.local
# Edite .env.local com URL e chave anon do Supabase + NEXT_PUBLIC_SITE_URL

npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando            | Descrição                                           |
| ------------------ | --------------------------------------------------- |
| `npm run dev`      | Servidor de desenvolvimento                         |
| `npm run build`    | Build de produção                                   |
| `npm run start`    | Servidor após build                                 |
| `npm run lint`     | ESLint                                              |
| `npm run format`   | Prettier                                            |
| `npm run db:types` | Tipos TypeScript a partir do Supabase (CLI linkada) |

## Deploy (Fase 6)

Passo a passo completo: **[docs/DEPLOY.md](./docs/DEPLOY.md)** (Vercel, variáveis, domínio, Supabase, checklist e manutenção).

Health check em produção: `GET /api/health`.

## Documentação Next.js

[Documentação Next.js](https://nextjs.org/docs) · [Deploy na Vercel](https://vercel.com/docs)
