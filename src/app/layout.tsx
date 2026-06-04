import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Space_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import { SanityLive } from "@/sanity/lib/live";
import { isSanityPreviewRequest } from "@/sanity/preview";
import { defaultLocale } from "@/lib/i18n";
import { VisualEditing } from "next-sanity/visual-editing";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Alicja - Information Architecture",
  description: "I help organizations remember and define what they know.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isPreview = await isSanityPreviewRequest();

  return (
    <html lang={defaultLocale} className={`${cormorant.variable} ${inter.variable} ${spaceMono.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <SanityLive includeDrafts={isPreview} />
        <VisualEditing />
      </body>
    </html>
  );
}
