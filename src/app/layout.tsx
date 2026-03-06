import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stellar Insight — Multi-Wallet Dashboard",
  description:
    "Track multiple Stellar wallets in one place. View balances, tokens, NFTs, and transaction history — no wallet connection required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased min-h-screen bg-slate-900 text-slate-100`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
