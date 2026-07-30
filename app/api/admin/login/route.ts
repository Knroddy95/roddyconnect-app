import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { motDePasse } = await request.json();
  const motDePasseAdmin = process.env.ADMIN_PASSWORD;

  if (!motDePasseAdmin || motDePasse !== motDePasseAdmin) {
    return NextResponse.json(
      { error: "Mot de passe incorrect." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", motDePasseAdmin, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
  return response;
}
