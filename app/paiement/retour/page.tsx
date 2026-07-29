import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifierTransactionFedaPay } from "@/lib/fedapay";

function genererCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) {
    if (i === 4) out += "-";
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function PageCode({
  code,
  forfaitNom,
}: {
  code?: string;
  forfaitNom?: string;
}) {
  return (
    <main className="min-h-screen flex justify-center px-4 py-10">
      <div className="w-full max-w-sm flex flex-col items-center gap-4 text-center">
        <p className="font-display font-bold text-ink text-lg">
          Paiement confirmé — {forfaitNom}
        </p>
        <div className="w-full rounded-2xl py-6 flex flex-col items-center gap-2 bg-ink">
          <span className="text-gray-300 text-xs tracking-widest">
            CODE DE CONNEXION
          </span>
          <span className="font-display font-bold text-white text-2xl tracking-wider">
            {code}
          </span>
        </div>
        <p className="text-gray-400 text-xs">
          Saisis ce code sur la page de connexion wifi pour être en ligne.
        </p>
      </div>
    </main>
  );
}

function PageAttente({ statut }: { statut: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <p className="font-display font-bold text-ink text-lg mb-2">
          Paiement non confirmé
        </p>
        <p className="text-gray-500 text-sm">
          Statut : {statut}. Si tu as bien payé, réessaie dans quelques
          secondes en rechargeant cette page.
        </p>
      </div>
    </main>
  );
}

export default async function RetourPaiementPage({
  searchParams,
}: {
  searchParams: { vente?: string };
}) {
  const venteId = searchParams.vente;

  if (!venteId) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-500 text-sm">Vente introuvable.</p>
      </main>
    );
  }

  const { data: vente } = await supabaseAdmin
    .from("ventes")
    .select("*, forfaits(*)")
    .eq("id", venteId)
    .single();

  if (!vente) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-500 text-sm">Vente introuvable.</p>
      </main>
    );
  }

  if (vente.statut_paiement === "confirme") {
    const { data: code } = await supabaseAdmin
      .from("codes_wifi")
      .select("*")
      .eq("vente_id", vente.id)
      .single();

    return <PageCode code={code?.code} forfaitNom={vente.forfaits?.nom} />;
  }

  if (!vente.fedapay_transaction_id) {
    return <PageAttente statut="non initialisé" />;
  }

  const statut = await verifierTransactionFedaPay(
    vente.fedapay_transaction_id
  );

  if (statut !== "approved") {
    return <PageAttente statut={statut} />;
  }

  const code = genererCode();
  const heures = vente.forfaits?.duree_heures ?? 24;
  const expireLe = new Date(Date.now() + heures * 3600 * 1000).toISOString();

  await supabaseAdmin
    .from("ventes")
    .update({ statut_paiement: "confirme" })
    .eq("id", vente.id);

  await supabaseAdmin.from("codes_wifi").insert({
    vente_id: vente.id,
    code,
    statut: "actif",
    expire_le: expireLe,
  });

  return <PageCode code={code} forfaitNom={vente.forfaits?.nom} />;
}
