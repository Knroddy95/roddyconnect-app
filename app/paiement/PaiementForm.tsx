"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

function dureeLabel(heures: number) {
  if (heures < 24) return `${heures} heure${heures > 1 ? "s" : ""}`;
  const jours = Math.round(heures / 24);
  return `${jours} jour${jours > 1 ? "s" : ""}`;
}

export default function PaiementForm() {
  const params = useSearchParams();
  const forfaitId = params.get("id") ?? "";
  const nom = params.get("nom") ?? "";
  const prix = Number(params.get("prix") ?? 0);
  const duree = Number(params.get("duree") ?? 0);

  const [telephone, setTelephone] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  async function handlePaiement() {
    setErreur("");
    if (telephone.trim().length < 6) {
      setErreur("Entre un numéro de téléphone valide.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/paiement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forfaitId, telephone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de paiement.");
      window.location.href = data.paymentUrl;
    } catch (err: any) {
      setErreur(err.message || "Une erreur est survenue.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex justify-center px-4 py-10">
      <div className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="font-display font-bold text-ink text-xl">Paiement</h1>

        <div className="rounded-2xl p-4 bg-blue-soft flex items-center justify-between">
          <div>
            <p className="font-display font-bold text-ink text-base">{nom}</p>
            <p className="text-gray-500 text-xs">{dureeLabel(duree)}</p>
          </div>
          <span className="font-display font-bold text-blue text-lg">
            {prix.toLocaleString("fr-FR")} FCFA
          </span>
        </div>

        <div>
          <p className="text-ink text-sm font-semibold mb-2">
            Numéro Mobile Money (MTN ou Moov)
          </p>
          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="Ex : 97000000"
            className="w-full rounded-xl px-3 py-3 border border-gray-300 text-sm"
          />
        </div>

        {erreur && (
          <div className="rounded-xl bg-orange-soft p-3 text-sm text-ink">
            {erreur}
          </div>
        )}

        <button
          onClick={handlePaiement}
          disabled={loading}
          className="w-full rounded-xl py-3 font-display font-bold text-white bg-blue disabled:opacity-50"
        >
          {loading
            ? "Redirection..."
            : `Payer ${prix.toLocaleString("fr-FR")} FCFA`}
        </button>
      </div>
    </main>
  );
}
