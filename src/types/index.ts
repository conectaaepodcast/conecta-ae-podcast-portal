/**
 * Tipos compartilhados do app.
 * Schema alinhado a `supabase/migrations`. Regenerar com:
 * `npx supabase gen types typescript --linked > src/types/database.gen.ts`
 * (substituir/ fundir com `database.ts` quando usar CLI linkado ao projeto).
 */

export type {
  Database,
  EquipeCargo,
  Json,
  SocialPlatform,
  StaffRole,
  Tables,
  Enums,
} from "./database";

export type { StaffRole as Role } from "./database";
