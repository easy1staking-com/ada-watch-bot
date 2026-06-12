import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { WalletProvider } from "@/components/WalletContext";
import DelegationNudge from "@/components/DelegationNudge";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Ada Watch Bot — Cardano notifications on Telegram & Discord",
  description:
    "Real-time Cardano notifications: wallet activity, DeFi loan health, NFT marketplace events. Buy tokens from chat with non-custodial SundaeSwap strategies.",
  // apex is canonical — www redirects, and the X crawler dislikes hops
  metadataBase: new URL("https://adawatchbot.xyz"),
  openGraph: {
    title: "Ada Watch Bot",
    description:
      "Your Cardano wallet, in your pocket. Real-time notifications + one-tap token purchases on Telegram & Discord.",
    url: "https://adawatchbot.xyz",
    siteName: "Ada Watch Bot",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@AdaWatchBot",
    creator: "@cryptojoe101",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={jakarta.className}>
        <WalletProvider>
          <Nav />
          {children}
          <Footer />
          <DelegationNudge />
        </WalletProvider>
      </body>
    </html>
  );
}
