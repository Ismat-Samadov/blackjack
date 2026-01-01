import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blackjack Game",
  description: "Play Blackjack - Hit, Stand, and Track Your Chips!",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
