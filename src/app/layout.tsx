import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Beafrica WebTV | Chaîne officielle",
    template: "%s | Beafrica WebTV",
  },
  description:
    "Beafrica WebTV couvre l'actualité politique béninoise, les débats en direct et les échanges avec la diaspora.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} antialiased`}>
        <Header />
        {children}
        <Footer />
        <MobileNav />
        <Analytics />
      </body>
    </html>
  );
}
