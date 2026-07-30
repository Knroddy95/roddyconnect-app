import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import LoginForm from "./LoginForm";
import LogoutButton from "./LogoutButton";

function money(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

export default async function AdminPage() {
  const cookieStore = cookies();
  const session = cookieStore.get("admin_session")?.value;
  const motDePasseAdmin = process.env.ADMIN_PASSWORD;

  const estConnecte = !!session && session === motDePasseAdmin;

  if (!estConnecte) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <LoginForm />
      </main>
    );
  }

  const debutJour = new Date();
  debutJour.setHours(0, 0, 0, 0);

  const { data: ventesJour } = await supabaseAdmin
    .from("ventes")
    .select("*, forfaits(nom)")
    .gte("created_at", debutJour.toISOString())
    .order("created_at", { ascending: false });

  const { data: codesActifs } = await supabaseAdmin
    .from("codes_wifi")
    .select("id")
    .eq("statut", "actif");

  const { data: forfaits } = await supabaseAdmin
    .from("forfaits")
    .select("*")
    .order("ordre_affichage", { ascending: true });

  const ventesConfirmees = (ventesJour ?? []).filter(
    (v) => v.statut_paiement === "confirme"
  );
  const revenusJour = ventesConfirmees.reduce((s, v) => s + v.montant, 0);

  return (
    <main className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-display font-bold text-ink text-xl">
            Tableau de bord — aujourd'hui
          </p>
          <p className="text-gray-500 text-sm">RoddyConnect Wifi Zone</p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-2xl p-4 bg-white border border-gray-200">
          <p className="text-gray-500 text-xs font-semibold">
            Ventes du jour
          </p>
          <p className="font-display font-bold text-ink text-2xl mt-1">
            {ventesConfirmees.length}
          </p>
        </div>
        <div className="rounded-2xl p-4 bg-white border border-gray-200">
          <p className="text-gray-500 text-xs font-semibold">
            Revenus du jour
          </p>
          <p className="font-display font-bold text-blue text-2xl mt-1">
            {money(revenusJour)}
          </p>
        </div>
        <div className="rounded-2xl p-4 bg-white border border-gray-200">
          <p className="text-gray-500 text-xs font-semibold">Codes actifs</p>
          <p className="font-display font-bold text-ink text-2xl mt-1">
            {codesActifs?.length ?? 0}
          </p>
        </div>
        <div className="rounded-2xl p-4 bg-white border border-gray-200">
          <p className="text-gray-500 text-xs font-semibold">
            Forfaits actifs
          </p>
          <p className="font-display font-bold text-ink text-2xl mt-1">
            {forfaits?.filter((f) => f.actif).length ?? 0}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-gray-200">
          <p className="font-semibold text-ink text-sm">Ventes récentes</p>
        </div>
        {(!ventesJour || ventesJour.length === 0) && (
          <p className="p-4 text-sm text-gray-400">
            Aucune vente pour l'instant aujourd'hui.
          </p>
        )}
        {ventesJour?.map((v: any) => (
          <div
            key={v.id}
            className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0"
          >
            <div>
              <p className="text-sm text-ink font-medium">
                {v.forfaits?.nom ?? "Forfait"}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(v.created_at).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-ink font-semibold">
                {money(v.montant)}
              </p>
              <span
                className={`text-xs px-2 py-[2px] rounded-full ${
                  v.statut_paiement === "confirme"
                    ? "bg-blue-soft text-blue"
                    : v.statut_paiement === "echoue"
                    ? "bg-orange-soft text-ink"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {v.statut_paiement}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-gray-200 p-4">
        <p className="font-semibold text-ink text-sm mb-3">Forfaits</p>
        <div className="flex flex-col gap-2">
          {forfaits?.map((f: any) => (
            <div
              key={f.id}
              className="flex items-center justify-between text-sm"
            >
              <span
                className={f.actif ? "text-ink" : "text-gray-400 line-through"}
              >
                {f.nom}
              </span>
              <span className="text-blue font-semibold">
                {money(f.prix_fcfa)}
              </span>
            </div>
          ))}
        </div>
        <p className="text-gray-400 text-xs mt-3">
          Modifie les prix ou active/désactive un forfait directement dans
          Supabase (Table Editor → forfaits).
        </p>
      </div>
    </main>
  );
      }
