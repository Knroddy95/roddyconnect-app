const FEDAPAY_SECRET_KEY = process.env.FEDAPAY_SECRET_KEY!;

// Sandbox pour l'instant. Pour la production, remplacer par :
// https://api.fedapay.com/v1
const FEDAPAY_BASE_URL = "https://sandbox-api.fedapay.com/v1";

export async function creerTransactionFedaPay({
  montant,
  description,
  telephone,
  callbackUrl,
}: {
  montant: number;
  description: string;
  telephone: string;
  callbackUrl: string;
}) {
  const creation = await fetch(`${FEDAPAY_BASE_URL}/transactions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${FEDAPAY_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description,
      amount: montant,
      currency: { iso: "XOF" },
      callback_url: callbackUrl,
      customer: {
        firstname: "Client",
        lastname: "RoddyConnect",
        phone_number: { number: telephone, country: "bj" },
      },
    }),
  });

  if (!creation.ok) {
    throw new Error("Impossible de créer la transaction FedaPay.");
  }

  const donneesCreation = await creation.json();
  const transactionId =
    donneesCreation["v1/transaction"]?.id ?? donneesCreation.id;

  const jeton = await fetch(
    `${FEDAPAY_BASE_URL}/transactions/${transactionId}/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FEDAPAY_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!jeton.ok) {
    throw new Error("Impossible de générer le lien de paiement.");
  }

  const donneesJeton = await jeton.json();
  const paymentUrl =
    donneesJeton["v1/transaction_token"]?.url ?? donneesJeton.url;

  return { transactionId: String(transactionId), paymentUrl };
}

export async function verifierTransactionFedaPay(transactionId: string) {
  const reponse = await fetch(
    `${FEDAPAY_BASE_URL}/transactions/${transactionId}`,
    {
      headers: { Authorization: `Bearer ${FEDAPAY_SECRET_KEY}` },
    }
  );

  if (!reponse.ok) {
    throw new Error("Impossible de vérifier la transaction.");
  }

  const donnees = await reponse.json();
  const transaction = donnees["v1/transaction"] ?? donnees;
  return transaction.status as string; // "approved" | "declined" | "pending" | ...
}
