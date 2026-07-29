import Link from "next/link";
import { supabase, type Forfait } from "@/lib/supabase";

function dureeLabel(heures: number) {
  if (heures < 24) return `${heures} heure${heures > 1 ? "s" : ""}`;
  const jours = Math.round(heures / 24);
  return `${jours} jour${jours > 1 ? "s" : ""}`;
}

function prixLabel(fcfa: number) {
  return `${fcfa.toLocaleString("fr-FR")} FCFA`;
}

export default async function CataloguePage() {
  const { data: forfaits, error } = await supabase
    .from("forfaits")
    .select("*")
    .eq("actif", true)
    .order("ordre_affichage", { ascending: true });

  return (
    <main className="min-h-screen flex justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <header className="flex items-center gap-2 mb-6">
          <div className="flex items-end gap-[3px] h-5">
            {[0.35, 0.55, 0.75, 1].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-blue rounded-sm"
                style={{ height: `${h * 20}px` }}
              />
            ))}
          </div>
          <div className="leading-none">
            <p className="font-display font-bold text-ink text-base">
              RoddyConnect
            </p>
            <p className="text-blue font-semibold text-[9px] tracking-widest">
              WIFI ZONE
            </p>
          </div>
        </header>

        <h1 className="font-display font-bold text-ink text-xl mb-1">
          Choisis ton forfait
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Paiement Mobile Money ou espèces, code envoyé aussitôt.
        </p>

        {error && (
          <div className="rounded-xl bg-orange-soft p-4 text-sm text-ink">
            Impossible de charger les forfaits. Vérifie que le schéma
            Supabase a bien été exécuté et que les variables d'environnement
            sont configurées (voir README).
          </div>
        )}

        {!error && (!forfaits || forfaits.length === 0) && (
          <div className="rounded-xl bg-blue-soft p-4 text-sm text-ink">
            Aucun forfait actif pour l'instant. Ajoute-en depuis la table
            <code className="mx-1">forfaits</code> dans Supabase.
          </div>
        )}

        <div className="flex flex-col gap-3">
          {forfaits?.map((f: Forfait) => (
            <Link
              key={f.id}
              href={`/paiement?id=${f.id}&nom=${encodeURIComponent(
                f.nom
              )}&prix=${f.prix_fcfa}&duree=${f.duree_heures}`}
              className="rounded-2xl p-4 bg-white border border-gray-200 block active:opacity-70"
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-ink text-base">
                  {f.nom}
                </span>
                <span className="font-display font-bold text-blue text-base">
                  {prixLabel(f.prix_fcfa)}
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {dureeLabel(f.duree_heures)}
              </p>
            </Link>
          ))}
        </div>

        <p className="text-gray-400 text-xs mt-6 text-center">
          Choisis un forfait pour lancer le paiement Mobile Money.
        </p>
      </div>
    </main>
  );
}
