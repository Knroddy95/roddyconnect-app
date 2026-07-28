import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoddyConnect Wifi Zone",
  description: "Achète ton accès wifi en quelques secondes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
