# Fase 6 — Deploy na Vercel e produção

Guia em português (Brasil) para colocar o portal no ar e operar com segurança.

## 1. Pré-requisitos

- Conta no [GitHub](https://github.com) com o código neste repositório.
- Conta na [Vercel](https://vercel.com) (recomendado: mesmo e-mail do GitHub).
- Projeto no [Supabase](https://supabase.com) com migrations aplicadas e primeiro admin criado (SQL do repositório).

## 2. Conectar o GitHub na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new).
2. **Import** o repositório `conecta-ae-podcast-portal` (ou o nome do seu repo).
3. **Framework Preset:** Next.js (detectado automaticamente).
4. **Root Directory:** raiz do repo (deixe em branco se o app está na raiz).
5. **Build Command:** `npm run build` (padrão).
6. **Output:** gerenciado pelo Next (padrão).
7. Clique em **Deploy** (primeiro deploy pode falhar até configurar as variáveis de ambiente — normal).

## 3. Variáveis de ambiente na Vercel

No projeto Vercel: **Settings → Environment Variables**.

| Variável                        | Ambiente            | Observação                                                                                            |
| ------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Production, Preview | URL do projeto Supabase                                                                               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview | Chave **anon** (pública)                                                                              |
| `NEXT_PUBLIC_SITE_URL`          | **Production**      | URL final com `https://` (ex.: `https://www.seudominio.com.br`)                                       |
| `NEXT_PUBLIC_SITE_URL`          | **Preview**         | Pode ser a URL de preview da Vercel (ex.: `https://seu-projeto.vercel.app`) para SEO/canonical em PRs |
| `NEXT_PUBLIC_OFFICE_IMAGE_URL`  | Opcional            | Imagem da página Sobre                                                                                |

**Não** defina `SUPABASE_SERVICE_ROLE_KEY` na Vercel a menos que tenha rotas server-only que precisem dela — e nunca com prefixo `NEXT_PUBLIC_`.

Depois de salvar as variáveis: **Deployments → … → Redeploy** no último deploy.

## 4. Supabase em produção

1. **Authentication → URL configuration**
   - **Site URL:** `https://seu-dominio.com.br` (produção).
   - **Redirect URLs:** inclua:
     - `https://seu-dominio.com.br/**`
     - `https://*.vercel.app/**` (previews, se usar login no preview).
2. Confirme que o banco de **produção** recebeu o SQL de `supabase/migrations/` (não misture com staging).
3. **Storage:** bucket `site-images` e políticas já definidas na migration.

## 5. Domínio customizado

1. Vercel: **Settings → Domains → Add** `seudominio.com.br` e/ou `www.seudominio.com.br`.
2. Siga as instruções de DNS (registro `A` / `CNAME` na sua hospedagem de domínio).
3. Ative **HTTPS** (automático na Vercel).
4. Atualize `NEXT_PUBLIC_SITE_URL` em **Production** para o domínio definitivo e faça redeploy.
5. Atualize **Site URL** e **Redirect URLs** no Supabase com o mesmo domínio.

## 6. GitHub (boas práticas)

- Branch principal: `main` protegida; **Pull Requests** obrigatórios para merge.
- **Vercel:** cada PR gera **Preview Deployment** — use para validar antes do merge.
- Produção: merge na `main` dispara deploy automático (padrão).

## 7. Pós-deploy (checklist rápido)

- [ ] Home, podcasts, notícias e admin carregam.
- [ ] Login admin funciona (cookies / domínio alinhados ao Supabase).
- [ ] Upload de imagens no admin grava no Storage.
- [ ] `https://seu-dominio/robots.txt` e `https://seu-dominio/sitemap.xml` respondem.
- [ ] `https://seu-dominio/api/health` retorna `{"ok":true}`.

## 8. Manutenção e operação

### Backup

- Plano **Pro** do Supabase: backups automáticos configuráveis no painel.
- Sem Pro: exporte dados periodicamente (SQL dump ou ferramentas do painel) e guarde em local seguro.

### Logs

- **Vercel:** projeto → **Logs** (runtime e build).
- **Supabase:** **Logs** para API, Auth e Postgres — útil para 401/RLS e erros de query.

### Monitoramento

- **Vercel Analytics / Speed Insights** (opcional, no painel do projeto).
- **Health check:** `GET /api/health` para UptimeRobot, Better Stack, etc.

### Segurança

- Rotação de chaves se suspeita de vazamento; **nunca** commitar `.env.local`.
- **2FA** no GitHub e na Vercel.
- Revisar periodicamente **RLS** e políticas de Storage no Supabase.

### Escalabilidade

- Tráfego médio: CDN da Vercel + Postgres do Supabase costuma bastar.
- Se a busca crescer muito, avaliar Meilisearch/Typesense no futuro.

---

Dúvidas frequentes: **canonical errado** — quase sempre `NEXT_PUBLIC_SITE_URL` diferente do domínio real; **login quebrado em produção** — URLs de redirect no Supabase ou cookie/domínio inconsistentes.
