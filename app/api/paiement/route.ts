import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { creerTransactionFedaPay } from "@/lib/fedapay";

export async function POST(request: NextRequest) {
  try {
    const { forfaitId, telephone } = await request.json();

    if (!forfaitId || !telephone) {
      return NextResponse.json(
        { error: "Forfait et numéro de téléphone requis." },
        { status: 400 }
      );
    }

    const { data: forfait, error: forfaitError } = await supabaseAdmin
      .from("forfaits")
      .select("*")
      .eq("id", forfaitId)
      .single();

    if (forfaitError || !forfait) {
      return NextResponse.json(
        { error: "Forfait introuvable." },
        { status: 404 }
      );
    }

    const { data: vente, error: venteError } = await supabaseAdmin
      .from("ventes")
      .insert({
        forfait_id: forfait.id,
        montant: forfait.prix_fcfa,
        methode_paiement: "momo",
        statut_paiement: "en_attente",
      })
      .select()
      .single();

    if (venteError || !vente) {
      return NextResponse.json(
        { error: "Impossible de créer la vente." },
        { status: 500 }
      );
    }

    const origin = request.nextUrl.origin;
    const callbackUrl = `${origin}/paiement/retour?vente=${vente.id}`;

    const { transactionId, paymentUrl } = await creerTransactionFedaPay({
      montant: forfait.prix_fcfa,
      description: `Forfait wifi ${forfait.nom}`,
      telephone,
      callbackUrl,
    });

    await supabaseAdmin
      .from("ventes")
      .update({ fedapay_transaction_id: transactionId })
      .eq("id", vente.id);

    return NextResponse.json({ paymentUrl });
  } catch (erreur) {
    console.error(erreur);
    return NextResponse.json(
      { error: "Une erreur est survenue pendant le paiement." },
      { status: 500 }
    );
  }
}
