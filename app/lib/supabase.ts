import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  // En Niveau 1, on affiche juste un avertissement clair au lieu de planter
  // silencieusement si les variables d'environnement ne sont pas encore configurées.
  console.warn(
    "Variables Supabase manquantes : vérifie ton fichier .env.local (voir .env.local.example)"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Forfait = {
  id: string;
  nom: string;
  duree_heures: number;
  prix_fcfa: number;
  actif: boolean;
  ordre_affichage: number;
};
