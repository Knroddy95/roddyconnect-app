import { Suspense } from "react";
import PaiementForm from "./PaiementForm";

export default function PaiementPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
          Chargement...
        </div>
      }
    >
      <PaiementForm />
    </Suspense>
  );
}
