import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Ce client contourne les règles de sécurité (RLS) — il ne doit JAMAIS
// être utilisé dans un composant côté navigateur, uniquement dans les
// routes API et composants serveur.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
