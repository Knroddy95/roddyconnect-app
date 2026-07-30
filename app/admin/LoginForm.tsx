"use client";

import { useState } from "react";

export default function LoginForm() {
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleConnexion() {
    setErreur("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motDePasse }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Connexion impossible.");
      }
      window.location.reload();
    } catch (err: any) {
      setErreur(err.message || "Une erreur est survenue.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <div>
        <p className="font-display font-bold text-ink text-xl">
          Espace agent
        </p>
        <p className="text-gray-500 text-sm">
          Entre le mot de passe pour accéder au tableau de bord.
        </p>
      </div>
      <input
        type="password"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
        placeholder="Mot de passe"
        className="w-full rounded-xl px-3 py-3 border border-gray-300 text-sm"
      />
      {erreur && (
        <div className="rounded-xl bg-orange-soft p-3 text-sm text-ink">
          {erreur}
        </div>
      )}
      <button
        onClick={handleConnexion}
        disabled={loading}
        className="w-full rounded-xl py-3 font-display font-bold text-white bg-blue disabled:opacity-50"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </div>
  );
  }
