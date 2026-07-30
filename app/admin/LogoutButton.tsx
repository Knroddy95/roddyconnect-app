"use client";

export default function LogoutButton() {
  async function handleDeconnexion() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <button
      onClick={handleDeconnexion}
      className="text-xs text-gray-400 underline"
    >
      Déconnexion
    </button>
  );
}
